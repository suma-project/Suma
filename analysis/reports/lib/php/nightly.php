<?php
require_once 'vendor/autoload.php';
require_once 'NightlyData.php';

// get command-line variable 'locations' if present
$locationBreakdown = (array_search("locations",$argv) ? (array_search("locations",$argv) > 0 ? "locations" : "") : "");

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
	$data->locationBreakdown = $locationBreakdown;
        $nightlyData = $data->getData($DAY_PROCESS);

        // Print Output

	// Add stylesheet if multiple locations
	if ($locationBreakdown) {
	  print '<style>';
	  print 'table { border-collapse: collapse;}';
	  print 'td,th { border: 1px solid black; text-align: center;}';
	  print '</style>';
	}

        foreach ($nightlyData as $key => $init)
        {
	    if ($locationBreakdown) { 
	      print "<h2>" . $key . "</h2>\n";
	      print ($data->buildLocationStatsTable($nightlyData[$key], $key));
	    }
	    else {
	      print "\n" . $key . "\n";
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
