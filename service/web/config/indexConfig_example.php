<?php

/*
    Copy this file to a new file named `indexConfig.php`. You must set the
    path variables below in the new file for the Suma server to function correctly.

    `$SUMA_SERVER_PATH` must be set to the `SUMA_SERVER_INSTALL_DIR` where
    the Suma server was installed earlier in these
    instructions (e.g. `/var/www/app/sumaserver`).

    `$SUMA_CONTROLLER_PATH` must be set to `SUMA_SERVER_INSTALL_DIR/controllers`
    (e.g. `/var/www/app/sumaserver/controllers`).

    `$SUMA_BASE_URL` must be set to the URL path for the Suma server.
    For example, if the URL is `http://YOUR_HOST/sumaserver`, set this to `/sumaserver`.

    `$SUMA_DEBUG` can be set to `true` if you would like to see more verbose error messages.
    This should generally be set to `false`.

*/

// Path Configuration
$SUMA_SERVER_PATH = 'SUMA_SERVER_PATH';
$SUMA_CONTROLLER_PATH = 'SUMA_CONTROLLER_PATH';
$SUMA_BASE_URL = '/sumaserver';

// Debug mode
$SUMA_DEBUG = false;
