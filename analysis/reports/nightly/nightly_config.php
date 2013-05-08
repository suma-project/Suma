<?php

// Default Timezone. See: http://us3.php.net/manual/en/timezones.php
$DEFAULT_TIMEZONE = "America/New_York";
date_default_timezone_set($DEFAULT_TIMEZONE);

$DAY_DISPLAY = date("m-d-Y", strtotime("yesterday"));
$DAY_PROCESS = date("Ymd", strtotime("yesterday"));
$RECIPIENTS  = "bddavids@ncsu.edu";
$GREETING    = "Below are the hourly Suma counts for " . $DAY_DISPLAY . ".";
$SUBJECT     = "Suma Nightly Report: " . $DAY_DISPLAY;