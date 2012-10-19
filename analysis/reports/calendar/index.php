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
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="brand" href="..">Suma Reports</a>
                    <div class="nav-collapse">
                        <ul class="nav">
                            <li><a href="..">Home</a></li>
                            <li><a href="about.html">About</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <form>
                <table>
                    <tr>
                        <td>Initiative</td><td><?php echo $initDropDown; ?></td>
                        <td><input type="submit" id="submit" value="Submit" /></td>
                    </tr>
                </table>

            </form>
            <div id="chart">
                <div id="loading"><img src="images/spinner.gif"></div>
            </div>
        </div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script src="../../lib/js/bootstrap.min.js"></script>
        <script src="../../lib/js/bootstrap-datepicker.js"></script>
        <script src="../../lib/js/d3.v2.min.js"></script>
        <script src="../../lib/js/underscore.js"></script>
        <script src="../../lib/js/moment.js"></script>
        <script src="js/calendar.js"></script>

    </body>
</html>