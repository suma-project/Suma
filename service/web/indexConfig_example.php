<?php

// Path Configuration
$SUMA_SERVER_PATH = 'SUMA_SERVER_PATH';
$SUMA_CONTROLLER_PATH = 'SUMA_CONTROLLER_PATH';
$SUMA_BASE_URL = '/sumaserver';

// Debug mode
$SUMA_DEBUG = false;

// Debug Mode Setup
if ($SUMA_DEBUG == false)
{
    $SUMA_ERROR_REPORTING  = 0;
    $SUMA_DISPLAY_ERRORS   = 'off';
    $SUMA_THROW_EXCEPTIONS =  false;
}
else
{
    $SUMA_ERROR_REPORTING  = E_ERROR | E_WARNING | E_PARSE | E_NOTICE;
    $SUMA_DISPLAY_ERRORS   = 'on';
    $SUMA_THROW_EXCEPTIONS =  true;
}

// Error Reporting
error_reporting($SUMA_ERROR_REPORTING);
ini_set('display_errors', $SUMA_DISPLAY_ERRORS);

// Set paths
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . $SUMA_SERVER_PATH . PATH_SEPARATOR . $SUMA_SERVER_PATH . '/lib/zend/library');