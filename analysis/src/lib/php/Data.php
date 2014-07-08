<?php

require_once 'vendor/autoload.php';
require_once 'ServerIO.php';
require_once 'SumaGump.php';

/**
 * Data - Class to process data for display in a variety of charts.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class Data
{
    /**
     * Main hash to store data as it is retrieved from the server
     *
     * @var array
     * @access  private
     */
    private $countHash = array();

    /**
     * Define day names
     *
     * @var array
     * @access  private
     */
    private $daysScaffold = array(
        'mo' => 'Monday',
        'tu' => 'Tuesday',
        'we' => 'Wednesday',
        'th' => 'Thursday',
        'fr' => 'Friday',
        'sa' => 'Saturday',
        'su' => 'Sunday'
    );

    /**
     * Stores location ids for filtering
     *
     * @var NULL
     * @access  private
     */
    private $locListIds = array();

    /**
     * Stores activity ids to exclude
     *
     * @var array
     * @access  private
     */
    private $excludeActs = array();

    /**
     * Stores activity ids to require
     *
     * @var array
     * @access private
     */
    private $requireActs = array();

    /**
     * Stores array of arrays of activity ids
     * based on required activity groups
     * returns [[1, 2, 3], [4, 5], [6, 7]] where
     * array 1 is activity group 1, array two is
     * activity group 2, etc.
     *
     * @var array
     * @access private
     */
    private $requireOneOfEach = array();

    /**
     * Stores scaffold array for csvArray
     * @var array
     * @access private
     */
    private $csvScaffold = NULL;

    /**
     * Stores hash of activities
     *
     * @var array
     * @access private
     */
    private $actHash = array();

    /**
     * Stores hash of locations
     *
     * @var array
     * @access private
     */
    private $locHash = array();

    /**
     * Stores hash of activity groups
     *
     * @var array
     * @access private
     */
    private $actGrpHash = array();

    /**
     * [__construct]
     */
    function __construct() {
        $config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

        // Set Error Reporting Levels
        if (isset($config['showErrors']) && $config['showErrors'] === true)
        {
           $SUMA_ERROR_REPORTING  = E_ERROR | E_WARNING | E_PARSE | E_NOTICE;
           $SUMA_DISPLAY_ERRORS   = 'on';
        }
        else
        {
           $SUMA_ERROR_REPORTING  = 0;
           $SUMA_DISPLAY_ERRORS   = 'off';
        }

        error_reporting($SUMA_ERROR_REPORTING);
        ini_set('display_errors', $SUMA_DISPLAY_ERRORS);
    }

    /**
     * Method to populate $csvScaffold, used for csv count collection
     *
     * @access private
     * @param  array $locListIds
     * @param  array $actListIds
     * @return array
     */
    private function buildCSVScaffold ($actDict, $locDict, $actGrpDict)
    {
        $scaffoldArray = array(
                'date' => NULL,
                'total' => NULL,
                'locations' => array(),
                'activities' => array()
            );

        if (empty($this->actGrpHash))
        {
           foreach($actGrpDict as $grp)
           {
               $this->actGrpHash[$grp['id']] = $grp['title'];
           }
        }

        if(empty($this->actHash))
        {
            foreach($actDict as $act)
            {
                $this->actHash[$act['id']] = $this->actGrpHash[$act['activityGroup']] . ": " . $act['title'];
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
                $name = $this->actGrpHash[$act['activityGroup']] . ": " . $act['title'];
                $scaffoldArray['activities'][$name] = NULL;
            }
        }
        else
        {
            foreach($this->actListIds as $act)
            {
                $name = $this->actGrpHash[$act['activityGroup']] . ": " . $act['title'];
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

        return $scaffoldArray;
    }

    /**
     * Scaffold array for hours data
     *
     * @access private
     * @return array
     */
    private function buildHourSummaryScaffold()
    {
        $array = array();

        for ($i = 0; $i <= 23; $i++)
        {
            $array[$i] = null;
        }

        return $array;
    }

    /**
     * Scaffold sub-array for hours data
     *
     * @access private
     * @return array
     */
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

    /**
     * Scaffold daily hourly data array
     *
     * @access private
     * @return array
     */
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
     *
     * @access private
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
     *
     * @access private
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
    private function populateParams($input)
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
            'requireActs'    => 'trim',
            'excludeActs'    => 'trim',
            'requireActGrps' => 'trim',
            'excludeActGrps' => 'trim'
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
            'requireActs'    => 'activities',
            'excludeActs'    => 'activities',
            'requireActGrps' => 'activities',
            'excludeActGrps' => 'activities'
        );

        // Filter input
        $input = $validator->filter($input, $filters);

        // Validate input
        $validated = $validator->validate($input, $rules);

        // If input validates, return params array
        if ($validated === TRUE)
        {
            $params = array(
                'id'             => $input['id'],
                'sdate'          => $input['sdate'],
                'edate'          => $input['edate'],
                'stime'          => $input['stime'],
                'etime'          => $input['etime'],
                'classifyCounts' => $input['classifyCounts'],
                'wholeSession'   => $input['wholeSession'],
                'days'           => $input['days'],
                'locations'      => $input['locations'],
                'excludeActs'    => $input['excludeActs'],
                'requireActs'    => $input['requireActs'],
                'excludeActGrps' => $input['excludeActGrps'],
                'requireActGrps' => $input['requireActGrps']
            );

            // Set query type and format
            $params['format'] = 'lca';

            // Set days of the week
            $days = explode(",", $input['days']);
            $params['days'] = array();

            foreach ($days as $day) {
                if (array_key_exists($day, $this->daysScaffold)) {
                    array_push($params['days'], $this->daysScaffold[$day]);
                }
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
     * Reject count based on exclude acts, require acts, or require one of each arrays
     *
     * @access private
     * @param  object $count Count object
     * @return boolean
     */
    private function rejectBasedOnActs($count)
    {

        // Reject if no count acts in exclude acts
        if (count(array_intersect($count['activities'], $this->excludeActs)) > 0) {
            return true;
        }

        // Reject if count acts doesn't have all of the requireActs
        if (count(array_intersect($this->requireActs, $count['activities'])) !== count($this->requireActs))  {
            return true;
        }

        // Reject if no countActs in each of the requiredOneOfEach arrays
        foreach ($this->requireOneOfEach as $actGroup)
        {
            if (count(array_intersect($count['activities'], $actGroup)) === 0 && !empty($actGroup)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Evaluate count for inclusion in data set
     *
     * @access private
     * @param  object $count   Count object
     * @param  string $day     Date of count (set by setDay)
     * @param  array  $params  Params from client
     * @param  string $weekday Day of week
     * @return boolean
     */
    private function includeCount($count, $day, $params, $weekday)
    {
        if (!in_array($weekday, $params['days']))
        {
            return false;
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
                return false;
            }

            // Enforce end date filter
            if (!empty($eDate) && $tDate > $eDate)
            {
                return false;
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
                        return false;
                    }
                }
                // Unordered time range
                else
                {
                    if ($cTime < $sTime && $cTime > $eTime)
                    {
                        return false;
                    }
                }
            }
            // sTime is present
            elseif (!empty($sTime))
            {
                if ($cTime < $sTime)
                {
                    return false;
                }
            }
            // eTime is present
            elseif (!empty($eTime))
            {
                if ($cTime > $eTime)
                {
                    return false;
                }
            }
        }

        if ($this->rejectBasedOnActs($count))
        {
            return false;
        }

        return true;
    }

    /**
     * Determine which date to assign to count
     *
     * @access private
     * @param object $count  Count object
     * @param array $params  Params from client
     * @param array $sess    Session object
     */
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

    /**
     * Add individual count to return data
     *
     * @access private
     * @param object $count    Count object
     * @param string $day      Date of count, could be session start, session end, count date
     * @param integer $locId   Location ID for count
     * @param integer $sessId  Session ID for count
     * @param string  $weekday  Day of week
     */
    private function addCount($count, $day, $locId, $sessId, $weekday)
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
        else
        {
            $this->countHash['csv'][$day]['total'] += $count['number'];
            $this->countHash['csv'][$day]['locations'][$this->locHash[$locId]] += $count['number'];

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

        // Increment Total property
        if (!isset($this->countHash['total']))
        {
            $this->countHash['total'] = $count['number'];
        }
        else
        {
            $this->countHash['total'] += $count['number'];
        }

        // Increment Zero Divisor, used for calcuations that
        // should include zero. Useful for locations.
        if (!isset($this->countHash['zeroDivisor']))
        {
            if ($count['number'] === 0)
            {
                $this->countHash['zeroDivisor'] = 1;
            }
            else
            {
                $this->countHash['zeroDivisor'] = $count['number'];
            }
        }
        else
        {
            if ($count['number'] === 0)
            {
                $this->countHash['zeroDivisor'] += 1;
            }
            else
            {
                $this->countHash['zeroDivisor'] += $count['number'];
            }
        }

        // Capture number of zero counts
        if (!isset($this->countHash['zeroCounts']))
        {
            if ($count['number'] === 0) {
                $this->countHash['zeroCounts'] = 1;
            }
            else
            {
                $this->countHash['zeroCounts'] = 0;
            }
        }
        else
        {
            if ($count['number'] === 0) {
                $this->countHash['zeroCounts'] += 1;
            }
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
            $this->countHash['weekdaySummary'][$weekday] = array(
                'avg' => null,
                'total' => $count['number'],
                'divisor' => array()
            );

            if (!in_array($day, $this->countHash['weekdaySummary'][$weekday]['divisor']))
            {
                array_push($this->countHash['weekdaySummary'][$weekday]['divisor'], $day);
            }
        }
        else
        {
            $this->countHash['weekdaySummary'][$weekday]['total'] = $this->countHash['weekdaySummary'][$weekday]['total'] += $count['number'];
            if (!in_array($day, $this->countHash['weekdaySummary'][$weekday]['divisor']))
            {
                array_push($this->countHash['weekdaySummary'][$weekday]['divisor'], $day);
            }
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
     * Builds array of exluded activities
     *
     * @access private
     * @param  string $excludeActs    Comma delimited string of acts
     * @param  string $excludeActGrps Comma delimited string of act grps
     * @param  array $actDict        Dictionary of activities
     * @return array                 Array of acts to exclude
     */
    private function buildExcludeActs($excludeActs, $excludeActGrps, $actDict)
    {
        if ($excludeActs === "" && $excludeActGrps === "")
        {
            return array();
        }

        $returnAry = array();

        if ($excludeActs !== "")
        {
            $actsAry = explode(",", $excludeActs);
            foreach ($actsAry as $act)
            {
                $returnAry[] = (int)$act;
            }
        }

        if ($excludeActGrps !== "")
        {
            $actGrpsAry = explode(",", $excludeActGrps);
            foreach ($actDict as $act)
            {
                if (in_array((string)$act['activityGroup'], $actGrpsAry))
                {
                    $returnAry[] = (int)$act['id'];
                }
            }
        }

        return $returnAry;
    }

    /**
     * Builds array of required activities
     *
     * @access private
     * @param  array $requireActs Comma delimted string of required acts
     * @return array              Array of required acts
     */
    private function buildRequireActs($requireActs)
    {
        if ($requireActs === "")
        {
            return array();
        }

        $returnAry = array();
        $actsAry = explode(",", $requireActs);

        foreach($actsAry as $act)
        {
            $returnAry[] = (int)$act;
        }

        return $returnAry;
    }

    /**
     * Builds array of arrays of activity ids
     * based on required activity groups
     * returns [[1, 2, 3], [4, 5], [6, 7]] where
     * array 1 is activity group 1, array two is
     * activity group 2, etc.
     *
     * @access private
     * @param  string $requireActGrps Comma delimited string of required activity groups
     * @param  array $actDict        Dictionary of activities
     * @return array                 Array of arrays of acts in required act groups
     */
    private function buildRequireOneOfEach($requireActGrps, $actDict)
    {
        $returnAry = array();
        $actGrps = explode(",", $requireActGrps);

        foreach ($actGrps as $actGrp)
        {
            $acts = array();
            foreach($actDict as $act)
            {
                if ((string)$act['activityGroup'] === (string)$actGrp)
                {
                    $acts[] = (int)$act['id'];
                }
            }

            $returnAry[] = $acts;
        }

        return $returnAry;
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
        $locID   = $params['locations'];
        $actDict = $response['initiative']['dictionary']['activities'];
        $actGrpDict = $response['initiative']['dictionary']['activityGroups'];
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

        // Populate activity lists for filters
        if (empty($this->excludeActs))
        {
            $this->excludeActs = $this->buildExcludeActs($params['excludeActs'], $params['excludeActGrps'], $actDict);
        }

        if (empty($this->requireActs))
        {
            $this->requireActs = $this->buildRequireActs($params['requireActs']);
        }

        if (empty($this->requireOneOfEach))
        {
            $this->requireOneOfEach = $this->buildRequireOneOfEach($params['requireActGrps'], $actDict);
        }

        // Populate $csvScaffold for csv array
        if (!isset($this->csvScaffold))
        {
            $this->csvScaffold = $this->buildCSVScaffold($actDict, $locDict, $actGrpDict);
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

                        if ($this->includeCount($count, $day, $params, $weekday))
                        {
                            $this->addCount($count, $day, $loc['id'], $sess['id'], $weekday);
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
            elseif ($location['avg'] / $location['divisor'] === 0)
            {
                $countHash['locationsAvgAvg'][$locationID] = 0;
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
            elseif ($activity['avg'] / $activity['divisor'] === 0)
            {
                $countHash['activitiesAvgAvg'][$activityID] = 0;
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

        // Avg of Avgs
        $avgAvgsDivisor = 0;
        $avgAvgsTotal = 0;
        foreach ($countHash['periodAvg'] as $dayKey => $day)
        {
            $avgAvgsDivisor = $avgAvgsDivisor += 1;
            $avgAvgsTotal = $avgAvgsTotal += $day['count'];
        }

        if ($avgAvgsDivisor > 0)
        {
            $countHash['totalAvgAvg'] = $avgAvgsTotal / $avgAvgsDivisor;
        }
        else
        {
            $countHash['totalAvgAvg'] = 0;
        }

        // Avg of Sums
        $avgSumsDivisor = 0;
        $avgSumsTotal = 0;

        foreach ($countHash['periodSum'] as $dayKey => $day)
        {
            $avgSumsDivisor = $avgSumsDivisor += 1;
            $avgSumsTotal = $avgSumsTotal += $day['count'];
        }

        if ($avgSumsDivisor > 0)
        {
            $countHash['totalAvgSum'] = $avgSumsTotal / $avgSumsDivisor;
        }
        else
        {
            $countHash['totalAvgSum'] = 0;
        }

        // Weekday Avgs
        foreach ($countHash['weekdaySummary'] as $dayKey => $day)
        {
            $numberOfDays = count($day['divisor']);

            if ($numberOfDays > 0)
            {
                $countHash['weekdaySummary'][$dayKey]['avg'] = $day['total'] / $numberOfDays;
            }
            else
            {
                $countHash['weekdaySummary'][$dayKey]['avg'] = 0;
            }
        }

        // Number of days with counts
        $countHash['daysWithObservations'] = $avgSumsDivisor;

        return $countHash;
    }

    /**
     * Function that removes days outside of the
     * query range that might have been pulled in
     * by sessions and pads the data set with
     * zero values for any days in the range/filter set
     * that doesn't have a count.
     *
     * @access  private
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

    /**
     * Initiate request to Suma server
     *
     * @access private
     * @param  array $sumaParams Parameters sent to suma server, subset of params
     * @param  string $queryType  Query type, 'sessions' or 'counts'
     * @param  array $params     Full parameters object
     */
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

    /**
     * Checks that data exists for required fields
     *
     * @access private
     * @param  array $data Processed data set to be returned to client
     * @return boolen
     */
    private function checkData($data) {
        $names = array(
            'activitiesAvgAvg',
            'activitiesAvgSum',
            'activitiesSum',
            'csv',
            'dailyHourSummary',
            'hourSummary',
            'locationsAvgAvg',
            'locationsAvgSum',
            'locationsSum',
            'monthSummary',
            'periodAvg',
            'periodSum',
            'total',
            'weekdaySummary',
            'yearSummary'
        );

       foreach($names as $name)
       {
            if (!isset($data[$name])) {
                return false;
            }
       }

        return true;
    }

    /**
     * Function to request data from suma server
     *
     * @access public
     * @param  array $input Input parameters from client
     * @return array        Processed data set
     */
    public function getData($input)
    {
        // Validate form input
        $params = $this->populateParams($input);

        // Create params array for Suma server
        $sumaParams = $this->populateSumaParams($params);

        // Process Data
        $this->processData($sumaParams, 'sessions', $params);

        // Calculate averages for appropriate sub-arrays of countHash
        $data = $this->calculateAvg($this->countHash, $params);

        // Pad days as necessary
        $data = $this->padData($data, $params);

        // Ensure sufficient results to return
        if ($this->checkData($data)) {
            return $data;
        } else {
            throw new Exception("No data found for that combination of filters. Please try a broader search.");
        }
    }
}
