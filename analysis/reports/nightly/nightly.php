<?php

require_once '../../lib/php/NightlyData.php';
require_once 'nightly_config.php';

// Initialize class and retrieve data
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
