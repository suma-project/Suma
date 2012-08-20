<?php 

require_once '../../lib/Server_IO.php';
include '../../lib/ChromePhp.php';
$hash = array();

function populateHash($response, $params)
{
    global $hash;
    $init = $response['initiative'];
    $sessions = $init['sessions'];

    if ($sessions)
    {
        foreach($sessions as $sess)
        {  
            $locations = $sess['locations'];
            $total = 0;
            foreach($locations as $loc)
            {
                $total += $loc['counts'];
            }
            
            $day = substr($sess['start'], 0, -9);

            if (isset($hash[$day])) {
                    $hash[$day] = $hash[$day] + $total;
            } else {
                    $hash[$day] = $total;
            }
            
        }
    }
}

function echo500($e)
{
    header("HTTP/1.1 500 Internal Server Error");
    echo "<h1>500 Internal Server Error</h1>";
    echo '<p>An error occurred on the server which prevented your request from being completed: <strong>'.$e->getMessage().'</strong></p>';
    die;
}

// --- END FUNCTIONS ---


$params = array('id'     =>   $_GET['id'],
                'format' =>  'lc',
                'sum'    =>  'true',
                'limit'  =>  160000);


try 
{
    $io = new Server_IO();
    populateHash($io->getData($params, 'sessions'), $params);
}
catch (Exception $e)
{
    echo500($e);
}

while($io->hasMore())
{
    try
    {
        populateHash($io->next(), $params);
    }
    catch (Exception $e)
    {
        echo500($e);
    }
}

//print_r($hash);
echo json_encode($hash);
