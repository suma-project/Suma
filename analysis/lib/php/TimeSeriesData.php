<?php

require_once '../../lib/php/ServerIO.php';
require_once '../../lib/php/Gump.php';
require_once '../../lib/php/SumaGump.php';

// Suppress Error Reporting
error_reporting(0);
ini_set('display_errors', 0);

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
    public $all = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
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
    private $locListIds = array();
    /**
     * Stores activity ids for filtering
     *
     * @var array
     * @access  private
     */
    private $actListIds = array();
    /**
     * Stores scaffold array for csvArray
     * @var array
     * @access private
     */
    private $actHash = array();
    private $locHash = array();
    private $csvScaffold = NULL;
    private $hourSumScaffold = NULL;
    /**
     * Method to populate $csvScaffold, used for csv count collection
     * @param  array $locListIds
     * @param  array $actListIds
     * @return array
     */
    private function buildCSVScaffold ($actDict, $locDict)
    {
        $scaffoldArray = array(
                'date' => NULL,
                'total' => NULL,
                'locations' => array(),
                'activities' => array()
            );

        if(empty($this->actHash))
        {
            foreach($actDict as $act)
            {
                $this->actHash[$act['id']] = $act['title'];
            }
        }

        if(empty($this->locHash))
        {
            foreach($locDict as $loc)
            {
                $this->locHash[$loc['id']] = $loc['title'];
            }
        }

        if (empty($this->actListIds))
        {
            foreach($actDict as $act)
            {
                $scaffoldArray['activities'][$act['title']] = NULL;
            }
        }
        else
        {
            foreach($this->actListIds as $act)
            {
                $name = $this->actHash[$act];
                $scaffoldArray['activities'][$name] = NULL;
            }
        }

        if(empty($this->locListIds))
        {
            foreach($locDict as $loc)
            {
                $scaffoldArray['locations'][$loc['title']] = NULL;
            }
        }
        else
        {
            foreach($this->locListIds as $loc)
            {
                $name = $this->locHash[$loc];
                $scaffoldArray['locations'][$name] = NULL;
            }
        }

        // Add _No Activity key to both arrays
        $this->actHash['_No Activity'] = '_No Activity';
        $scaffoldArray['activities']['_No Activity'] = NULL;

        return $scaffoldArray;
    }
    private function buildHourSummaryScaffold()
    {
        $array = array();

        for ($i = 0; $i <= 23; $i++)
        {
            $array[$i] = 0;
        }

        return $array;
    }
    private function buildHourSummaryScaffoldAvg()
    {
        $array = array();
        $subArray = array(
                "sum" => NULL,
                "avg" => NULL,
                "hourCounts" => array(),
                "avgDays" => NULL,
                "divisor" => NULL
            );

        for ($i = 0; $i <= 23; $i++)
        {
            $array[$i] = $subArray;
        }

        return $array;
    }
    private function buildDailyHourSummaryScaffold()
    {
        $array = array();

        for ($i = 0; $i <= 6; $i++)
        {
            $array[$i] = $this->buildHourSummaryScaffoldAvg();
        }

        return $array;
    }
    /**
     * Builds a hash of divisors for calculating
     * daily averages within the dailyHourSummary
     * dataset.
     * @param  array $params Form parameters
     * @return array         Array with day indices and divisor values
     */
    private function buildHourlyDivisors($params)
    {
        $hash = array();

        for ($i = 0; $i <= 6; $i++)
        {
            $hash[$i] = 0;
        }

        $sdate = $params['sdate'];
        $edate = $params['edate'];

        // If $sdate and $edate are empty, say for a full query, set dummy values
        // using min/max values of data from server
        if (empty($sdate))
        {
            $keys  = array_keys($countHash['periodSum']);
            $sdate = min($keys);
            $sdate = str_replace("-", "", $sdate);
        }

        if (empty($edate))
        {
            $keys  = array_keys($countHash['periodSum']);
            $edate = max($keys);
            $edate = str_replace("-", "", $edate);
        }

        $diff = abs(strtotime($edate . 'Z') - strtotime($sdate . 'Z'));

        // Add 1 and convert to integer
        $daysInRange = round(($diff / (60 * 60 * 24))) + 1;

        // Detect remainder
        $extras = $daysInRange % 7;

        // Bulk of series
        $mainChunk = $daysInRange - $extras;

        // Get index of start date (same as first day of extras)
        $startDayIndex = date('w', strtotime($sdate));

        // Add bulk count to each day
        foreach($hash as $key => $day)
        {
            $hash[$key] += $mainChunk / 7;
        }

        // Add extras to appropriate days
        for ($i = 0; $i < $extras; $i++)
        {
            $dayIndex = $i + $startDayIndex;
            if ($dayIndex > 6)
            {
                $dayIndex = $dayIndex - 7;
            }

            $hash[$dayIndex]++;
        }

        return $hash;
    }
    /**
     * Basic pluck method
     * @param  array $input
     * @param  string $key
     * @return array
     */
    private function pluck($input, $key)
    {
        if (is_array($key) || !is_array($input))
        {
            return array();
        }

        $array = array();

        foreach ($input as $v)
        {
            if (array_key_exists($key, $v))
            {
                $array[] = $v[$key];
            }
        }

        return $array;
    }
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
            'daygroup'   => 'trim',
            'id'         => 'trim',
            'sdate'      => 'trim|sanitize_numbers|rmhyphen',
            'edate'      => 'trim|sanitize_numbers|rmhyphen',
            'stime'      => 'trim|sanitize_numbers',
            'etime'      => 'trim|sanitize_numbers',
            'session'    => 'trim'
        );

        // Define validation rules
        $rules = array(
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
                    'daygroup'   => $input['daygroup'],
                    'id'         => $input['id'],
                    'locations'  => $input['locations'],
                    'sdate'      => $input['sdate'],
                    'edate'      => $input['edate'],
                    'stime'      => $input['stime'],
                    'etime'      => $input['etime'],
                    'session'    => $input['session'],
                    'session_filter' => $input['session_filter']
            );

            // Manipulate activities field, maybe not the best place for this
            // but this is where the main params array is being built
            if ($params['activities'] !== 'all')
            {
                $actSplit = explode("-", $params['activities']);
                $actType  = $actSplit[0];
                $actId    = $actSplit[1];
            }
            else
            {
                $actType = NULL;
                $actId   = 'all';
            }

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
            'etime'  => $params['etime']
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
            elseif ($locID === $loc['parent'])
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
            $actArray[] = (int)$actID;
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
        $bin     = $params['session'];
        $include_sessions = $params['session_filter'];

        // Populate location list for filters
        if (empty($this->locListIds))
        {
            if ($locID !== 'all')
            {
                $locList    = $this->populateLocations($locDict, $locID);
                $this->locListIds = $this->pluck($locList, 'id');
            }
        }
        // Populate activity list for filters
        if (empty($this->actListIds))
        {
            if ($actID !== 'all'){
                $this->actListIds = $this->populateActivities($actDict, $actID, $actType);
            }
        }
        // Populate $csvScaffold for csv array
        if (!isset($this->csvScaffold))
        {
            $this->csvScaffold = $this->buildCSVScaffold($actDict, $locDict);
        }

        // Populate hour summary scaffold
        if (!isset($this->countHash['hourSummary']))
        {
            $this->countHash['hourSummary'] = $this->buildHourSummaryScaffold();
        }

        // Populate daily hour summary scaffold
        if (!isset($this->countHash['dailyHourSummary']))
        {
            $this->countHash['dailyHourSummary'] = $this->buildDailyHourSummaryScaffold();
        }

        if (isset($response['initiative']['sessions']))
        {
            $sessions = $response['initiative']['sessions'];
            foreach ($sessions as $sess)
            {
                $sessLocations = $sess['locations'];
                foreach ($sessLocations as $loc)
                {
                    // Test if location is in locations array
                    if ($params['locations'] === 'all' || in_array($loc['id'], $this->locListIds))
                    {
                        $counts = $loc['counts'];
                        foreach ($counts as $count)
                        {
                            // Get date based on count or session
                            if ($bin === 'count')
                            {
                                $day = substr($count['time'], 0, -9);
                            }
                            elseif ($bin === 'start') {
                                $day = substr($sess['start'], 0, -9);
                            }
                            elseif ($bin === 'end')
                            {
                                $day = substr($sess['end'], 0, -9);
                            }

                            // Convert date to day of the week
                            $weekday = date('l', strtotime($day));
                            $weekdayInt = date('w', strtotime($day));

                            // Convert date to hour of day
                            $hour = date('G', strtotime($count['time']));

                            if (in_array($weekday, $params['days']))
                            {
                                if ($include_sessions === 'false')
                                {
                                    // Honor date filters and remove extra days pulled in by session
                                    $sDate = $params['sdate'];
                                    $eDate = $params['edate'];
                                    $tDate = str_replace('-', '', $day);

                                    // Enforce start date filter
                                    if (!empty($sDate) && $tDate < $sDate)
                                    {
                                        continue;
                                    }

                                    // Enforce end date filter
                                    if (!empty($eDate) && $tDate > $eDate)
                                    {
                                        continue;
                                    }

                                    // Honor time filters using count time and input params
                                    $cTime = str_replace(':', '', substr($count['time'], -8, 5));
                                    $sTime = $params['stime'];
                                    $eTime = $params['etime'];

                                    // Both stime and etime filters are present
                                    if (!empty($sTime) && !empty($eTime))
                                    {
                                        // Ordered time range
                                        if ($sTime < $eTime)
                                        {
                                            if ($cTime < $sTime || $cTime > $eTime)
                                            {
                                                continue;
                                            }
                                        }
                                        // Unordered time range
                                        else
                                        {
                                            if ($cTime < $sTime && $cTime > $eTime)
                                            {
                                                continue;
                                            }
                                        }
                                    }
                                    // sTime is present
                                    elseif (!empty($sTime))
                                    {
                                        if ($cTime < $sTime)
                                        {
                                            continue;
                                        }
                                    }
                                    // eTime is present
                                    elseif (!empty($eTime))
                                    {
                                        if ($cTime > $eTime)
                                        {
                                            continue;
                                        }
                                    }
                                }

                                // Grab activities associated with count
                                $countActs = $this->pluck($count['activities'], 'id');

                                // Test for intersection between input and count activities
                                $intersect = array_values(array_unique(array_intersect($countActs, $this->actListIds)));

                                if ($params['activities'] === 'all' || $intersect)
                                {

                                    $year = date('Y', strtotime($day));
                                    $month = date('F', strtotime($day));

                                    // Build CSV Array (Activities done later in activitiesSum array)
                                    if(!isset($this->countHash['csv'][$day]))
                                    {
                                        // Scaffold countHash for day
                                        $this->countHash['csv'][$day] = $this->csvScaffold;

                                        // Insert Base information for day, total and locations
                                        $this->countHash['csv'][$day]['date'] = $day;
                                        $this->countHash['csv'][$day]['total'] = $count['number'];
                                        $this->countHash['csv'][$day]['locations'][$this->locHash[$loc['id']]] = $count['number'];

                                        if ($intersect)
                                        {
                                            foreach($intersect as $x)
                                            {
                                                $this->countHash['csv'][$day]['activities'][$this->actHash[$x]] = $count['number'];
                                            }
                                        }
                                        else
                                        {
                                            foreach($countActs as $countAct)
                                            {
                                                $this->countHash['csv'][$day]['activities'][$this->actHash[$countAct]] = $count['number'];
                                            }
                                        }
                                    }
                                    else
                                    {
                                        $this->countHash['csv'][$day]['total'] += $count['number'];
                                        $this->countHash['csv'][$day]['locations'][$this->locHash[$loc['id']]] += $count['number'];

                                       if ($intersect)
                                        {
                                            foreach($intersect as $x)
                                            {
                                                $this->countHash['csv'][$day]['activities'][$this->actHash[$x]] += $count['number'];
                                            }
                                        }
                                        else
                                        {
                                            foreach($countActs as $countAct)
                                            {

                                                $this->countHash['csv'][$day]['activities'][$this->actHash[$countAct]] += $count['number'];
                                            }
                                        }
                                    }

                                    // Increment Total property
                                    if (!isset($this->countHash['total']))
                                    {
                                        $this->countHash['total'] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['total'] += $count['number'];
                                    }

                                    // Build Year Summary array
                                    if(!isset($this->countHash['yearSummary'][$year]))
                                    {
                                        $this->countHash['yearSummary'][$year] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['yearSummary'][$year] += $count['number'];
                                    }

                                    // Build Month Summary array
                                    if(!isset($this->countHash['monthSummary'][$year][$month]))
                                    {
                                        $this->countHash['monthSummary'][$year][$month] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['monthSummary'][$year][$month] += $count['number'];
                                    }

                                    // Build Day of Week Summary array
                                    if(!isset($this->countHash['dayOfWeekSummary'][$weekday]))
                                    {
                                        $this->countHash['dayOfWeekSummary'][$weekday] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['dayOfWeekSummary'][$weekday] += $count['number'];
                                    }

                                    // Build Hourly Summary array
                                    if(!isset($this->countHash['hourSummary'][$hour]))
                                    {
                                        $this->countHash['hourSummary'][$hour] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['hourSummary'][$hour] += $count['number'];
                                    }

                                    // Build Daily Hourly Summary array
                                    if(!isset($this->countHash['dailyHourSummary'][$weekdayInt][$hour]))
                                    {
                                        $this->countHash['dailyHourSummary'][$weekdayInt][$hour]['sum'] = $count['number'];
                                        $this->countHash['dailyHourSummary'][$weekdayInt][$hour]['hourCounts'][$day] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['dailyHourSummary'][$weekdayInt][$hour]['sum'] += $count['number'];

                                        if(!isset($this->countHash['dailyHourSummary'][$weekdayInt][$hour]['hourCounts'][$day]))
                                        {
                                            $this->countHash['dailyHourSummary'][$weekdayInt][$hour]['hourCounts'][$day] = $count['number'];
                                        }
                                        else
                                        {
                                            $this->countHash['dailyHourSummary'][$weekdayInt][$hour]['hourCounts'][$day] += $count['number'];
                                        }
                                    }

                                    // Build periodSum array
                                    if (!isset($this->countHash['periodSum'][$day]['count']))
                                    {
                                        $this->countHash['periodSum'][$day]['count'] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['periodSum'][$day]['count'] += $count['number'];
                                    }

                                    // Build locationsSum array
                                    if (!isset($this->countHash['locationsSum'][$loc['id']]))
                                    {
                                        $this->countHash['locationsSum'][$loc['id']] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['locationsSum'][$loc['id']] += $count['number'];
                                    }

                                    // Build/Finish activitiesSum, activitiesAvgAvg
                                    if ($intersect)
                                    {
                                        foreach ($intersect as $x)
                                        {
                                            // activitiesSum
                                            if (!isset($this->countHash['activitiesSum'][$x]))
                                            {
                                                $this->countHash['activitiesSum'][$x] = $count['number'];
                                            }
                                            else
                                            {
                                                $this->countHash['activitiesSum'][$x] += $count['number'];
                                            }

                                            //activitiesAvgAvg
                                            if (!isset($this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sess['id']][$x]))
                                            {
                                                $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sess['id']][$x] = $count['number'];
                                            }
                                            else
                                            {
                                                $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sess['id']][$x] += $count['number'];
                                            }
                                        }
                                    }
                                    else
                                    {
                                        foreach ($countActs as $countAct)
                                        {
                                            // activitiesSum
                                            if (!isset($this->countHash['activitiesSum'][$countAct]))
                                            {
                                                $this->countHash['activitiesSum'][$countAct] = $count['number'];
                                            }
                                            else
                                            {
                                                $this->countHash['activitiesSum'][$countAct] += $count['number'];
                                            }

                                            // activitiesAvgAvg
                                            if (!isset($this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sess['id']][$countAct]))
                                            {
                                                $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sess['id']][$countAct] = $count['number'];
                                            }
                                            else
                                            {
                                                $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sess['id']][$countAct] += $count['number'];
                                            }
                                        }
                                    }

                                    // Build periodAvg array
                                    if (!isset($this->countHash['periodAvg'][$day]['sessions'][$sess['id']][$loc['id']]))
                                    {
                                        $this->countHash['periodAvg'][$day]['sessions'][$sess['id']][$loc['id']] = $count['number'];
                                    }
                                    else
                                    {
                                        $this->countHash['periodAvg'][$day]['sessions'][$sess['id']][$loc['id']] += $count['number'];
                                    }
                                }
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
    public function calculateAvg($countHash, $params)
    {
        if (empty($countHash))
        {
            return;
        }

        $divisor = count($countHash['periodSum']);

        // Build locationsAvgSum array
        foreach ($countHash['locationsSum'] as $key=>$val)
        {
            $countHash['locationsAvgSum'][$key] = $val / $divisor;
        }

        // Build activitiesAvgSum array
        foreach ($countHash['activitiesSum'] as $key=>$val)
        {
            $countHash['activitiesAvgSum'][$key] = $val / $divisor;
        }

        // Calculate averages for periodAvg array while building locationAvgAvg array
        foreach ($countHash['periodAvg'] as $date=>$day)
        {
            $sessions = $day['sessions'];
            foreach ($sessions as $sessID => $sess)
            {
                foreach ($sess as $locationID => $count)
                {
                    if (!isset ($countHash['periodAvg'][$date]['locations'][$locationID]))
                    {
                        $countHash['periodAvg'][$date]['locations'][$locationID] = array('count' => $count, 'divisor' => 1);
                        $countHash['locationsAvgAvg']['days'][$date][$locationID] = array('count' => $count, 'divisor' => 1);
                    }
                    else
                    {
                        $countHash['periodAvg'][$date]['locations'][$locationID]['count'] += $count;
                        $countHash['periodAvg'][$date]['locations'][$locationID]['divisor'] += 1;

                        $countHash['locationsAvgAvg']['days'][$date][$locationID]['count'] += $count;
                        $countHash['locationsAvgAvg']['days'][$date][$locationID]['divisor'] += 1;
                    }
                }
            }
        }

        // periodAvg
        foreach ($countHash['periodAvg'] as $date=>$day)
        {
            $locations = $day['locations'];

            $avg = array_reduce($locations, function($memo, $location) {
                $val = $location['count'] / $location['divisor'];
                return $memo + $val;
            }, $memo = 0);

            $countHash['periodAvg'][$date]['count'] = $avg;
        }

        // locationsAvgAvg
        foreach ($countHash['locationsAvgAvg']['days'] as $date => $day)
        {
            foreach ($day as $locationID => $location)
            {
                if (!isset($countHash['locationsAvgAvg']['averages'][$locationID]))
                {
                    $countHash['locationsAvgAvg']['averages'][$locationID] = array('avg' => $location['count'] / $location['divisor'], 'divisor' => 1);
                }
                else
                {
                    $countHash['locationsAvgAvg']['averages'][$locationID]['avg'] += $location['count'] / $location['divisor'];
                    $countHash['locationsAvgAvg']['averages'][$locationID]['divisor'] += 1;

                }
            }
        }

        foreach ($countHash['locationsAvgAvg']['averages'] as $locationID => $location)
        {
            if ($location['avg'] / $location['divisor'] > 0)
            {
                $countHash['locationsAvgAvg'][$locationID] = $location['avg'] / $location['divisor'];
            }
        }

        // activitiesAvgAvg
        foreach ($countHash['activitiesAvgAvg']['days'] as $date => $day)
        {
            $sessions = $day['sessions'];
            foreach ($sessions as $sessID => $sess)
            {
                foreach ($sess as $activityID => $count)
                {
                    if (!isset ($countHash['activitiesAvgAvg']['days'][$date]['activities'][$activityID]))
                    {
                        $countHash['activitiesAvgAvg']['days'][$date]['activities'][$activityID] = array('count' => $count, 'divisor' => 1);
                    }
                    else
                    {
                        $countHash['activitiesAvgAvg']['days'][$date]['activities'][$activityID]['count'] += $count;
                        $countHash['activitiesAvgAvg']['days'][$date]['activities'][$activityID]['divisor'] += 1;
                    }
                }
            }
        }

        foreach ($countHash['activitiesAvgAvg']['days'] as $date => $day)
        {
            $activities = $day['activities'];
            foreach($activities as $activityID => $activity)
            {
                if (!isset($countHash['activitiesAvgAvg']['averages'][$activityID]))
                {
                    $countHash['activitiesAvgAvg']['averages'][$activityID] = array('avg' => $activity['count'] / $activity['divisor'], 'divisor' => 1);
                }
                else
                {
                    $countHash['activitiesAvgAvg']['averages'][$activityID]['avg'] += $activity['count'];
                    $countHash['activitiesAvgAvg']['averages'][$activityID] ['divisor'] += 1;
                }
            }
        }

        foreach ($countHash['activitiesAvgAvg']['averages'] as $activityID => $activity)
        {
            if ($activity['avg'] / $activity['divisor'] > 0)
            {
                $countHash['activitiesAvgAvg'][$activityID] = $activity['avg'] / $activity['divisor'];
            }
        }


        $hourlyHash = $this->buildHourlyDivisors($params);

        // dailyHourSummary averages
        foreach ($countHash['dailyHourSummary'] as $dayKey => $day)
        {
            foreach ($day as $hourKey => $hour)
            {
                $count = count($hour['hourCounts']);

                if ($count !== 0)
                {
                    $avg = array_sum(array_values($hour['hourCounts'])) / $count;
                    $countHash['dailyHourSummary'][$dayKey][$hourKey]['avg'] = $avg;

                    $avgDays = array_sum(array_values($hour['hourCounts'])) / $hourlyHash[$dayKey];
                    $countHash['dailyHourSummary'][$dayKey][$hourKey]['avgDays'] = $avgDays;
                    $countHash['dailyHourSummary'][$dayKey][$hourKey]['divisor'] = $hourlyHash[$dayKey];

                }
            }
        }

        return $countHash;
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
    public function padData($data, $params)
    {
        $sdate = $params['sdate'];
        $edate = $params['edate'];

        // If $sdate and $edate are empty, say for a full query, set dummy values
        // using min/max values of data from server
        if (empty($sdate))
        {
            $keys  = array_keys($data['periodSum']);
            $sdate = min($keys);
            $sdate = str_replace("-", "", $sdate);
        }

        if (empty($edate))
        {
            $keys  = array_keys($data['periodSum']);
            $edate = max($keys);
            $edate = str_replace("-", "", $edate);

        }

        //Pad out missing dates with zero counts
        $dateRange = $this->createDateRangeArray($sdate, $edate);

        foreach ($dateRange as $date)
        {
            // Update periodSum array
            if (!isset($data['periodSum'][$date]))
            {
                $weekday = date('l', strtotime($date));
                // This check is to avoid padding days we don't want
                if (in_array($weekday, $params['days']))
                {
                    $data['periodSum'][$date]['count'] = NULL;
                }
            }

            // Update periodAvg array
            if (!isset($data['periodAvg'][$date]))
            {
                $weekday = date('l', strtotime($date));
                // This check is to avoid padding days we don't want
                if (in_array($weekday, $params['days']))
                {
                    $data['periodAvg'][$date]['count'] = NULL;
                }
            }
        }

        return $data;
    }
}