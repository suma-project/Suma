<?php
header('Content-type: application/json');

require_once '../../lib/ChromePhp.php';
require_once '../../lib/underscore.php';
require_once '../../lib/ServerIO.php';
require_once '../../lib/Gump.php';
require_once '../../lib/SumaGump.php';
require_once '../../lib/TimeSeriesData.php';

function lineChartData()
{
    $data = new TimeSeriesData();

    $params = $data->validateInput($_GET);

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
        $params['days'] = $data->weekdays;
    } 
    elseif ($params['daygroup'] === 'weekends') 
    {
        $params['days'] = $data->weekends;
    } 
    else
    {
        $params['days'] = $data->all;
    }

    // Create params array for Suma server
    $sumaParams = $data->populateSumaParams($params);

    // Instantiate ServerIO class, begin retrieval of data from Suma Server,
    // and continue retrieval until the hasMore property is false
    try 
    {
        $io = new ServerIO();
        $data->populateHash($io->getData($sumaParams, $queryType), $params);
        while ($io->hasMore())
        {
            $data->populateHash($io->next(), $params);
        }
    }
    catch (Exception $e)
    {
        $data->echo500($e);
    }

    $test = $data->countHash;

    // Perform additional data processing if necessary (calculate averages)
    if ($params['avgsum'] === 'avg')
    {
        $returnData = $data->calculateAvg($test);
    }
    else
    {
        $returnData = $data->countHash;
    }

    $returnData = $data->cullData($returnData, $params);

    return $returnData;
}


$test = lineChartData();
echo json_encode($test);