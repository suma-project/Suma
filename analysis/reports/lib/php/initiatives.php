<?php

header('Content-type: application/json');
require_once 'ServerIO.php';
require_once 'setHttpCode.php';

try
{
    $io = new ServerIO();
    $initiatives = $io->getInitiatives();
    echo json_encode($initiatives);
}
catch (Exception $e)
{
    $message = (string)$e->getMessage();
    $code = (int)$e->getCode();

    $header = setHttpCode($code);

    // Set Header
    header($header);

    // Return JSON with display data
    echo json_encode(array('message' => $message));
    die;
}
