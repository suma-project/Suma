<?php

// Error Reporting
error_reporting(0);
ini_set('display_errors', 'off');

// Set paths
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . 'SUMA_SERVER_PATH');

// Zend Framework CLass Loader
require_once "Zend/Loader.php";

require_once "config/Globals.php";

Zend_Loader::loadClass('Zend_Controller_Front');

// Get front controller instance
// Configure for Zone
$front = Zend_Controller_Front::getInstance();
$front->setControllerDirectory('SUMA_CONTROLLER_PATH')
      ->setBaseUrl('/sumaserver') // set the base url
      ->throwExceptions(false);

// Go
$front->dispatch();

?>
