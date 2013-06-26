<?php

require_once '../../lib/php/ChromePhp.php';
require_once '../../lib/php/Sessions.php';

// Initialize class and retrieve data
$data = new Sessions();
$sessionData = $data->getData($_GET);

// Return JSON to requester
echo json_encode($sessionData);