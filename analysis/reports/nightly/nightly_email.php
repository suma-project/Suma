<?php

require_once 'nightly_config.php';

$data = `php nightly.php`;
$message = $GREETING . "\n" . $data;

mail($RECIPIENTS, $SUBJECT, $message);