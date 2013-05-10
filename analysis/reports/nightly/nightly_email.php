<?php

require_once 'nightly_config.php';

$data = `php nightly.php`;
$errorCheck = explode(" ", $data);

if ($errorCheck[0] === "Error:")
{
    $message = $ERROR_GREETING . "\n" . $data;
    mail($ERROR_RECIPIENTS, $ERROR_SUBJECT, $message);
}
else
{
    $message = $GREETING . "\n" . $data;
    mail($RECIPIENTS, $SUBJECT, $message);
}
