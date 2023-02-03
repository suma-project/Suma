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
    $SUMA_ERROR_REPORTING  = E_ERROR | E_WARNING | E_PARSE;
    $SUMA_DISPLAY_ERRORS   = 'on';
    $SUMA_THROW_EXCEPTIONS =  true;
    error_reporting($SUMA_ERROR_REPORTING);
}
else
{
    $SUMA_DISPLAY_ERRORS   = 'off';
    $SUMA_THROW_EXCEPTIONS =  false;
}

// Error Reporting
ini_set('display_errors', $SUMA_DISPLAY_ERRORS);

// Set paths
ini_set('include_path', ini_get('include_path') . PATH_SEPARATOR . $SUMA_SERVER_PATH . PATH_SEPARATOR . $SUMA_SERVER_PATH . '/vendor/shardj/zf1-future/library');

try
{
    // Zend Framework CLass Loader
    if (!include_once('Zend/Loader.php'))
    {
        throw new Exception('Possible error in SUMA_SERVER_PATH.');
    }

    if (!include_once('Zend/Session.php'))
    {
        throw new Exception('Possible error in SUMA_SERVER_PATH.');
    }

    if (!include_once('config/Globals.php'))
    {
        throw new Exception('Possible error in SUMA_SERVER_PATH.');
    }

    try {
        Zend_Loader::loadClass('Zend_Controller_Front');

        $sessionFileBase = "../config/session";
        if (is_readable($sessionFileBase.'.yaml'))
        {
            $sessionConfig = new Zend_Config_Yaml($sessionFileBase.'.yaml', 'production');
        }
        elseif (is_readable($sessionFileBase.'.ini'))
        {
            $sessionConfig = new Zend_Config_Ini($sessionFileBase.'.ini', 'production');
        }
        else
        {
            $sessionConfig = null;
        }

        // If session config has been loaded properly, set it.
        // App shouldn't die if session options are not set
        if ($sessionConfig) {
            Zend_Session::setOptions($sessionConfig->toArray());
        }

        // Get front controller instance
        // Configure for Zone
        $front = Zend_Controller_Front::getInstance();
        $front->setControllerDirectory($SUMA_CONTROLLER_PATH)
              ->setBaseUrl($SUMA_BASE_URL);

        Zend_Registry::set('sumaDisplayExceptions', $SUMA_THROW_EXCEPTIONS);

        // Go
        $front->dispatch();
    }
    catch (Exception $e)
    {
        throw new Exception("Possible error in SUMA_CONTROLLER_PATH. " . $e->getMessage());
    }
}
catch (Exception $e)
{
    header("HTTP/1.1 500 Internal Server Error");
    print "Trouble loading Suma server application. This is often caused by configuration issues. Please refer to the troubleshooting docs at http://suma-project.github.io/Suma ";
    print "The raw output is below: ";
    print $e->getMessage();
    die;
}
