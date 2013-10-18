<?php
header('Content-type: application/json');

require_once '../../lib/php/TimeSeriesData.php';

// Instantiate TimeSeriesData class
$data = new TimeSeriesData();
$chartData = $data->getData($_GET);

echo json_encode($chartData);