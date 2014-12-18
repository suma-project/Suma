<?php

require_once 'vendor/autoload.php';

// Configuration
$config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

// get arguments to pass on to nightly.php
if (isset($argv) & sizeof($argv) > 1)
    {
        $args       = join(" ", array_slice($argv, 1));
        $outputHtml = (array_search("html", $argv) > 0 ? true : false);
    }
else
    {
        $args       = "";
        $outputHtml = false;
    }
// Default Timezone. See: http://us3.php.net/manual/en/timezones.php
$DEFAULT_TIMEZONE = $config['nightly']['timezone'];
date_default_timezone_set($DEFAULT_TIMEZONE);

// Display format for date
$DAY_DISPLAY = date($config['nightly']['displayFormat'], strtotime('yesterday'));

// Info for regular report recipients
$RECIPIENTS    = $config['nightly']['recipients'];
$GREETING      = "Below are the hourly Suma counts for " . $DAY_DISPLAY . ". " . "Please note that missing counts may have been performed but not yet uploaded to the Suma server.";
$SENDER        = (isset($config['nightly']['emailFrom']) ? $config['nightly']['emailFrom'] : null);
$defaultSubj   = "Suma Nightly Report: ";
$subjectLeadIn = (isset($config['nightly']['emailSubj']) ? $config['nightly']['emailSubj'] : $defaultSubj);
$SUBJECT       = $subjectLeadIn . $DAY_DISPLAY;

// Info for error report recipients
$ERROR_RECIPIENTS = $config['nightly']['errorRecipients'];
$ERROR_GREETING   = 'The nightly Suma report encountered an error.';
$ERROR_SUBJECT    = 'ERROR: Suma Nightly Report: ' . $DAY_DISPLAY;

// Run Script
$data = `php nightly.php $args`;

$errorCheck = explode(" ", $data);

if ($errorCheck[0] === "Error:")
    {
        $message = $ERROR_GREETING . "\n" . $data;
        mail($ERROR_RECIPIENTS, $ERROR_SUBJECT, $message);
    }
else
    {
        $emailHeaders = (isset($SENDER) ? 'From: ' . $SENDER . PHP_EOL : "");

        // additional headers if reporting by location, to support HTML in email
        if ($outputHtml)
            {
                $emailHeaders .= 'MIME-Version: 1.0' . PHP_EOL;
                $emailHeaders .= 'Content-type: text/html; charset=iso-8859-1' . PHP_EOL;
            }

        $message = $GREETING . "\n" . $data;
        mail($RECIPIENTS, $SUBJECT, $message, $emailHeaders);
    }
