<?php

// Config
require_once "lib/spyc/Spyc.php";

$config = Spyc::YAMLLoad('config/config.yaml');

// Path Configuration
$SUMA_SERVER_PATH = $config['SUMA_SERVER_PATH'];
$SUMA_CONTROLLER_PATH = $config['SUMA_CONTROLLER_PATH'];
$SUMA_BASE_URL = $config['SUMA_BASE_URL'];

// Debug Mode Setup
if ($config['SUMA_DEBUG'] == true)
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

// Error Reporting
error_reporting($SUMA_ERROR_REPORTING);
ini_set('display_errors', $SUMA_DISPLAY_ERRORS);

// Set paths
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . $SUMA_SERVER_PATH . PATH_SEPARATOR . $SUMA_SERVER_PATH . '/lib/zend/library');

// Zend Framework CLass Loader
require_once "Zend/Loader.php";

require_once "config/Globals.php";

Zend_Loader::loadClass('Zend_Controller_Front');

// Get front controller instance
// Configure for Zone
$front = Zend_Controller_Front::getInstance();
$front->setControllerDirectory($SUMA_CONTROLLER_PATH)
      ->setBaseUrl($SUMA_BASE_URL)
      ->throwExceptions($SUMA_THROW_EXCEPTIONS);

// Go
$front->dispatch();
