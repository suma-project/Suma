<?php

// Config
require_once "lib/spyc/Spyc.php";

// Check that config exists
if (!is_readable('config/config.yaml'))
{
   header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo "<p><strong>service/web/config/config.yaml</strong> does not exist or is not readable.</p>";
    die;
}

// Read config file
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
      ->setBaseUrl($SUMA_BASE_URL);

Zend_Registry::set('sumaDisplayExceptions', $SUMA_THROW_EXCEPTIONS);

// Go
$front->dispatch();
