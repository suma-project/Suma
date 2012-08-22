<?php
header('Content-type: application/json');

require_once '../../lib/ChromePhp.php';
require_once '../../lib/underscore.php';
require_once '../../lib/ServerIO.php';
require_once '../../lib/Gump.php';
require_once '../../lib/SumaGump.php';

// Build possible arrays for daygroup filter from client
$weekdays = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
$weekends = array('Saturday', 'Sunday');
$all      = array_merge($weekdays, $weekends);

$countHash = array();

function echo500($e)
{
    header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo "<p>An error occurred on the server which prevented your request from being completed: <strong>" . $e->getMessage() . "</strong></p>";
    die;
}

function validateInput($_GET)
{
    $validator = new SumaGump();

    $_GET = $validator->sanitize($_GET);

    $rules = array(
        'activities' => 'alpha_numeric',
        'avgsum'     => 'alpha',
        'daygroup'   => 'alpha',
        'id'         => 'required|numeric',
        'locations'  => 'alpha_numeric'
    );

    $filters = array(
        'activities' => 'trim',
        'avgsum'     => 'trim',
        'daygroup'   => 'trim',
        'id'         => 'trim',
        'locations'  => 'trim',
        'sdate'      => 'trim|sanitize_numbers|rmhyphen',
        'edate'      => 'trim|sanitize_numbers|rmhyphen',
        'stime'      => 'trim|sanitize_numbers',
        'etime'      => 'trim|sanitize_numbers'
    );

    $_GET = $validator->filter($_GET, $filters);

    $validated = $validator->validate($_GET, $rules);

    if ($validated === TRUE)
    {
        $params = array(
                'activities' => $_GET['activities'],
                'avgsum'     => $_GET['avgsum'],
                'daygroup'   => $_GET['daygroup'],
                'id'         => $_GET['id'],
                'locations'  => $_GET['locations'],
                'sdate'      => $_GET['sdate'],
                'edate'      => $_GET['edate'],
                'stime'      => $_GET['stime'],
                'etime'      => $_GET['etime'],
        );

        // If end date parameter is greater than or equal
        // to today, set end date to yesterday
        $today = date('Ymd');

        if ($params['edate'] >= $today)
        {
            $params['edate'] = date('Ymd', time() - 60 * 60 * 24);
        }

        return $params;
    }
    else
    {
        throw new Exception('Input Error.'); 
    }
    
}

function populateSumaParams($params)
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

function createDateRangeArray($dateFrom, $dateTo)
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

function populateLocations($locDict, $locID, $locArray = array())
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

function populateActivities($actDict, $actID) {
    $actArray = array();
    $test     = explode("-", $actID);
    $type     = $test[0];
    $id       = $test[1];

    if ($type === 'activityGroup')
    {
        foreach ($actDict as $act)
        {
            if ($act['activityGroup'] === $id)
            {
                $actArray[] = $act['id'];
            }
        }
    }
    else
    {
        $actArray[] = $id;
    }

    return $actArray;
}

function populateHash($response, $params)
{
    global $countHash;

    $actID   = $params['activities'];
    $locID   = $params['locations'];
    $actDict = $response['initiative']['dictionary']['activities'];
    $locDict = $response['initiative']['dictionary']['locations'];

    if ($locID !== 'all')
    {
        $locList    = populateLocations($locDict, $locID);
        $locListIds = __::pluck($locList, 'id');
    }

    if ($actID !== 'all'){
        // $actList = populateActivities($actDict, $actID);
        // Once activity groups are implemented, use above code
        // and delete $actList = array($actID)
        $actList = array($actID);
    }
    else
    {
        $actList = array();
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
                if (!isset($countHash[$day]))
                {
                    $countHash[$day] = array();
                }

                if (!isset($countHash[$day][$sess['id']]))
                {   
                    $countHash[$day][$sess['id']] = array();
                }

                $sessLocations = $sess['locations'];

                foreach ($sessLocations as $loc)
                {
                    // Test if location is in locations array
                    if ($params['locations'] === 'all' || in_array($loc['id'], $locListIds))
                    {
                        $counts = $loc['counts'];
                        foreach ($counts as $count)
                        {
                            // Grab activities associated with count
                            $countActs = __::pluck($count['activities'], 'id');

                            // Test for intersection between input and count activities
                            $intersect = __::intersection($countActs, $actList);

                            if ($params['activities'] === 'all' || $intersect)
                            {
                                if (!isset($countHash[$day][$sess['id']][$loc['id']]))
                                {
                                    $countHash[$day][$sess['id']][$loc['id']] = $count['number'];
                                }
                                else
                                {
                                    $countHash[$day][$sess['id']][$loc['id']] += $count['number'];
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
            if ($params['locations'] === 'all' || in_array($loc['id'], $locListIds))
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
                    $intersect = __::intersection($countActs, $actList);

                    // Test if weekday is in days array AND if count matches requested activities
                    if ((in_array($weekday, $params['days'])) && ($params['activities'] === 'all' || $intersect))
                    {
                        if (!isset($countHash[$day]))
                        {
                            $countHash[$day]['dayCount'] = $count['number'];
                        }
                        else
                        {
                            $countHash[$day]['dayCount'] += $count['number'];
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

function calculateAvg($countHash) 
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

function cullData($data, $params)
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
    $dateRange = createDateRangeArray($sdate, $edate);

    foreach ($dateRange as $date)
    {
        if(!isset($data[$date]))
        {
            $data[$date]['dayCount'] = 0;
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
// --- END FUNCTIONS ---

$params = validateInput($_GET);

// Adjust format, and query type based on avgsum value
if ($params['avgsum'] === 'sum')
{
    $params['format'] = 'lca';
    $queryType        = 'counts';
}
else
{
    $params['format'] = 'lca';
    $queryType        = 'sessions';
}

// Determine which array to use as filter for daygroup
if ($params['daygroup'] === 'weekdays')
{
    $params['days'] = $weekdays;
} 
elseif ($params['daygroup'] === 'weekends') 
{
    $params['days'] = $weekends;
} 
else
{
    $params['days'] = $all;
}

// Create params array for Suma server
$sumaParams = populateSumaParams($params);

// Instantiate ServerIO class, begin retrieval of data from Suma Server,
// and continue retrieval until the hasMore property is false
try 
{
    $io = new ServerIO();
    populateHash($io->getData($sumaParams, $queryType), $params);
    while ($io->hasMore())
    {
        populateHash($io->next(), $params);
    }
}
catch (Exception $e)
{
    echo500($e);
}

// Perform additional data processing if necessary (calculate averages)
if ($params['avgsum'] === 'avg')
{
    $data = calculateAvg($countHash);
}
else
{
    $data = $countHash;
}

$data = cullData($data, $params);

echo json_encode($data);