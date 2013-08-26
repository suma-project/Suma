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
        <title>Suma Reports | Sessions Summary</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <link href="../../lib/css/bootstrap.min.css" rel="stylesheet">
        <link href="../../lib/css/datepicker.css" rel="stylesheet">
        <link href="../../lib/css/non-responsive.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">

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
                    <a class="navbar-brand" href="#"><img src="../../lib/img/logo.png"></a>
                </div>
                <div class="collapse navbar-collapse bs-navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <div id="error-container">
                    </div>
                    <div id ="welcome" class="alert alert-info alert-block">
                        <h4>Welcome!</h4>
                        Please select an initiative from the select menu below and limit your search by date or time as necessary.
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-12">
                            <h3>Filter Sessions</h3>
                        </div>
                    </div>
                    <div class="row">
                        <form id="chartFilters">
                            <div class="col-xs-3">
                                <div>
                                    <h4 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose Initiative" data-content="Select an initiative by name.">Choose Initiative</h4>
                                    <label for="initiatives">Select an Initiative</label>
                                    <?php echo $initDropDown; ?>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <h4 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose Date Range" data-content="Choose a start and end date for your analysis. Defaults to 6 months from current day. Clear fields to retrieve the complete data set.">Choose Date Range</h4>
                                    <label for="sdate">Start Date</label>
                                    <input class="form-control" type="text" id="sdate" name="sdate" />
                                </div>
                                <div class="form-group">
                                    <label for="edate">End Date</label>
                                    <input class="form-control" type="text" id="edate" name="edate" />
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <h4 class="suma-popover" rel="popover" data-trigger="hover" data-delay="300" data-title="Choose Subset of Day" data-content="Include data gathered during a certain time of day.">Choose Subset of Day</h4>
                                    <label for="stime">Start Time (24-hour, e.g 08:00)</label>
                                    <input class="form-control" type="text" id="stime" name="stime" placeholder="00:00" />
                                </div>
                                <div class="form-group">
                                    <label for="etime">End Time (24-hour, e.g. 13:00)</label>
                                    <input class="form-control" type="text" id="etime" name="etime" placeholder="24:00"/>
                                </div>
                                <div>
                                    <input type="submit" id="submit" class="btn btn-success" data-default-text ="Submit" data-loading-text="Loading..." value="Submit" />
                                </div>
                            </div>
                            <div class="col-xs-3"></div>
                        </form>
                    </div>
                </div>
            </div>
            <div id="sessions-data" class="row"></div>  
        </div>

        <div id="loadingWidget"></div>

        <script id="sessions-table" type="text/x-handlebars-template">
            <h4>Totals by Session</h4>
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{id}}</td>
                            <td>{{start}}</td>
                            <td>{{end}}</td>
                            <td>{{total}}</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
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
        <script src="../../lib/js/handlebars.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/d3.v3.min.js"></script>
        <script src="../../lib/js/lodash.min.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="../../lib/js/spin.min.js"></script>
        <script src="../../lib/js/Errors.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>