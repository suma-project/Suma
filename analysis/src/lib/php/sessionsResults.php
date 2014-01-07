<?php
header('Content-type: application/json');

require_once 'SessionsData.php';

// Initialize class and retrieve data
$data = new SessionsData();
$sessionData = $data->getData($_GET);

// Return JSON to requester
echo json_encode($sessionData);
