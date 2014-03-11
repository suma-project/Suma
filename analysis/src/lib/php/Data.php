<?php

require_once 'ServerIO.php';
require_once 'Gump.php';
require_once 'SumaGump.php';

// Suppress Error Reporting
error_reporting(0);
ini_set('display_errors', 0);

/**
 * Data - Class to process data for display in a variety of charts.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class Data
{
    /**
     * Define day names
     *
     * @var array
     * @access  private
     */
    private $daysScaffold = array('mo' => 'Monday', 'tu' => 'Tuesday', 'we' => 'Wednesday', 'th' => 'Thursday', 'fr' => 'Friday', 'sa' => 'Saturday', 'su' => 'Sunday');
    /**
     * Main hash to store data as it is retrieved from the server
     *
     * @var array
     * @access  private
     */
    private $countHash = array();
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
                "avgDays" => NULL
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
     * Validates form input from client
     *
     * @access  private
     * @param  array $input Form input from client
     * @return array
     */
    private function validateInput($input)
    {
        // Initialize SumaGump class
        $validator = new SumaGump();

        // Sanitize input
        $input = $validator->sanitize($input);

        // Define filters
        $filters = array(
            'id'             => 'trim',
            'sdate'          => 'trim|rmpunctuation|rmhyphen',
            'edate'          => 'trim|rmpunctuation|rmhyphen',
            'stime'          => 'trim|rmpunctuation|pad_time',
            'etime'          => 'trim|rmpunctuation|pad_time',
            'classifyCounts' => 'trim',
            'wholeSession'   => 'trim',
            'days'           => 'trim',
            'locations'      => 'trim',
            'activities'     => 'trim'
        );

        // Define validation rules
        $rules = array(
            'id'             => 'required|numeric',
            'sdate'          => 'numeric|multi_exact_len, 0 8',
            'edate'          => 'numeric|multi_exact_len, 0 8',
            'stime'          => 'numeric|multi_exact_len, 0 4',
            'etime'          => 'numeric|multi_exact_len, 0 4',
            'classifyCounts' => 'alpha|contains, count start end',
            'wholeSession'   => 'alpha|contains, yes no',
            'days'           => 'day_of_week',
            'locations'      => 'alpha_numeric',
            'activities'     => 'alpha_dash'
        );

        // Filter input
        $input = $validator->filter($input, $filters);

        // Validate input
        $validated = $validator->validate($input, $rules);

        // If input validates, return params array
        if ($validated === TRUE)
        {
            $params = array(
                'id'         => $input['id'],
                'sdate'      => $input['sdate'],
                'edate'      => $input['edate'],
                'stime'      => $input['stime'],
                'etime'      => $input['etime'],
                'classifyCounts'    => $input['classifyCounts'],
                'wholeSession' => $input['wholeSession'],
                'days'   => $input['days'],
                'locations'  => $input['locations'],
                'activities' => $input['activities']
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
            // to today, set end date to today
            $today = date('Ymd');

            if ($params['edate'] > $today)
            {
                $params['edate'] = $today;
            }

            return $params;
        }
        else
        {
            $message = 'Query parameter input error.';

            foreach ($validator->get_readable_errors() as $error) {
                $message = $message . " " . strip_tags($error);
            }

            throw new Exception($message, 500);
        }
    }
    /**
     * Builds params to pass to Suma server
     *
     * @access  private
     * @param  array $params
     * @return array
     */
    private function populateSumaParams($params)
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
     * Creates a date range array from
     * two dates formatted as YYYYMMDD
     *
     * @access  private
     * @param  string $dateFrom
     * @param  string $dateTo
     * @return array
     */
    private function createDateRangeArray($dateFrom, $dateTo)
    {
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
     * @access  private
     * @param  array $locDict
     * @param  string $locID
     * @param  array  $locArray
     * @return array
     */
    private function populateLocations($locDict, $locID, $locArray = array())
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
     * @access  private
     * @param  array $actDict
     * @param  string $actID
     * @param  string $actType
     * @return array
     */
    private function populateActivities($actDict, $actID, $actType) {
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
    private function filterCount($count, $day, $params, $weekday, $intersect)
    {
        if (!in_array($weekday, $params['days']))
        {
            return true;
        }

        if ($params['wholeSession'] === 'no')
        {
            // Honor date filters and remove extra days pulled in by session
            $sDate = $params['sdate'];
            $eDate = $params['edate'];
            $tDate = str_replace('-', '', $day);

            // Enforce start date filter
            if (!empty($sDate) && $tDate < $sDate)
            {
                return true;
            }

            // Enforce end date filter
            if (!empty($eDate) && $tDate > $eDate)
            {
                return true;
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
                        return true;
                    }
                }
                // Unordered time range
                else
                {
                    if ($cTime < $sTime && $cTime > $eTime)
                    {
                        return true;
                    }
                }
            }
            // sTime is present
            elseif (!empty($sTime))
            {
                if ($cTime < $sTime)
                {
                    return true;
                }
            }
            // eTime is present
            elseif (!empty($eTime))
            {
                if ($cTime > $eTime)
                {
                    return true;
                }
            }
        }

        if ($params['activities'] === 'all')
        {
            return false;
        }

        if (empty($intersect))
        {
            return true;
        }

        return false;
    }
    private function setDay($count, $params, $sess)
    {
        if ($params['classifyCounts'] === 'count')
        {
            return substr($count['time'], 0, -9);
        }
        elseif ($params['classifyCounts'] === 'start') {
            return substr($sess['start'], 0, -9);
        }
        elseif ($params['classifyCounts'] === 'end')
        {
            return substr($sess['end'], 0, -9);
        }
    }
    private function addCount($count, $day, $locId, $sessId, $weekday, $intersect)
    {
        $weekdayInt = date('w', strtotime($day));
        $year = date('Y', strtotime($day));
        $month = date('F', strtotime($day));
        $hour = date('G', strtotime($count['time']));

        // Build CSV, activitiesSum, and activitiesAvgAvg arrays
        if(!isset($this->countHash['csv'][$day]))
        {
            // Scaffold countHash for day
            $this->countHash['csv'][$day] = $this->csvScaffold;

            // Insert Base information for day, total and locations
            $this->countHash['csv'][$day]['date'] = $day;
            $this->countHash['csv'][$day]['total'] = $count['number'];
            $this->countHash['csv'][$day]['locations'][$this->locHash[$locId]] = $count['number'];

            if (!empty($intersect))
            {
                foreach($intersect as $x)
                {
                    // CSV
                    $this->countHash['csv'][$day]['activities'][$this->actHash[$x]] = $count['number'];

                    //activitiesSum
                    if (!isset($this->countHash['activitiesSum'][$x]))
                    {
                        $this->countHash['activitiesSum'][$x] = $count['number'];
                    }
                    else
                    {
                        $this->countHash['activitiesSum'][$x] += $count['number'];
                    }

                    //activitiesAvgAvg
                    if (!isset($this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$x]))
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$x] = $count['number'];
                    }
                    else
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$x] += $count['number'];
                    }
                }
            }
            else
            {
                foreach($count['activities'] as $countAct)
                {
                    // CSV
                    $this->countHash['csv'][$day]['activities'][$this->actHash[$countAct]] = $count['number'];

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
                    if (!isset($this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$countAct]))
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$countAct] = $count['number'];
                    }
                    else
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$countAct] += $count['number'];
                    }
                }
            }
        }
        else
        {
            $this->countHash['csv'][$day]['total'] += $count['number'];
            $this->countHash['csv'][$day]['locations'][$this->locHash[$locId]] += $count['number'];

            if (!empty($intersect))
            {
                foreach($intersect as $x)
                {
                    // CSV
                    $this->countHash['csv'][$day]['activities'][$this->actHash[$x]] += $count['number'];

                    //activitiesSum
                    if (!isset($this->countHash['activitiesSum'][$x]))
                    {
                        $this->countHash['activitiesSum'][$x] = $count['number'];
                    }
                    else
                    {
                        $this->countHash['activitiesSum'][$x] += $count['number'];
                    }

                    //activitiesAvgAvg
                    if (!isset($this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$x]))
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$x] = $count['number'];
                    }
                    else
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$x] += $count['number'];
                    }
                }
            }
            else
            {
                foreach($count['activities'] as $countAct)
                {
                    // CSV
                    $this->countHash['csv'][$day]['activities'][$this->actHash[$countAct]] += $count['number'];

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
                    if (!isset($this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$countAct]))
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$countAct] = $count['number'];
                    }
                    else
                    {
                        $this->countHash['activitiesAvgAvg']['days'][$day]['sessions'][$sessId][$countAct] += $count['number'];
                    }
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

        // Build year summary array
        if(!isset($this->countHash['yearSummary'][$year]))
        {
            $this->countHash['yearSummary'][$year] = $count['number'];
        }
        else
        {
            $this->countHash['yearSummary'][$year] += $count['number'];
        }

        // Build month summary array
        if(!isset($this->countHash['monthSummary'][$year][$month]))
        {
            $this->countHash['monthSummary'][$year][$month] = $count['number'];
        }
        else
        {
            $this->countHash['monthSummary'][$year][$month] += $count['number'];
        }

        // Build weekday Summary array
        if(!isset($this->countHash['weekdaySummary'][$weekday]))
        {
            $this->countHash['weekdaySummary'][$weekday] = $count['number'];
        }
        else
        {
            $this->countHash['weekdaySummary'][$weekday] += $count['number'];
        }

        // Build hour summary array
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
        if (!isset($this->countHash['locationsSum'][$locId]))
        {
            $this->countHash['locationsSum'][$locId] = $count['number'];
        }
        else
        {
            $this->countHash['locationsSum'][$locId] += $count['number'];
        }

        // Build periodAvg array
        if (!isset($this->countHash['periodAvg'][$day]['sessions'][$sessId][$locId]))
        {
            $this->countHash['periodAvg'][$day]['sessions'][$sessId][$locId] = $count['number'];
        }
        else
        {
            $this->countHash['periodAvg'][$day]['sessions'][$sessId][$locId] += $count['number'];
        }
    }
    /**
     * Populates countHash class variable with data from Server
     *
     * @access  private
     * @param  array $response Response from Suma server
     * @param  array $params
     */
    private function populateHash($response, $params)
    {
        $actID   = $params['actId'];
        $actType = $params['actType'];
        $locID   = $params['locations'];
        $actDict = $response['initiative']['dictionary']['activities'];
        $locDict = $response['initiative']['dictionary']['locations'];

        // Check for sessions object
        if (!isset($response['initiative']['sessions']))
        {
            throw new Exception('No data found for that combination of filters. Please try a broader search.');
        }

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

        // Evaluate counts for inclusion
        foreach ($response['initiative']['sessions'] as $sess)
        {
            foreach ($sess['locations'] as $loc)
            {
                // Test if location is in locations array
                if ($params['locations'] === 'all' || in_array($loc['id'], $this->locListIds))
                {
                    foreach ($loc['counts'] as $count)
                    {
                        // Get date based on count or session
                        $day = $this->setDay($count, $params, $sess);
                        $weekday = date('l', strtotime($day));
                        $intersect = array_intersect($count['activities'], $this->actListIds);

                        if (!$this->filterCount($count, $day, $params, $weekday, $intersect))
                        {
                            $this->addCount($count, $day, $loc['id'], $sess['id'], $weekday, $intersect);
                        }
                    }
                }
            }
        }
    }
    /**
     * Returns array with calculations of mean based on locations
     *
     * @access  private
     * @param  array $countHash
     * @return array
     */
    private function calculateAvg($countHash, $params)
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

        // dailyHourSummary averages
        $hourlyHash = $this->buildHourlyDivisors($params);

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
                }

                // Remove hourCounts array to reduce payload
                unset($countHash['dailyHourSummary'][$dayKey][$hourKey]['hourCounts']);
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
    private function padData($data, $params)
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
    private function processData($sumaParams, $queryType, $params)
    {
        // Instantiate ServerIO class, begin retrieval of data from Suma Server,
        // and continue retrieval until the hasMore property is false
        try
        {
            $io = new ServerIO();
            $this->populateHash($io->getData($sumaParams, $queryType), $params);
            while ($io->hasMore())
            {
                $this->populateHash($io->next(), $params);
            }
        }
        catch (Exception $e)
        {
            throw new Exception($e->getMessage());
        }
    }
    public function getData($input)
    {
        // Validate form input
        $params = $this->validateInput($input);

        // Set query type and format
        $params['format'] = 'lca';
        $queryType        = 'sessions';

        // Set days of the week
        $days = explode(",", $params['days']);
        $params['days'] = array();

        foreach ($days as $day) {
            if (array_key_exists($day, $this->daysScaffold)) {
                array_push($params['days'], $this->daysScaffold[$day]);
            }
        }

        // Create params array for Suma server
        $sumaParams = $this->populateSumaParams($params);

        // Process Data
        $this->processData($sumaParams, $queryType, $params);

        // Calculate averages for appropriate sub-arrays of countHash
        $returnData = $this->calculateAvg($this->countHash, $params);

        // Pad days as necessary
        $returnData = $this->padData($returnData, $params);

        return $returnData;
    }
}
