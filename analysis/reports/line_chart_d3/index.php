<?php 

require_once '../../lib/php/ServerIO.php';

try 
{
    $io = new ServerIO();
    $initiatives = $io->getInitiatives();
}
catch (Exception $e)
{
    header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo '<p>Unable to fetch Initiatives from Query Server.</p>';
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
        <title>Line Chart with d3.js</title>
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
        <link href="../../lib/css/bootstrap-responsive.min.css" rel="stylesheet">
    
        <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
          <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->

    </head>

    <body>

        <div class="navbar navbar-fixed-top navbar-inverse">
            <div class="navbar-inner">
                <div class="container">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="brand" href="..">Suma Reports</a>
                    <div class="nav-collapse">
                        <ul class="nav">
                            <li class="active"><a href="..">Home</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">

            <div class="row">
                <div id="chart" class="span12">
                    <div id="loading"><img src="../../lib/img/spinner.gif"></div>
                    <div id="no-data" class="alert alert-error alert-block">
                        <h4>Warning!</h4>
                            There was insufficient data for display based on your search parameters. Please try a different combination of filters.
                    </div>
                    <div id="ajax-error" class="alert alert-error alert-block">
                        <h4>Warning!</h4>
                            There was a problem retrieving data from the server. Please try again or contact your system
                            administrator.
                    </div>
                    <div id ="welcome" class="alert alert-info alert-block">
                        <h4>Welcome!</h4>
                            Please select an initiative from the select menu below. Once you have chosen an initiative, additional filter options will appear. You can also limit your search by date or time. 
                    </div>
                </div>
            </div>

            <div class="row">
                <form id="chartFilters">
                <fieldset>
                <div class="span4">
                    <div class="control-group">
                        <label class="control-label" for="initiatives">Initiative</label>
                        <div class="controls">
                            <?php echo $initDropDown; ?>
                        </div>
                    </div>
                    <div class="control-group">
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
                <div id="secondary-loading" class="span4"><img src="../../lib/img/spinner.gif"></div>
                <div id="secondary-filters" class="span4">
                      <div class="control-group">
                        <label class="control-label" for="daygroup">Days</label>
                        <div class="controls">
                            <select name="daygroup" id="daygroup">
                                <option value="all">All</option>
                                <option value="weekdays">Weekdays Only</option>
                                <option value="weekends">Weekends Only</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="avgsum">Sum/Avg</label>
                        <div class="controls">
                            <select name="avgsum" id="avgsum">
                                <option value="sum">Sum</option>
                                <option value="avg">Average</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="locations">Locations</label>
                        <div class="controls">
                            <select name="locations" id="locations">
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="activities">Activities</label>
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

        <!-- TEMPLATES -->
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

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
        <script src="../../lib/js/handlebars.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/d3.v2.min.js"></script>
        <script src="../../lib/js/underscore.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="../../lib/js/ReportFilters.js"></script>
        <script src="../../lib/js/TimeSeries.js"></script>
        <script src="js/app.js"></script>

    </body>
</html>