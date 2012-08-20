<?php 

require_once '../../lib/Server_IO.php';

try 
{
    $initiatives = Server_IO::getInitiatives();
}
catch (Exception $e)
{
    header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo '<p>Unable to fetch Initiatives from Query Server.</p>';
    die;
}
$initDropDown = '<select name="id" id="initiatives">';
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

        <link href="../../lib/css/bootstrap.css" rel="stylesheet">
        <link href="../../lib/css/datepicker.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
        <style>
          body {
            padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
          }
        </style>
        <link href="../../lib/css/bootstrap-responsive.css" rel="stylesheet">
    
        <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
        <!--[if lt IE 9]>
          <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->

    </head>

    <body>

        <div class="navbar navbar-fixed-top">
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
                            <input type="text" id="stime" name="stime" />
                            <span class="help-block">24-hour format, e.g. 0800</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="etime">End Time</label>
                        <div class="controls">
                            <input type="text" id="etime" name="etime" />
                            <span class="help-block">24-hour format, e.g. 0800</span>
                        </div>
                    </div>
                </div>
                <div class="span4">
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
                        <label class="control-label" for="avgsum">Avg/Sum</label>
                        <div class="controls">
                            <select name="avgsum" id="avgsum">
                                <option value="avg">Average</option>
                                <option value="sum">Sum</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="locations">Locations</label>
                        <div class="controls">
                            <select name="locations" id="locations">
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label" for="activities">Activities</label>
                        <div class="controls">
                            <select name="activities" id="activities">
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <input type="submit" id="submit" class="btn btn-success" value="Submit" />
                    </div>
                </div>
               
                <div id="summary" class="span4">
                    <h3>Summary</h3>
                    <h4>Sum</h4>
                        <p id="sum"></p>
                    <h4>Avg</h4>
                        <p id="avg"></p>
                </div>
                </fieldset>
                </form>
            </div>
        </div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/d3.v2.min.js"></script>
        <script src="../../lib/js/underscore.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="js/interface.js"></script>
        <script src="js/timeSeries.js"></script>
        <script src="js/chart.js"></script>

    </body>
</html>