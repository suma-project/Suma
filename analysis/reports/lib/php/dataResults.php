<?php
header('Content-type: application/json');

require_once 'Data.php';

// Instantiate Data class
$data = new Data();
$chartData = $data->getData($_GET);

echo json_encode($chartData);
