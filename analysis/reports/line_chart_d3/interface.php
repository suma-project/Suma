<?php
header('Content-type: application/json');

include '../../lib/ChromePhp.php';
require_once '../../lib/ServerIO.php';

$params = array('id'     => $_GET['id'],
                'format' => 'alc',
                'limit'  => '1');
try 
{
    $io = new ServerIO();
    $response = $io->getData($params, 'counts');
}
catch (Exception $e)
{
    echo500($e);
}

$data = array(
    'activities'       => $response['initiative']['dictionary']['activities'],
    'activityGroups'   => $response['initiative']['dictionary']['activityGroups'],
    'locations'        => $response['initiative']['dictionary']['locations'],
    'fk_root_location' => $response['initiative']['fk_root_location']
    );

echo json_encode($data);