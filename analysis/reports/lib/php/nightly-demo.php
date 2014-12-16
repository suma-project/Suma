<?php
$locationBreakdown = (isset($_REQUEST['loc']) ? ($_REQUEST['loc'] === 'true' ? true : false) : false);

if ($locationBreakdown) { }
else { header("Content-type: text/plain"); }

require_once 'vendor/autoload.php';
require_once 'NightlyData.php';

if ($locationBreakdown) {
  print '<style>';
  print 'table { border-collapse: collapse;}';
  print 'td,th { border: 1px solid black; text-align: center;}';
  print '</style>';
}
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
        foreach ($nightlyData as $key => $init)
        {
	      print "<h2>" . $key . "</h2>\n";
	      //	      print_r ($nightlyData[$key]);
	      $table = ($data->buildLocationStatsTable($nightlyData[$key], $key));
	      $table = $data->eliminateLocations($table);
	      //	      $table = $data->sideways($table);
	      print "<pre>";
	      print ($data->formatTable($table,"text"));
	      print "</pre>\n";
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
