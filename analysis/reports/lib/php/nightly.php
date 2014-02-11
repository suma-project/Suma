<?php

require_once 'NightlyData.php';
require_once 'spyc/Spyc.php';

// Configuration
$config = Spyc::YAMLLoad('../../../../config/config.yaml');

// Default Timezone. See: http://us3.php.net/manual/en/timezones.php
$DEFAULT_TIMEZONE = $config['nightly']['timezone'];
date_default_timezone_set($DEFAULT_TIMEZONE);

// Which day to retrieve hourly report
$DAY_PROCESS = date('Ymd', strtotime('yesterday'));

// Initialize class and retrieve data
try
{
    $data = new NightlyData();
    $nightlyData = $data->getData($DAY_PROCESS);

    // Print Output
    foreach ($nightlyData as $key => $init)
    {
        print "\n" . $key . "\n";
        foreach ($init as $key => $count)
        {
            print " " . $data->hourDisplay[$key] . ': ' . $count . "\n";
        }
    }
}
catch (Exception $e)
{
    print "Error: " . $e;
}
