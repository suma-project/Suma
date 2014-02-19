<?php

header('Content-type: application/json');

require_once 'Data.php';
require_once 'setHttpCode.php';

// Instantiate Data class
$data = new Data();

try {
    // $_GET superglobal is only used to read
    // input parameters. It is not modified by
    // Data.php and extraneous parameters will
    // be ignored. All necessary parameters are
    // validated before being used by the system.
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
