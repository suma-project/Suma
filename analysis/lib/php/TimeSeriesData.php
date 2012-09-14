<?php 

require_once '../../lib/php/underscore.php';
require_once '../../lib/php/ServerIO.php';
require_once '../../lib/php/Gump.php';
require_once '../../lib/php/SumaGump.php';

/**
 * TimeSeriesData - Class to process data for display in a time series.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class TimeSeriesData
{
    /**
     * Define weekdays
     * 
     * @var array
     * @access  public
     */
    public $weekdays = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
    /**
     * Define weekends
     * 
     * @var array
     * @access  public
     */
    public $weekends = array('Saturday', 'Sunday');
    /**
     * Define full week
     * 
     * @var array
     * @access  public
     */
    public $all      = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    /**
     * Main hash to store data as it is retrieved from the server
     * 
     * @var array
     * @access  public
     */
    public $countHash = array();
    /**
     * Stores location ids for filtering
     * 
     * @var NULL
     * @access  private
     */
    private $locListIds = NULL;
    /**
     * Stores activity ids for filtering
     * 
     * @var array
     * @access  private
     */
    private $actList = array();
    /**
     * Error Message
     *
     * @access  public
     * @param  array $e Event array
     */
    public function echo500($e)
    {
        header("HTTP/1.1 500 Internal Server Error");
        echo "<h1>500 Internal Server Error</h1>";
        echo "<p>An error occurred on the server which prevented your request from being completed: <strong>" . $e->getMessage() . "</strong></p>";
        die;
    }
    /**
     * Validates form input from client
     *
     * @access  public
     * @param  array $input Form input from client
     * @return array
     */
    public function validateInput($input)
    {
        // Initialize SumaGump class
        $validator = new SumaGump();

        // Sanitize input
        $input = $validator->sanitize($input);

        // Define filters
        $filters = array(
            'avgsum'     => 'trim',
            'daygroup'   => 'trim',
            'id'         => 'trim',
            'sdate'      => 'trim|sanitize_numbers|rmhyphen',
            'edate'      => 'trim|sanitize_numbers|rmhyphen',
            'stime'      => 'trim|sanitize_numbers',
            'etime'      => 'trim|sanitize_numbers'
        );

        // Define validation rules
        $rules = array(
            'avgsum'     => 'alpha',
            'daygroup'   => 'alpha',
            'id'         => 'required|numeric'
        );

        // Filter input
        $input = $validator->filter($input, $filters);

        // Validate input
        $validated = $validator->validate($input, $rules);

        // If input validates, return params array
        if ($validated === TRUE)
        {
            $params = array(
                    'activities' => $input['activities'],
                    'avgsum'     => $input['avgsum'],
                    'daygroup'   => $input['daygroup'],
                    'id'         => $input['id'],
                    'locations'  => $input['locations'],
                    'sdate'      => $input['sdate'],
                    'edate'      => $input['edate'],
                    'stime'      => $input['stime'],
                    'etime'      => $input['etime']
            );

            // Manipulate activities field, maybe not the best place for this
            // but this is where the main params array is being built
            $actSplit = explode("-", $params['activities']);
            $actType  = $actSplit[0];
            $actId    = $actSplit[1];

            $params['actType'] = $actType;
            $params['actId']   = $actId;

            // If end date parameter is greater than or equal
            // to today, set end date to yesterday
            $today = date('Ymd');

            if ($params['edate'] > $today)
            {
                $params['edate'] = $today;
            }

            return $params;
        }
        else
        {
            throw new Exception('Input Error.'); 
        }
        
    }
    /**
     * Builds params to pass to Suma server
     *
     * @access  public
     * @param  array $params 
     * @return array
     */
    public function populateSumaParams($params)
    {
        // Build suma array
        $sumaParams = array(
            'id'     => $params['id'],
            'format' => $params['format'],
            'sdate'  => $params['sdate'],
            'edate'  => $params['edate'],
            'stime'  => $params['stime'],
            'etime'  => $params['etime'],
        );

        // Remove any empty parameters
        foreach ($sumaParams as $key => $value)
        {
            if (empty($value))
            {
                unset($sumaParams[$key]);
            }
        }

        return $sumaParams;
    }
    /**
     * Creates a date range array
     *
     * @access  public
     * @param  string $dateFrom 
     * @param  string $dateTo
     * @return array
     */
    public function createDateRangeArray($dateFrom, $dateTo)
    {
        // takes two dates formatted as YYYYMMDD and creates an
        // inclusive array of the dates between the from and to dates.

        $dateRange = array();
        $tsFrom    = strtotime($dateFrom);
        $tsTo      = strtotime($dateTo);

        if ($tsTo >= $tsFrom)
        {
            $dateRange[] = date('Y-m-d', $tsFrom);
            while ($tsFrom < $tsTo)
            {
                $tsFrom += 60 * 60 * 24;
                $dateRange[] = date('Y-m-d', $tsFrom);
            }
        }

        return $dateRange;
    }
    /**
     * Creates an array of location ids for filtering
     *
     * @access  public
     * @param  array $locDict
     * @param  string $locID
     * @param  array  $locArray 
     * @return array
     */
    public function populateLocations($locDict, $locID, $locArray = array())
    {
        // Convert locID to integer
        if (is_numeric($locID))
        {
            $locID = (int)$locID;
        }

        // Build array of locations that match locID 
        // or have locID as a parent
        foreach ($locDict as $loc)
        {
            if ($locID === $loc['id'])
            {
                $locArray[] = $loc;
            }
            elseif ($locID === $loc['fk_parent'])
            { 
                $newLocID = $loc['id'];
                $locArray[] = $loc;
                $this->populateLocations($locDict, $newLocID, $locArray);
            }
        }

        return $locArray;
    }
    /**
     * Creates an array of activity ids for filtering
     *
     * @access  public
     * @param  array $actDict
     * @param  string $actID
     * @param  string $actType
     * @return array
     */
    public function populateActivities($actDict, $actID, $actType) {
        $actArray = array();
        // If actID is an activityGroup, find its children
        // otherwise, return the actID
        if ($actType === 'activityGroup')
        {
            foreach ($actDict as $act)
            {
                if ($act['activityGroup'] === (int)$actID)
                {
                    $actArray[] = $act['id'];
                }
            }
        }
        else
        {
            $actArray[] = $actID;
        }

        return $actArray;
    }
    /**
     * Populates countHash class variable with data from Server
     *
     * @access  public
     * @param  array $response Response from Suma server
     * @param  array $params
     */
    public function populateHash($response, $params)
    {
        $actID   = $params['actId'];
        $actType = $params['actType'];
        $locID   = $params['locations'];
        $actDict = $response['initiative']['dictionary']['activities'];
        $locDict = $response['initiative']['dictionary']['locations'];

        // Populate location list for filters
        if (!isset($this->locListIds))
        {
            if ($locID !== 'all')
            {
                $locList    = $this->populateLocations($locDict, $locID);
                $this->locListIds = __::pluck($locList, 'id');
            }
        }
        
        // Populate activity list for filters
        if (empty($this->actList))
        {
            if ($actID !== 'all'){
                $this->actList = $this->populateActivities($actDict, $actID, $actType);
            }
        }

        // If response is by sessions
        if (isset($response['initiative']['sessions']))
        {
            $sessions = $response['initiative']['sessions'];
            foreach ($sessions as $sess)
            {
                // Get date of session
                $day = substr($sess['start'], 0, -9);

                // Convert date to day of the week
                $weekday = date('l', strtotime($day));

                // Test if weekday is in days array (filter)
                if (in_array($weekday, $params['days']))
                {
                    if (!isset($this->countHash[$day]))
                    {
                        $this->countHash[$day] = array();
                    }

                    if (!isset($this->countHash[$day][$sess['id']]))
                    {   
                        $this->countHash[$day][$sess['id']] = array();
                    }

                    $sessLocations = $sess['locations'];

                    foreach ($sessLocations as $loc)
                    {
                        // Test if location is in locations array
                        if ($params['locations'] === 'all' || in_array($loc['id'], $this->locListIds))
                        {
                            $counts = $loc['counts'];
                            foreach ($counts as $count)
                            {
                                // Grab activities associated with count
                                $countActs = __::pluck($count['activities'], 'id');

                                // Test for intersection between input and count activities
                                $intersect = __::intersection($countActs, $this->actList);

                                if ($params['activities'] === 'all' || $intersect)
                                {
                                    if (!isset($this->countHash[$day][$sess['id']][$loc['id']]))
                                    {
                                        $this->countHash[$day][$sess['id']][$loc['id']] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash[$day][$sess['id']][$loc['id']] += $count['number'];
                                    }
                                }
                            }
                        }
                    }
                }            
            }
        }
        // If response is by counts
        elseif (isset($response['initiative']['locations']))
        {
            $locations = $response['initiative']['locations'];
            foreach ($locations as $loc)
            {
                // Test if location is in location array
                if ($params['locations'] === 'all' || in_array($loc['id'], $this->locListIds))
                {
                    $counts = $loc['counts'];
                   
                    foreach ($counts as $count)
                    {
                        // Get date of count
                        $day = substr($count['time'], 0, -9);

                        // Convert date to day of the week
                        $weekday = date('l', strtotime($day));

                        // Grab activities associated with count
                        $countActs = __::pluck($count['activities'], 'id');

                        // Test for intersection between input and count activities
                        $intersect = __::intersection($countActs, $this->actList);

                        // Test if weekday is in days array AND if count matches requested activities
                        if ((in_array($weekday, $params['days'])) && ($params['activities'] === 'all' || $intersect))
                        {
                            if (!isset($this->countHash[$day]))
                            {
                                $this->countHash[$day]['dayCount'] = $count['number'];
                            }
                            else
                            {
                                $this->countHash[$day]['dayCount'] += $count['number'];
                            }
                        }
                    }
                }
            }
           
        }
        else
        {
            throw new Exception('Error retrieving data.');
        }
    }
    /**
     * Returns array with calculations of mean based on locations
     *
     * @access  public
     * @param  array $countHash
     * @return array
     */
    public function calculateAvg($countHash) 
    {
        $avgHash = array();

        // Total the counts for each location on each day, keeping track of appropriate divisor
        foreach ($countHash as $date => $day)
        {
            foreach ($day as $sessID => $sess)
            {   
                foreach ($sess as $locationID => $count)
                {
                    if (!isset($avgHash[$date][$locationID]))
                    {
                        $avgHash[$date][$locationID] = array('count' => $count, 'divisor' => 1);
                    }
                    else
                    {
                        $avgHash[$date][$locationID]['count'] += $count;
                        $avgHash[$date][$locationID]['divisor'] += 1;
                    }
                }
            }
        }

        // For each day, calculate the average for each location
        foreach ($avgHash as $date => $day)
        {
            $total = 0;
            foreach ($day as $locationID => $location)
            {
                $avgHash[$date][$locationID]['avg'] = $avgHash[$date][$locationID]['count'] / $avgHash[$date][$locationID]['divisor'];
                $total += $avgHash[$date][$locationID]['avg'];
            }

            $avgHash[$date]['dayCount'] = $total;
        }

       return $avgHash;
    }
    /**
     * Function that removes days outside of the 
     * query range that might have been pulled in 
     * by sessions and pads the data set with 
     * zero values for any days in the range/filter set
     * that doesn't have a count.
     *
     * @access  public
     * @param  array $data
     * @param  array $params
     * @return array
     */
    public function cullData($data, $params)
    {
        $sdate = $params['sdate'];
        $edate = $params['edate'];

        // If $sdate and $edate are empty, say for a full query, set dummy values
        // using min/max values of data from server
        if (empty($sdate))
        {
            $keys  = __::keys($data);
            $sdate = __::min($keys);
            $sdate = str_replace("-", "", $sdate);
        }

        if (empty($edate))
        {
            $keys  = __::keys($data);
            $edate = __::max($keys);
            $edate = str_replace("-", "", $edate);

        }

        //Pad out missing dates with zero counts
        $dateRange = $this->createDateRangeArray($sdate, $edate);

        foreach ($dateRange as $date)
        {
            if (!isset($data[$date]))
            {
                $weekday = date('l', strtotime($date));
                // This check is to avoid padding days we don't want
                if (in_array($weekday, $params['days']))
                {
                    $data[$date]['dayCount'] = 0;
                }
            }
        }

        //Remove any days outside of query range (Sessions will sometimes pull in extra days)
        $sdate = strtotime($sdate);
        $sdate = date('Y-m-d', $sdate);
        $edate = strtotime($edate);
        $edate = date('Y-m-d', $edate);

        foreach($data as $key => $val) 
        {
            if (($key < $sdate) || ($key > $edate))
            {
                unset($data[$key]);
            }
        }

        return $data;
    }
}