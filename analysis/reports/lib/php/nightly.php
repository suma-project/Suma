<?php
$locationBreakdown = true;
if ($locationBreakdown) { header("Content-type: text/plain"); }
require_once 'vendor/autoload.php';
require_once 'NightlyData.php';

// Configuration
$config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

if (isset($config['nightly']))
{
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
	    if ($locationBreakdown) { 
	      // print table based on nightlyData[key]
	      print_r ($nightlyData[$key]);
	    }
	    else {
	      foreach ($init as $key => $count)
		{
		  print " " . $data->hourDisplay[$key] . ': ' . $count . "\n";
		}
	    }
        }
    }
    catch (Exception $e)
    {
        print "Error: " . $e;
    }
}
else
{
    print 'Error: Problem loading config.yaml. Please verify config.yaml exists and contains a valid baseUrl.';
}
