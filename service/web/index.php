<?php

// Config
require_once "../config/indexConfig.php";

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
