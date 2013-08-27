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
                                    <label for="initiatives" class="suma-popover" data-title="Select Initiative" data-content="Select an initiative to reveal additional filters.">Select an Initiative</label>
                                    <?php echo $initDropDown; ?>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label for="sdate" class="suma-popover" data-title="Choose Date Range" data-content="Select a start date for your analysis. Defaults to 6 months from current day. Clear fields to retrieve the complete data set.">Start Date</label>
                                    <input class="form-control" type="text" id="sdate" name="sdate" />
                                    <span class="help-block">YYYY-MM-DD</span>
                                </div>
                                <div class="form-group">
                                    <label for="edate" class="suma-popover" data-title="Choose Date Range" data-content="Select an end date for your analysis. Clear fields to retrieve complete data set.">End Date</label>
                                    <input class="form-control" type="text" id="edate" name="edate" />
                                    <span class="help-block">YYYY-MM-DD</span>
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <div class="form-group">
                                    <label for="stime" class="suma-popover" data-title="Select Subset of Day" data-content="Include only data gathered during a certain time of day in your analysis, e.g. 8pm-12am.">Start Time</label>
                                    <input class="form-control" type="text" id="stime" name="stime" placeholder="00:00" />
                                    <span class="help-block">24-hour format, e.g. 08:00</span>
                                </div>
                                <div class="form-group">
                                    <label for="etime" class="suma-popover" data-title="Select Subset of Day" data-content="Include only data gathered during a certain time of day in your analysis, e.g. 8pm-12am.">End Time</label>
                                    <input class="form-control" type="text" id="etime" name="etime" placeholder="24:00"/>
                                    <span class="help-block">24-hour format, e.g. 08:00</span>
                                </div>
                                <div>
                                    <input type="submit" id="submit" class="btn btn-success" data-default-text ="Submit" data-placement="bottom" data-loading-text="Loading..." value="Submit" />
                                </div>
                            </div>
                            <div class="col-xs-3"></div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="sessions-data" class="col-xs-12"></div>  
            </div>
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
            <div class="alert alert-danger alert-block">
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