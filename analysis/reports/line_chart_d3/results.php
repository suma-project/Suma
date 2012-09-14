<?php
header('Content-type: application/json');

require_once '../../lib/php/underscore.php';
require_once '../../lib/php/ServerIO.php';
require_once '../../lib/php/Gump.php';
require_once '../../lib/php/SumaGump.php';
require_once '../../lib/php/TimeSeriesData.php';
/**
 * Function invoked when results.php receives an AJAX call
 * from the client. Handles the assembly and processing of data
 * to return to the client.
 * 
 * @return array
 */
function lineChartData()
{
    // Instantiate TimeSeriesData class
    $data = new TimeSeriesData();

    // Validate form input
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

    // Perform additional data processing if necessary (calculate averages)
    if ($params['avgsum'] === 'avg')
    {
        $returnData = $data->calculateAvg($data->countHash);
    }
    else
    {
        $returnData = $data->countHash;
    }

    // Cull data, removing or padding days as necessary
    $returnData = $data->cullData($returnData, $params);

    return $returnData;
}
$chartData = lineChartData();
echo json_encode($chartData);