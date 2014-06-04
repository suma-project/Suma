<?php

header('Content-type: application/json');

require_once 'ServerIO.php';
require_once 'setHttpCode.php';
require_once "spyc/Spyc.php";

try
{
    $config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

    if (isset($config['showErrors']) && $config['showErrors'] === true)
    {
        error_reporting(1);
        ini_set('display_errors', 1);
    }
    else
    {
        error_reporting(0);
        ini_set('display_errors', 0);
    }

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
    die(json_encode(array('message' => $message)));
}
