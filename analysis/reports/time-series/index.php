<?php

require_once '../../lib/php/ServerIO.php';

try
{
    $io = new ServerIO();
    $initiatives = $io->getInitiatives();
}
catch (Exception $e)
{
    echo $e->getMessage();
    die;
}

$initDropDown = '<select name="id" id="initiatives">';
$initDropDown .= '<option value="' . 'default' . '">' . 'Select an Initiative' . '</option>' . "\n";
foreach($initiatives as $init)
{
    $initDropDown .= '<option value="' . $init['id'] . '">' . $init['title'] . '</option>' . "\n";
}

$initDropDown .= '</select>';
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Suma Reports | Time Series</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <link href="../../lib/css/bootstrap.min.css" rel="stylesheet">
        <link href="../../lib/css/datepicker.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
        <style>
          body {
            padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
          }
        </style>

        <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
          <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->

    </head>

    <body>

        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <a class="brand" href=".."><img src="../../lib/img/logo.png"></a>
                    <div class="nav-collapse">
                        <ul class="nav">
                            <li><a href="..">Home</a></li>
                            <li><a href="../about.html">About</a></li>
                            <li><a href="../contact.html">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div id="main-chart-header" class="row">
                <div id="main-annotation" class="span7">

                </div>
                <div class="btn-toolbar pull-right">
                    <div id="main-chart-avgsum" class="btn-group" data-toggle="buttons-radio">
                        <button type="button" class="btn btn-small" value="avg">Daily Avg</button>
                        <button type="button" class="btn btn-small active" value="sum">Daily Sum</button>
                    </div>
                    <div class="btn-group">
                        <a class="btn btn-small" href="#summary-data">Summary Data</a>
                    </div>
                    <div class="btn-group">
                        <a class="btn btn-small" href="#csv-export">Export</a>
                    </div>
                    <div id="main-chart-download" class="btn-group">
                        <a id="main-download" download="suma_main_chart.png" data-chart-div="chart1" class="btn btn-small" target="_blank">Save Chart</a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="chart" class="span12">
                    <div id="loading"><img src="../../lib/img/spinner.gif"></div>
                    <div id="no-data" class="alert alert-error alert-block">
                        <h4>Warning!</h4>
                            There was insufficient data for display based on your search parameters. Please try a different combination of filters.
                    </div>
                    <div id="ajax-error" class="alert alert-error alert-block">
                        <h4>Warning!</h4>
                            There was a problem retrieving data from the server. It is possible no data exists for that combination of filters. Please try again or contact your system administrator.
                    </div>
                    <div id ="welcome" class="alert alert-info alert-block">
                        <h4>Welcome!</h4>
                            Please select an initiative from the select menu below. Once you have chosen an initiative, additional filter options will appear. You can also limit your search by date or time.
                    </div>
                    <div id="chart1"></div>
                </div>
            </div>

            <div class="row">
                <div class="span6">
                <div class="row">
                <form id="chartFilters">
                <fieldset>
                <div class="span3">
                    <h3>Modify Chart</h3>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose Initiative" data-content="Choose an initiative to reveal additional filters.">Choose Initiative</h5>
                        <label class="control-label" for="initiatives"></label>
                        <div class="controls">
                            <?php echo $initDropDown; ?>
                        </div>
                    </div>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Classify Counts By" data-content='Choose the date to use for grouping counts by date. "Count Date" shows the actual date of the count, while "Session Start" and "Session End" use the respective date on the collection session containing each count.'>Classify Counts By</h5>
                        <label class="control-label" for="session"></label>
                        <div class="controls">
                             <select name="session" id="session">
                                <option value="count">Count Date</option>
                                <option value="start">Session Start</option>
                                <option value="end">Session End</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Always Include Whole Session" data-content='Select yes if you would like to include counts inside of sessions that may fall outside of your other filters.'>Always Include Whole Session</h5>
                        <label class="control-label" for="session_filter"></label>
                        <div class="controls">
                             <select name="session_filter" id="session_filter">
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose Date Range" data-content="Choose a start and end date for your analysis. Defaults to 6 months from current day. Clear fields to retrieve the complete data set.">Choose Date Range</h5>
                        <label class="control-label" for="sdate">Start Date</label>
                        <div class="controls">
                            <input type="text" id="sdate" name="sdate" />
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="edate">End Date</label>
                        <div class="controls">
                            <input type="text" id="edate" name="edate" />
                        </div>
                    </div>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose subset of daily data" data-content="Include only data gathered during a certain time of day in your analysis, e.g. 8pm-12am.">Choose subset of daily data</h5>
                        <label class="control-label" for="stime">Start Time</label>
                        <div class="controls">
                            <input type="text" id="stime" name="stime" placeholder="00:00" />
                            <span class="help-block">24-hour format, e.g. 08:00</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="etime">End Time</label>
                        <div class="controls">
                            <input type="text" id="etime" name="etime" placeholder="24:00"/>
                            <span class="help-block">24-hour format, e.g. 08:00</span>
                        </div>
                    </div>
                </div>
                <div id="secondary-loading" class="span3"><img id="secondary-spinner" src="../../lib/img/spinner.gif"></div>
                <div id="secondary-filters" class="span3">
                    <h3>Initiative Filters</h3>
                      <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Limit days of the week" data-content="Filter days by weekday or weekend.">Limit days of the week</h5>
                        <label class="control-label" for="daygroup"></label>
                        <div class="controls">
                            <select name="daygroup" id="daygroup">
                                <option value="all">All</option>
                                <option value="weekdays">Weekdays Only</option>
                                <option value="weekends">Weekends Only</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Limit Locations" data-content="Select which locations to include in your analysis. Selecting a location with children will include all children in the data set.">Limit locations</h5>
                        <label class="control-label" for="locations"></label>
                        <div class="controls">
                            <select name="locations" id="locations">
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Limit Activities" data-content="Select which activities to include in your analysis. Activity Groups will include all member activities.">Limit activities</h5>
                        <label class="control-label" for="activities"></label>
                        <div class="controls">
                            <select name="activities" id="activities">
                            </select>
                        </div>
                    </div>
                     <div>
                        <input type="submit" id="submit" class="btn btn-success" data-default-text ="Submit" data-loading-text="Loading..." value="Submit" />
                    </div>
                </div>
                </fieldset>
                </form>
            </div>
            <div id="summary-data" class="row span5">
                <a name="summary-data"></a>
                <div id="summary-data-header" class="row"><h3>Summary Data</h3></div>
                <div id="total-data" class="row"></div>
                <div id="locations-data" class="row"></div>
                <div id="activities-data" class="row"></div>
                <div id="year-data" class="row"></div>
                <div id="month-data" class="row"></div>
                <div id="weekday-data" class="row"></div>
                <div id="hour-data" class="row"></div>
            </div>
            </div>
                <div id="supplemental-charts" class="span6">
                    <div class="row">
                        <div class="span6">
                            <h3>Locations and Activities</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="btn-toolbar pull-right">
                            <div id="supp-chart-locact" class="btn-group" data-toggle="buttons-radio">
                                <button type="button" class="btn btn-small active" value="locations">Locations</button>
                                <button type="button" class="btn btn-small" value="activities">Activities</button>
                            </div>
                            <div id="supp-chart-avgsum" class="btn-group" data-toggle="buttons-radio">
                                <button type="button" class="btn btn-small" value="avg">Avg</button>
                                <button type="button" class="btn btn-small active" value="sum">Sum</button>
                                <button type="button" class="btn btn-small" value="pct">Pct</button>
                            </div>
                            <div id="supp-chart-download" class="btn-group">
                                <a id="supp-download" download="suma_secondary_chart.png" data-chart-div="chart2" class="btn btn-small" target="_blank">Save Chart</a>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span6">
                            <div id="chart2"></div>
                        </div>
                    </div>
                    <div id="supp-chart-note" class="row">
                        <div class="span6">
                            <p class="muted"><strong>Note:</strong> When "Avg" is selected on both charts, the supplemental chart displays the average of observations, rather than the average of days.</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span6">
                            <div>
                                <a name="csv-export"></a>
                                <h3>CSV Download</h3>
                                <a id="csv" download="suma_data_export.csv" class="btn btn-small post-load-popover" href="" rel="popover" data-trigger="hover" data-delay="300" data-title="Export Raw Data" data-content="Export the raw data for the filters submitted to create this report.">Export Raw Data</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TEMPLATES -->
        <script id="main-annotation-template" type="text/x-handlebars-template">
            <p class="muted"><strong>Initiative:</strong> {{id}}
                            <strong>Dates:</strong> {{sdate}} - {{edate}} <br/>
                            <strong>Subset:</strong> {{stime}} - {{etime}}
                            <strong>Days:</strong> {{daygroup}} <br/>
                            <strong>Locations:</strong> {{locations}}
                            <strong>Activities:</strong> {{activities}}</p>
        </script>
        <script id="locations-template" type="text/x-handlebars-template">
            <option value="all">All</option>
            {{#each items}}
                <option value="{{id}}">{{indent depth}}{{title}}</option>
            {{/each}}
        </script>
        <script id="activities-template" type="text/x-handlebars-template">
            <option value="all">All</option>
            {{#each items}}
                <option value="{{type}}-{{id}}">{{indent depth}}{{title}}</option>
            {{/each}}
        </script>
        <script id="total-sum-table" type="text/x-handlebars-template">
            <h4>Total Sum</h4>
            {{#each items}}
                <p>{{countFormat count}}</p>
            {{/each}}
        </script>
        <script id="locations-sum-table" type="text/x-handlebars-template">
            <h4>Totals by Location</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{countFormat count}}</td>
                            <td>{{percent}}%</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </script>
        <script id="activities-sum-table" type="text/x-handlebars-template">
            <h4>Totals by Activity</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{countFormat count}}</td>
                            <td>{{percent}}%</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </script>
        <script id="year-table" type="text/x-handlebars-template">
            <h4>Totals by Year</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{countFormat count}}</td>
                            <td>{{percent}}%</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </script>
        <script id="month-table" type="text/x-handlebars-template">
            <h4>Totals by Month</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{countFormat count}}</td>
                            <td>{{percent}}%</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </script>
        <script id="weekday-table" type="text/x-handlebars-template">
            <h4>Totals by Weekday</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Weekday</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{countFormat count}}</td>
                            <td>{{percent}}%</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </script>
        <script id="hour-table" type="text/x-handlebars-template">
            <h4>Totals by Hour</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>Hour</th>
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{hourFormat name}}</td>
                            <td>{{countFormat count}}</td>
                            <td>{{percent}}%</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </script>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
        <script src="../../lib/js/handlebars.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/d3.v2.min.js"></script>
        <script src="../../lib/js/lodash.min.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="../../lib/js/string.min.js"></script>
        <script src="../../lib/js/canvg.js"></script>
        <script src="../../lib/js/ReportFilters.js"></script>
        <script src="../../lib/js/TimeSeries.js"></script>
        <script src="../../lib/js/BarChart.js"></script>
        <script src="js/app.js"></script>

    </body>
</html>