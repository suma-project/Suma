<?php
header('Content-type: application/json');

require_once '../../lib/php/ServerIO.php';
/**
 * Function invoked when reportFilters.php receives an AJAX call
 * from the client. Handles the assembly of activity and location
 * filter data.
 *
 * @return array
 */
function reportFiltersData()
{
    // Get id from form
    $params = array('id'     => $_GET['id'],
                    'format' => 'alc',
                    'limit'  => '1');

    // Instantiate ServerIO and retrieve dictionary
    try
    {
        $io = new ServerIO();
        $response = $io->getData($params, 'counts');
    }
    catch (Exception $e)
    {
        echo json_encode($e->getCode());
    }

    // Assemble filter data
    $data = array(
        'activities'     => $response['initiative']['dictionary']['activities'],
        'activityGroups' => $response['initiative']['dictionary']['activityGroups'],
        'locations'      => $response['initiative']['dictionary']['locations'],
        'rootLocation'   => $response['initiative']['rootLocation']
        );

    return $data;
}

$filterData = reportFiltersData();

echo json_encode($filterData);