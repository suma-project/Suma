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

$initDropDown = '<select name="id" id="initiatives" class="form-control">';
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
        <title>Suma Reports | Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="../../lib/css/bootstrap.min.css" rel="stylesheet">
        <link href="../../lib/css/bootstrap-theme.min.css" rel="stylesheet">
        <link href="../../lib/css/datepicker.css" rel="stylesheet">
        <link href="../../lib/css/non-responsive.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet"  />

        <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
          <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    </head>

    <body>
        <div class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </button>
                    <a class="navbar-brand" href=".."><img src="../../lib/img/logo.png"></a>
                </div>
                <div class="collapse navbar-collapse bs-navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><a href="..">Home</a></li>
                        <li><a href="../about.html">About</a></li>
                        <li><a href="../contact.html">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div id="main" class="container">
            <div id="calendar-header" class="row">
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-12">
                            <div id="error-container"></div>
                            <div id ="welcome" class="alert alert-info alert-block">
                                <h4>Welcome!</h4>
                                    Please select an initiative from the select menu below. Once you have chosen an initiative, additional filter options will appear. You can also limit your search by date or time.
                            </div>
                            <div id="loading"><img src="../../lib/img/spinner.gif"></div>
                            <div id="controls" class="pull-right">
                                <a id="calendar-download" download="suma_calendar_chart.png" data-chart-div="chart" class="btn btn-default btn-sm" target="_blank">Save Chart</a>
                                <div id="avg-sum" class="btn-group" data-toggle="buttons">
                                    <label for="avg" class="btn btn-default btn-sm" data-state="avg">
                                        <input type="radio" name="chart-state" id="avg" value="avg">Daily Avg
                                    </label>
                                    <label for="sum" class="btn btn-default btn-sm active" data-state="sum">
                                        <input type="radio" name="chart-state" id="sum" value="sum">Daily Sum
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div id="chart"></div>
                            <div id="legend">
                                <span>Less</span>
                                <ul class="legend-list">
                                    <li style="background-color: #eee"></li>
                                    <li style="background-color: #d6e685"></li>
                                    <li style="background-color: #8cc665"></li>
                                    <li style="background-color: #44a340"></li>
                                    <li style="background-color: #1e6823"></li>
                                </ul>
                                <span>More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <form id="chartFilters">
                    <fieldset>
                        <div class="col-xs-12">
                            <div class="row">
                                <div class="col-xs-9">
                                    <h3>Modify Chart</h3>
                                </div>
                                <div class="col-xs-3 secondary-filters">
                                    <h3>Initiative Filters</h3>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-3">
                                    <div class="form-group">
                                        <label for="initiatives" class="suma-popover" data-title="Select Initiative" data-content="Select an initiative to reveal additional filters.">Select an Initiative</label>
                                        <?php echo $initDropDown; ?>
                                    </div>
                                    <div class="form-group">
                                        <label for="session" class="suma-popover" data-title="Classify Counts By" data-content='Choose the date to use for grouping counts by date. "Count Date" shows the actual date of the count, while "Session Start" and "Session End" use the respective date on the collection session containing each count.'>Classify Counts By</label>
                                        <select name="session" id="session" class="form-control">
                                            <option value="count">Count Date</option>
                                            <option value="start">Session Start</option>
                                            <option value="end">Session End</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="session_filter" class="suma-popover" data-title="Always Include Whole Session" data-content="Select yes if you would like to include counts inside of sessions that may fall outside of your other filters.">Always Include Whole Session</label>
                                        <select name="session_filter" id="session_filter" class="form-control">
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-xs-3">
                                    <div class="form-group">
                                        <label for="sdate" class="suma-popover" data-title="Choose Date Range" data-content="Select a start date for your analysis. Defaults to 6 months from current day. Clear fields to retrieve the complete data set.">Start Date</label>
                                        <input type="text" id="sdate" name="sdate" class="form-control" />
                                        <span class="help-block">YYYY-MM-DD</span>
                                    </div>
                                    <div class="form-group">
                                        <label for="edate" class="suma-popover" data-title="Choose Date Range" data-content="Select an end date for your analysis. Clear fields to retrieve complete data set.">End Date</label>
                                        <input type="text" id="edate" name="edate" class="form-control"/>
                                        <span class="help-block">YYYY-MM-DD</span>
                                    </div>
                                </div>
                                <div class="col-xs-3">
                                    <div class="form-group">
                                        <label for="stime" class="suma-popover" data-title="Select Subset of Day" data-content="Include only data gathered during a certain time of day in your analysis, e.g. 8pm-12am.">Start Time</label>
                                        <input type="text" id="stime" name="stime" placeholder="00:00" class="form-control"/>
                                        <span class="help-block">24-hour format, e.g. 08:00</span>
                                    </div>
                                    <div class="form-group">
                                        <label for="etime" class="suma-popover" data-title="Select Subset of Day" data-content="Include only data gathered during a certain time of day in your analysis, e.g. 8pm-12am.">End Time</label>
                                        <input type="text" id="etime" name="etime" placeholder="24:00" class="form-control"/>
                                        <span class="help-block">24-hour format, e.g. 08:00</span>
                                    </div>
                                </div>
                                <div class="col-xs-3 secondary-loading"><img id="secondary-spinner" src="../../lib/img/spinner.gif"></div>
                                <div class="col-xs-3 secondary-filters">
                                    <div class="form-group">
                                        <label for="daygroup" class="suma-popover" data-title="Limit Days of the Week" data-content="Filter by Weekday or Weekend.">Limit Days of the Week</label>
                                        <select name="daygroup" id="daygroup" class="form-control">
                                            <option value="all">All</option>
                                            <option value="weekdays">Weekdays Only</option>
                                            <option value="weekends">Weekends Only</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="locations" class="suma-popover" data-title="Limit Locations" data-content="Select which locations to include in your analysis. Selecting a location with children will include all children in the data set.">Limit Locations</label>
                                            <select name="locations" id="locations" class="form-control"></select>
                                    </div>
                                    <div class="form-group">
                                        <label for="activities" class="suma-popover" data-title="Limit Activities" data-content="Select which activities to include in your analysis. Selecting an Activity Group will include all group activities.">Limit Activities</label>
                                        <select name="activities" id="activities" class="form-control"></select>
                                    </div>
                                    <div>
                                        <input type="submit" id="submit" class="btn btn-success" data-default-text ="Submit" data-loading-text="Loading..." value="Submit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>

        <!-- Templates -->
        <script id="locations-template" type="text/x-handlebars-template">
            <option value="all">All</option>
            {{#each items}}
                <option value="{{id}}">{{indent depth}}{{{title}}}</option>
            {{/each}}
        </script>
        <script id="activities-template" type="text/x-handlebars-template">
            <option value="all">All</option>
            {{#each items}}
                <option value="{{type}}-{{id}}">{{indent depth}}{{{title}}}</option>
            {{/each}}
        </script>
        <script id="error" type="text/x-handlebars-template">
            <div class="alert alert-error alert-block">
                <h4>Warning!</h4>
                <p>There was a problem retrieving data from the server. Please try again or contact your system administrator.</p>
                {{#each items}}
                    <p>Error Message: {{msg}}</p>
                {{/each}}
            </div>
        </script>

        <!-- Libraries -->
        <script src="../../lib/js/jquery.min.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/handlebars.js"></script>
        <script src="../../lib/js/d3.v3.min.js"></script>
        <script src="../../lib/js/lodash.min.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="../../lib/js/canvg.js"></script>

        <!-- Suma Modules -->
        <script src="../../lib/js/Errors.js"></script>
        <script src="../../lib/js/ReportFilters.js"></script>
        <script src="../../lib/js/Calendar.js"></script>

        <!-- App -->
        <script src="js/app.js"></script>

    </body>
</html>