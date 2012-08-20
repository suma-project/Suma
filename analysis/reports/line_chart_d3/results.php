<?php
header('Content-type: application/json');

require_once '../../lib/ChromePhp.php';
require_once '../../lib/underscore.php';
require_once '../../lib/Server_IO.php';

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

function createDateRangeArray($strDateFrom,$strDateTo)
{
    // takes two dates formatted as YYYY-MM-DD and creates an
    // inclusive array of the dates between the from and to dates.

    $aryRange  = array();
    $iDateFrom = mktime(1,0,0,substr($strDateFrom,5,2), substr($strDateFrom,8,2),substr($strDateFrom,0,4));
    $iDateTo   = mktime(1,0,0,substr($strDateTo,5,2), substr($strDateTo,8,2),substr($strDateTo,0,4));

    if ($iDateTo>=$iDateFrom)
    {
        $aryRange[] = date('Y-m-d', $iDateFrom); // first entry
        while ($iDateFrom < $iDateTo)
        {
            $iDateFrom+=86400; // add 24 hours
            $aryRange[] = date('Y-m-d', $iDateFrom);
        }
    }
    return $aryRange;
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

    $init       = $response['initiative'];
    $sessions   = $init['sessions'];
    $locations  = $init['locations'];
    $locDict    = $response['initiative']['dictionary']['locations'];
    $locID      = $params['locations'];
    $actDict    = $response['initiative']['dictionary']['activities'];
    $actID      = $params['activities'];

    if ($locID !== 'all')
    {
        $locList    = populateLocations($locDict, $locID);
        $locListIds = __::pluck($locList, 'id');
    }

    if ($actID !== 'all'){
        //$actList = populateActivities($actDict, $actID);
        // Once activity groups are implemented, use above code
        // and delete $actList = array($actID)
        $actList = array($actID);
    }

    if ($sessions)
    {
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

                $locations = $sess['locations'];

                foreach ($locations as $loc)
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
    elseif ($locations)
    {
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
            $avgHash[$date][$locationID]['avg'] = $avgHash[$date][$locationID]['count']/$avgHash[$date][$locationID]['divisor'];
            $total += $avgHash[$date][$locationID]['avg'];
        }

        $avgHash[$date]['dayCount'] = $total;
    }

   return $avgHash;
}
// --- END FUNCTIONS ---

$params = array('id'         => $_GET['id'],
                'sdate'      => $_GET['sdate'],
                'edate'      => $_GET['edate'],
                'stime'      => $_GET['stime'],
                'etime'      => $_GET['etime'],
                'daygroup'   => $_GET['daygroup'],
                'avgsum'     => $_GET['avgsum'],
                'locations'  => $_GET['locations'],
                'activities' => $_GET['activities']
            );

// If end date parameter is greater than or equal
// to today, set end date to yesterday
$today = date('Y-m-d');

if ($params['edate'] >= $today)
{
    $params['edate'] = date('Y-m-d', time() - 60 * 60 * 24);
}

// Capture date params with hyphens for string processing below
$sdate = $params['sdate'];
$edate = $params['edate'];

// Strip hyphens from date
$params['sdate'] = str_replace("-", "", $params['sdate']);
$params['edate'] = str_replace("-", "", $params['edate']);

// Strip colons from time
$params['stime'] = str_replace(":", "", $params['stime']);
$params['etime'] = str_replace(":", "", $params['etime']);

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

// Create new params array to send to Suma Sever
$sumaParams = array(
        'id'     => $params['id'],
        'sdate'  => $params['sdate'],
        'edate'  => $params['edate'],
        'stime'  => $params['stime'],
        'etime'  => $params['etime'],
        'format' => $params['format']
    );

// Instantiate Server_IO class, begin retrieval of data from Suma Server,
// and continue retrieval until the hasMore property is false
try 
{
    $io = new Server_IO();
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
if ($params['avgsum'] === 'sum')
{
    $data = $countHash;
}
else
{
    $data = calculateAvg($countHash);
}

// Remove any days outside of query range (Sessions will sometimes pull in extra days)
foreach($data as $key => $val) 
{
    if (($key < $sdate) || ($key > $edate) )
    {
        unset($data[$key]);
    }
}

// Pad out missing dates with zero counts
$dateRange = createDateRangeArray($sdate, $edate);
foreach ($dateRange as $date)
{
    if(!isset($data[$date]))
    {
        $data[$date]['dayCount'] = 0;
    }
}

echo json_encode($data);