<?php 

require_once '../../lib/ChromePhp.php';
require_once '../../lib/underscore.php';
require_once '../../lib/ServerIO.php';
require_once '../../lib/Gump.php';
require_once '../../lib/SumaGump.php';

class TimeSeriesData
{
    // Build possible arrays for daygroup filter from client
    public $weekdays = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
    public $weekends = array('Saturday', 'Sunday');
    public $all      = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

    public $locListIds;
    public $actList = array();
    public $countHash = array();

    public function echo500($e)
    {
        header("HTTP/1.1 500 Internal Server Error");
        echo "<h1>500 Internal Server Error</h1>";
        echo "<p>An error occurred on the server which prevented your request from being completed: <strong>" . $e->getMessage() . "</strong></p>";
        die;
    }

    public function validateInput($input)
    {
        $validator = new SumaGump();

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

    public function populateSumaParams($params)
    {
        $sumaParams = array(
            'id'     => $params['id'],
            'format' => $params['format'],
            'sdate'  => $params['sdate'],
            'edate'  => $params['edate'],
            'stime'  => $params['stime'],
            'etime'  => $params['etime'],
        );

        foreach ($sumaParams as $key => $value)
        {
            if (empty($value))
            {
                unset($sumaParams[$key]);
            }
        }

        return $sumaParams;
    }

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

    public function populateLocations($locDict, $locID, $locArray = array())
    {
        if (is_numeric($locID))
        {
            $locID = (int)$locID;
        }

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
                populateLocations($locDict, $newLocID, $locArray);
            }
        }

        return $locArray;
    }

    public function populateActivities($actDict, $actID, $actType) {
        $actArray = array();

        if ($actType === 'activityGroup')
        {
            foreach ($actDict as $act)
            {
                if ($act['activityGroup'] === $actId)
                {
                    $actArray[] = $act['id'];
                }
            }
        }
        else
        {
            $actArray[] = $actId;
        }

        return $actArray;
    }

    public function populateHash($response, $params)
    {
        $actID   = $params['actId'];
        $actType = $params['actType'];
        $locID   = $params['locations'];
        $actDict = $response['initiative']['dictionary']['activities'];
        $locDict = $response['initiative']['dictionary']['locations'];

        if (!isset($this->locListIds))
        {
            if ($locID !== 'all')
            {
                $locList    = $this->populateLocations($locDict, $locID);
                $this->locListIds = __::pluck($locList, 'id');
            }
        }
        
        if (empty($this->actList))
        {
            if ($actID !== 'all'){
                // $actList = populateActivities($actDict, $actID, $actType);
                // Once activity groups are implemented, use above code
                // and delete $actList = array($actID)
                $actList = array($actID);
            }
        }

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