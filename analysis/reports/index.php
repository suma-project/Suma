<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Suma Reports</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link href="../lib/css/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }

      .head-icon {
        margin-top: 20px;
        margin-right: 10px;
        float: right;
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
                <a class="brand" href="#"><img src="../lib/img/logo.png"></a>
                <div class="nav-collapse">
                    <ul class="nav">
                        <li class="active"><a href="#">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="span6">
                <div class="row">
                    <div class="span5"><h3><a href="time-series">Time Series</a></h3></div>
                    <div class="span1"><img class="head-icon" src="../lib/img/stats.png" /></div>
                </div>
                <p>Explore your data with an interactive set of tools, including a graph of usage over time, a chart comparing activities and location usage, and tabular summaries of important data points. Export raw data or summary statistics to spreadsheets and export images for use in presentations or documents. This tool allows the user to make detailed choices about what data to analyze by choosing a date range and allowing the user to limit data to a certain part of the day, view weekday versus weekend trends, and select the exact locations or activities that they are interested in viewing. The Time Series is Suma's main data exploration tool.</p>
            </div>
            <div class="span6">
               <div class="row">
                    <div class="span5"><h3><a href="calendar">Calendar Heat Map</a></h3></div>
                    <div class="span1"><img class="head-icon" src="../lib/img/pie_chart.png" /></div>
                </div>
                <p>This chart shows a heat map of usage data over time. Instead of surface area representing physical space as it typically does in a heat map, this visualization maps the days of the month and months of the year in a set of small multiples to help you quickly pull out patterns of high and low usage over the course of the year or semester. Choose a date range, limit data to a certain part of the day, view weekday versus weekend trends, and select the exact locations or activities that they are interested in viewing.</p>
            </div>
        </div>
        <div class="row">
            <div class="span6">
                <div class="row">
                    <div class="span5"><h3><a href="sessions">Sessions Summary</a></h3></div>
                    <div class="span1"><img class="head-icon" src="../lib/img/notes.png" /></div>
                </div>
                <p>A report for quickly examining sessions, the Sessions Summary displays a table of sessions based on initiative, date and time filters.</p>
            </div>
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="../lib/js/bootstrap.min.js"></script>

  </body>
</html>