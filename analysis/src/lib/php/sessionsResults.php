<?php

header('Content-type: application/json');

require_once 'SessionsData.php';
require_once 'setHttpCode.php';

try {
    // Initialize class and retrieve data
    $data = new SessionsData();

    // $_GET superglobal is only used to read
    // input parameters. It is not modified by
    // SessionsData.php and extraneous parameters
    // will be ignored. All necessary parameters
    // are validated before being used by the system.
    $sessionData = $data->getData($_GET);
    echo json_encode($sessionData);
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
