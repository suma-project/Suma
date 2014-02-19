<?php

header('Content-type: application/json');

require_once 'Data.php';
require_once 'setHttpCode.php';

// Instantiate Data class
$data = new Data();

try {
    $chartData = $data->getData($_GET);
    echo json_encode($chartData);
}
catch (Exception $e)
{

    $message = (string)$e->getMessage();
    $code = (int)$e->getCode();
    $header = setHttpCode($code);

    // Set Header
    header($header);

    // Return JSON with display data
    die(json_encode(array('message' => $message)));
}
