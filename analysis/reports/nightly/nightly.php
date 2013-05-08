<?php

require_once '../../lib/php/NightlyData.php';
require_once 'nightly_config.php';

// Initialize class and retrieve data
$data = new NightlyData();
$data->processData($DAY_PROCESS);
$hash = $data->countHash;

// Print Output
foreach ($hash as $key => $init)
{
    print "\n" . $key . "\n";
    foreach ($init as $key => $count)
    {
        print " " . $data->hourHash[$key] . ': ' . $count . "\n";
    }
}
