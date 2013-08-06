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
        <title>Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <link href="../../lib/css/bootstrap.css" rel="stylesheet">
        <link href="../../lib/css/datepicker.css" rel="stylesheet">
        <link href="../../lib/css/colorbrewer.css" rel="stylesheet" />
        <link href="css/style.css" rel="stylesheet"  />
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

        <div id="main" class="container">
            <div id="calendar-header" class="row">
                <div id="error-container">
                </div>
                <div id ="welcome" class="alert alert-info alert-block">
                    <h4>Welcome!</h4>
                        Please select an initiative from the select menu below. Once you have chosen an initiative, additional filter options will appear. You can also limit your search by date or time.
                </div>
                <div id="loading"><img src="../../lib/img/spinner.gif">
                </div>
                <div id="controls" class="btn-toolbar pull-right">
                    <div id="avg-sum" class="btn-group" data-toggle="buttons-radio">
                        <button type="button" class="btn btn-small" value="avg">Daily Avg</button>
                        <button type="button" class="btn btn-small active" value="sum">Daily Sum</button>
                    </div>
                    <div id="calendar-chart-download" class="btn-group">
                        <a id="calendar-download" download="suma_calendar_chart.png" data-chart-div="chart" class="btn btn-small" target="_blank">Save Chart</a>
                    </div>
                </div>
                <div id="chart">
                </div>
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

            <div class="row">
                <form id="chartFilters">
                    <fieldset>
                        <div class="span9">
                            <div class="row">
                                <div class="span9">
                                    <h3>Modify Chart</h3>
                                </div>
                                <div class="span3">
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
                                </div>
                                <div class="span3">
                                    <div class="control-group">
                                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose Date Range" data-content="Choose a start and end date for your analysis. Defaults to 6 months from current day. Clear fields to retrieve the complete data set.">Choose Date Range</h5>
                                        <label class="control-label" for="sdate">Start Date</label>
                                        <div class="controls">
                                            <input type="text" id="sdate" name="sdate" class="input-medium" />
                                        </div>
                                    </div>
                                    <div class="control-group">
                                        <label class="control-label" for="edate">End Date</label>
                                        <div class="controls">
                                            <input type="text" id="edate" name="edate" class="input-medium"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="span3">
                                    <div class="control-group">
                                        <h5 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose subset of daily data" data-content="Include only data gathered during a certain time of day in your analysis, e.g. 8pm-12am.">Choose subset of daily data</h5>
                                        <label class="control-label" for="stime">Start Time</label>
                                        <div class="controls">
                                            <input type="text" id="stime" name="stime" placeholder="00:00" class="input-medium"/>
                                            <span class="help-block">24-hour format, e.g. 08:00</span>
                                        </div>
                                    </div>
                                    <div class="control-group">
                                        <label class="control-label" for="etime">End Time</label>
                                        <div class="controls">
                                            <input type="text" id="etime" name="etime" placeholder="24:00" class="input-medium"/>
                                            <span class="help-block">24-hour format, e.g. 08:00</span>
                                        </div>
                                    </div>
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
        </div>

        <!-- Templates -->
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
        <script id="error" type="text/x-handlebars-template">
            <div class="alert alert-error alert-block">
                <h4>Warning!</h4>
                <p>There was a problem retrieving data from the server. Please try again or contact your system administrator.</p>
                {{#each items}}
                    <p>Error Message: {{msg}}</p>
                {{/each}}
            </div>
        </script>

        <script src="../../lib/js/jquery.min.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/handlebars.js"></script>
        <script src="../../lib/js/d3.v3.min.js"></script>
        <script src="../../lib/js/lodash.min.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="../../lib/js/canvg.js"></script>
        <script src="../../lib/js/Errors.js"></script>
        <script src="../../lib/js/ReportFilters.js"></script>
        <script src="../../lib/js/Calendar.js"></script>
        <script src="js/app.js"></script>

    </body>
</html>