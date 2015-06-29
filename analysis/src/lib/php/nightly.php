<?php
require_once 'vendor/autoload.php';
require_once 'NightlyData.php';

/* get command-line arguments if present. allowed values:
   locations
   --hours-across
   --html
   --hide-zeros
   --start-hour=****
*/
$locationBreakdown = (array_search("locations", $argv) ? (array_search("locations", $argv) > 0 ? true : "") : false);
$hoursAcross = (array_search("--hours-across", $argv) ? (array_search("--hours-across", $argv) > 0 ? true : "") : false);
$outputHtml = (array_search("--html", $argv) ? (array_search("--html", $argv) > 0 ? true : "") : false);
$hideZeroHours = (array_search("--hide-zeros", $argv) ? (array_search("--hide-zeros", $argv) > 0 ? true : "") : false);

$findStartHour = preg_grep('/start-hour=\d{4}$/', $argv);

if ($findStartHour)
{
    $hour = array_values($findStartHour);
    $pieces = explode("=", $hour[0]);
    $startHour = $pieces[1];
}
else
{
    $startHour = "0000";
}

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
        $data        = new NightlyData($startHour);
        $nightlyData = $data->getData($DAY_PROCESS);

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

        if ($startHour !== "0000")
        {
            print "\nNOTICE: The 24-Hour period of this report has been modified to start at " . date('H:i', strtotime($startHour)) . ".\n";
        }

        foreach ($nightlyData as $key => $init)
        {
            $table = ($data->buildLocationStatsTable($nightlyData[$key]['counts'], $key));

            if (!$locationBreakdown)
            {
                $table = $data->eliminateLocations($table);
            }

            if ($hideZeroHours)
            {
                $table = $data->hideZeroHours($table);
                $table = $data->hideZeroColumns($table);
            }

            if ($hoursAcross)
            {
                $table = $data->sideways($table);
            }

            if ($outputHtml)
            {
                print "<h2>" . $key . "</h2>\n";

                # print link to timeseries report only if analysisBaseUrl is set
                if (isset($config['analysisBaseUrl']))
                {
                    print "<a href='" . $config['analysisBaseUrl'] . $nightlyData[$key]['url'] . "'>Time Series Report</a>\n";
                }
                print($data->formatTable($table, "html"));
            }
            else
            {
                print "\n" . $key . "\n";
                # print link to timeseries report only if analysisBaseUrl is set
                if (isset($config['analysisBaseUrl']))
                {
                    print $config['analysisBaseUrl'] . $nightlyData[$key]['url'] . "\n\n";
                }
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
