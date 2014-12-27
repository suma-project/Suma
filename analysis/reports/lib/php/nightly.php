<?php
require_once 'vendor/autoload.php';
require_once 'NightlyData.php';

/* get command-line arguments if present. allowed values:
   locations
   --hours-across
   --html
   --hide-zeros
*/
$locationBreakdown = (array_search("locations", $argv) ? (array_search("locations", $argv) > 0 ? true : "") : false);
$hoursAcross = (array_search("--hours-across", $argv) ? (array_search("--hours-across", $argv) > 0 ? true : "") : false);
$outputHtml = (array_search("--html", $argv) ? (array_search("--html", $argv) > 0 ? true : "") : false);
$hideZeroHours = (array_search("--hide-zeros", $argv) ? (array_search("--hide-zeros", $argv) > 0 ? true : "") : false);

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
            $data        = new NightlyData();
            $nightlyData = $data->getData($DAY_PROCESS);
        
            // Print Output
        
            // Add stylesheet if multiple locations
            if ($outputHtml)
                {
                    print '<style>';
                    print 'table { border-collapse: collapse;}';
                    print 'td,th { border: 1px solid black; text-align: center;}';
                    print 'tr:first-child { font-weight: bold }';
                    print 'td:first-child { font-weight: bold }';
                    print '</style>';
                }
        
            foreach ($nightlyData as $key => $init)
                {
                    $table = ($data->buildLocationStatsTable($nightlyData[$key], $key));
            
                    if (!$locationBreakdown)
                        {
                            $table = $data->eliminateLocations($table);
                        }
                    if ($hideZeroHours)
                        {
                            $table = $data->hideZeroHours($table);
                        }
                    if ($hoursAcross)
                        {
                            $table = $data->sideways($table);
                        }
                    if ($outputHtml)
                        {
                            print "<h2>" . $key . "</h2>\n";
                            print($data->formatTable($table, "html"));
                        }
            else
                {
                    print "\n" . $key . "\n";
                    print($data->formatTable($table));
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