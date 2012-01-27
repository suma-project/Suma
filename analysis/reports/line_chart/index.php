<?php 

require_once '../../lib/Server_IO.php';

try {
    $initiatives = Server_IO::getInitiatives();
}
catch (Exception $e)
{
    header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo '<p>Unable to fetch Initiatives from Query Server.</p>';
    die(1);
}

$initDropDown = '<select name="id">';
foreach($initiatives as $init)
{
    $initDropDown .= '<option value="'.$init['id'].'">'.$init['title'].'</option>';
}
$initDropDown .= '</select>';

?>

<html>
<head>
    <link rel="stylesheet" type="text/css" href="../../includes/datepicker/smoothness.datepick.css" />
    
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="../../includes/datepicker/jquery.datepick.pack.js"></script>
    
    <script type="text/javascript">
      $(document).ready(function() {
          $('#sdate').datepick({dateFormat: 'yymmdd'});
          $('#edate').datepick({dateFormat: 'yymmdd'});
      });
    </script>
</head>
<body>
    <form method="get" action="results.php">
        <table>
            <tr><td>Initiative</td><td><?php echo $initDropDown; ?></td></tr>
            <tr><td>Start Date</td><td><input type="text" id="sdate" name="sdate" />(YYYYMMDD)</td></tr>
            <tr><td>End Date</td><td><input type="text" id="edate" name="edate" />(YYYYMMDD)</td></tr>
            <tr><td>Start Time</td><td><input type="text" name="stime" />(HHMM)</td></tr>
            <tr><td>End Time</td><td><input type="text" name="etime" />(HHMM)</td></tr>
        </table>
        <input type="submit" value="Submit" />
    </form>
</body>
</html>