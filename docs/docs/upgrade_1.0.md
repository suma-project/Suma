Suma 1.0 Upgrade Instructions
=============================

Overview
--------

This document outlines how to upgrade Suma to version 1.0. Upgrading is only necessary if you have previously installed a Suma version less than v1.0. The general Suma installation instructions have been updated to reflect v1.0 and should be referenced as needed.

The most significant structural change in v1.0 is where the various configuration settings are stored. We also moved to YAML for most of our configuration files in order to reduce the likelihood of introducing errors when updating Suma.

Notes on YAML
-------------

Here are some general notes on using the YAML config files:

* Quotes are not necessary for paths
* Do not insert comments inside of the YAML tree.

Backup
-------

You will need to reference the settings in your current installation. Backup these five files from your existing installation:

* service/config/config.ini
* service/web/index.php
* analysis/lib/php/ServerIO.php
* analysis/reports/nightly/nightly_config.php
* web/spaceassess.js

Upgrade
-------

Depending upon your installation method, either copy the updated Suma files into place or pull the changes from Github (preferred).

Configuration Options to Update
-------------------------------

The various configuration settings are listed below as `PREVIOUS_FILE` => `NEW_CONFIG_FILE`. Please refer to your current installation paths and the install docs to retrieve paths like `SUMA_SERVER_INSTALL_DIR`.

* service/config/config.ini => service/config/config.yaml

    Most of the old settings will need to be moved into `config.yaml`. **Please note the new format.**
    Refer to the instructions below for creating `config.yaml`. Alternatively, you can also copy the config.ini back to the service/config directory, but the config.ini format is deprecated in Suma and support for it may be removed in the future.

    From the installation docs:

    In the `SUMA_SERVER_INSTALL_DIR/config/` directory, copy `config_example.yaml` to a new file `config.yaml`. You must modify the following:

        production:
            sumaserver:
                db:
                    host:   host location of your mysql database
                    dbname: suma mysql database name
                    user:   suma mysql **application** account name
                    pword:  suma mysql **application** account password
                    port:   mysql port number
                log:
                    path: path to log directory
                    name: sumaserver.log

* service/web/index.php => service/web/config.yaml

    Copy the `SUMA_SERVER_PATH`, `SUMA_CONTROLLER_PATH`, `SUMA_BASE_URL`, and `SUMA_DEBUG` configuration settings into the appropriate fields of service/web/config.yaml. Refer to the instructions below for creating `config.yaml`.

    From the installation docs:

    In the `/SUMA_SERVER_INSTALL_DIR/web/config/` directory, copy `config_example.yaml` to a new file `config.yaml`. You must set some path variables in the `config.yaml` file for the Suma server to function correctly.

    `SUMA_SERVER_PATH` must be set to the `SUMA_SERVER_INSTALL_DIR` where the Suma server was installed earlier in these instructions (e.g. `/var/www/app/sumaserver`).

    `SUMA_CONTROLLER_PATH` must be set to `SUMA_SERVER_INSTALL_DIR/controllers` (e.g. `/var/www/app/sumaserver/controllers`).

    `SUMA_BASE_URL` must be set to the URL path for the Suma server. For example, if the URL is `http://YOUR_HOST/sumaserver`, set this to `/sumaserver`.

    `SUMA_DEBUG` can be set to `true` if you would like to see more verbose error messages. This should generally be set to `false`.

* analysis/lib/php/ServerIO.php => analysis/config/config.yaml

    Copy the `private $_baseUrl` configuration settings into the the `baseUrl` field of `analysis/config/config.yaml`. Refer to the instructions below for creating `config.yaml`.

    From the installation docs:

    In the `YOUR_WEB_DIR/suma/analysis/config/` directory, copy `config_example.yaml` to a new file `config.yaml`. Change `baseUrl` to the URL for your Suma Query Server. If you used a directory other than `sumaserver` in the "Suma Software Installation" section above, that should be reflected in this URL.

* analysis/reports/nightly/nightly_config.php => analysis/config/config.yaml

    In the same `config.yaml` file created in the previous step, copy your settings from `nightly_config.php` as such:

    * Copy `DEFAULT_TIMEZONE` to `timezone`
    * Copy `DAY_DISPLAY` to `displayFormat`
    * Copy `ERROR_RECIPIENTS` to `errorRecipients`
    * Copy `RECIPIENTS` to `recipients`

    From the installation docs:

    * To configure the nightly summary report:

        In the `YOUR_WEB_DIR/suma/analysis/config/config.yaml` file, edit the timezone, displayFormat, recipients, and errorRecipients as needed. See http://php.net/manual/en/timezones.php for information on timezone formats.

        Using cron, or some other scheduler, schedule a task to run the `YOUR_WEB_DIR/suma/analysis/reports/nightly/nightlyEmail.php` script as desired.

        Alternatively, `YOUR_WEB_DIR/suma/analysis/reports/nightly/nightly.php` may be run from the command line for quick reporting through stdout.

* web/spaceassess.js => web/config/spaceassessConfig.js

    Copy the paths `baseInitUrl`, `initiativeUrl`, and `syncUrl` from spaceassess.js to the appropriate paths in `web/config/spaceassessConfig.js`. Refer to the instructions below for creating `spaceassessConfig.js`.

    From the installation docs:

    In the `YOUR_WEB_DIR/suma/web/config/` directory, copy `spaceassessConfig_example.js` to a new file `spaceassessConfig.js`. If the Suma server URL is anything other than `http://YOUR_HOST/sumaserver`, you will need to change the paths at the top of `YOUR_WEB_DIR/suma/web/config/spaceassessConfig.js`.

