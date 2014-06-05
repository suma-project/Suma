<?php

header('Content-type: application/json');

require_once 'ServerIO.php';
require_once 'setHttpCode.php';
require_once "spyc/Spyc.php";

try
{
    $config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

    // Set Error Reporting Levels
    if (isset($config['showErrors']) && $config['showErrors'] === true)
    {
       $SUMA_ERROR_REPORTING  = E_ERROR | E_WARNING | E_PARSE | E_NOTICE;
       $SUMA_DISPLAY_ERRORS   = 'on';
       $SUMA_THROW_EXCEPTIONS =  true;
    }
    else
    {
       $SUMA_ERROR_REPORTING  = 0;
       $SUMA_DISPLAY_ERRORS   = 'off';
       $SUMA_THROW_EXCEPTIONS =  false;
    }

    error_reporting($SUMA_ERROR_REPORTING);
    ini_set('display_errors', $SUMA_DISPLAY_ERRORS);

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
