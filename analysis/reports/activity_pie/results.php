<?php 

require_once '../../lib/Server_IO.php';

$params = array('id'     =>   $_GET['id'],
                'sdate'  =>   $_GET['sdate'],
                'edate'  =>   $_GET['edate'],
                'stime'  =>   $_GET['stime'],
                'etime'  =>   $_GET['etime'],
                'format' =>  'ac',
                'sum'    =>  'true');

try 
{
    $response = Server_IO::getData($params, 'counts');
}
catch (Exception $e)
{
    header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo '<p>An error occurred on the server which prevented your request from being completed: <strong>'.$e->getMessage().'</strong></p>';
    die;
}

$init = $response['initiatives'];
$actDictionary = $init['dictionary']['activities'];
$activities = $init['activities'];

if ($activities)
{
    foreach($activities as $act)
    {  
        foreach($actDictionary as $lookup)
        {
            if ($act['id'] == '_No Activity')
            {
                $title = 'No Activity';
                break;
            }
            else if ($lookup['id'] == $act['id'])
            {
                $title = $lookup['title'];
            }
            
        }
        
        $plots .= '[\''.$title.'\', '.$act['counts'].'],';
    }
    
    $plots = substr($plots, 0, -1);
}

?>

<html>
  <head>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Activity');
        data.addColumn('number', 'Patrons');
        data.addRows([
          <?php echo $plots; ?>
        ]);

        var options = {
          width: 500, height: 500,
          title: '<?php echo $init['title']; ?>'
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    </script>
  </head>
  <body>
    <div id="chart_div"></div>
  </body>
</html>