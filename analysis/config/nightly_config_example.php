<?php

// Default Timezone. See: http://us3.php.net/manual/en/timezones.php
$DEFAULT_TIMEZONE = "America/New_York";
date_default_timezone_set($DEFAULT_TIMEZONE);

// Which day to retrieve hourly report, use same day for both
$DAY_DISPLAY = date("m-d-Y", strtotime("yesterday"));
$DAY_PROCESS = date("Ymd", strtotime("yesterday"));

// Info for regular report recipients
$RECIPIENTS  = "EMAIL ADDRESSES SEPARATED BY COMMA";
$GREETING    = "Below are the hourly Suma counts for " . $DAY_DISPLAY . ".";
$SUBJECT     = "Suma Nightly Report: " . $DAY_DISPLAY;

// Info for error report recipients
$ERROR_RECIPIENTS = 'EMAIL ADDRESSES SEPARATED BY COMMA';
$ERROR_GREETING = 'The nightly Suma report encountered an error.';
$ERROR_SUBJECT = 'ERROR: Suma Night Report: ' . $DAY_DISPLAY;
