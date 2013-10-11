Suma Install Instructions
==========================

Requirements
-------------

These requirements as based on our local testing. Earlier versions may also work:

* MySQL recommended version 5.1
* Apache recommended version 2.2
* PHP recommended version 5.3.3 (although 5.2.3 may also work)
* Zend Framework 1.12 - required for Suma server, included with Suma code
* Various Javascript Libraries - all included with Suma code

Additional Client Requirements:

* Device or computer with WebKit browser (e.g. iOS and Android browsers, Google Chrome, Safari on Mac OS) needed to use Suma client. **NOTE: Suma does not work in Safari for Windows.**


Zend Framework Installation (optional)
-----------------------------

**Zend Framework is now bundled with Suma and requires no additional action.** If you would prefer to use your own version of Zend, follow the instructions below.

Download link: http://framework.zend.com/downloads/latest#ZF1

Installation instructions url: http://framework.zend.com/manual/1.12/en/introduction.installation.html

Or do the following:

1. Expand download in chosen server location
2. Note path to framework library directory location
3. Modify your php.ini's include_path to add path to Zend framework library directory


Suma Software Installation (file copying)
------------------------------------------

Download code: Either clone the repository or download a zip of the
code. GitHub provides instructions on the repository page.

https://github.com/cazzerson/suma

Note path to suma download directory.  We will refer to this as SUMA_DOWNLOAD_DIR

For Suma Client Installation:

* Copy contents of `/SUMA_DOWNLOAD_DIR/web` to `/YOUR_WEB_DIR/suma/web`

* Copy contents of `/SUMA_DOWNLOAD_DIR/analysis` to `/YOUR_WEB_DIR/suma/analysis`


For Suma Server Installation:

* Copy contents of `/SUMA_DOWNLOAD_DIR/service` to a location outside your web directory. For example, if your web directory is `/var/www/htdocs` you could copy the contents of the `/SUMA_DOWNLOAD_DIR/service` to `/var/www/app/sumaserver`.

    Note this location, we will refer to it later as `SUMA_SERVER_INSTALL_DIR`

* Copy contents of `/SUMA_DOWNLOAD_DIR/service/web` to `/YOUR_WEB_DIR/sumaserver`


Suma Software Installation (symbolic links, **RECOMMENDED**)
----------------------------------------

If your Apache configuration has the `FollowSymLinks` directive enabled, there is a simpler way to deploy Suma that also improves the update process.

* Clone the GitHub repository to a directory outside of your web space (e.g. `/var/www/app/suma`)
* Create the following symbolic links from your web space to the local suma repository (these instructions make several assumptions about paths and directory names--please change as needed, noting the configuration directions later in this document):


        /var/www/htdocs/sumaserver/      =>  /var/www/app/suma/service/web/
        /var/www/htdocs/suma/client/        =>  /var/www/app/suma/web/
        /var/www/htdocs/suma/analysis/   =>  /var/www/app/suma/analysis/


Now all of your code is in one place, allowing you to update Suma by running `git pull --rebase origin master`. There is a chance this could result in merge conflicts with your local changes, so please allow for time to resolve these before updating.


Apache Configuration
---------------------

You can configure your apache web server two ways using apache's configuration rewrite engine or using a .htaccess file

Apache rewrite
If using Apache's rewrite module add these lines in your web server (likely httpd.conf) configuration file

    <Directory "/YOUR_WEB_DIR/sumaserver">
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} -s [OR]
    RewriteCond %{REQUEST_FILENAME} -l [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^.*$ - [NC,L]
    RewriteRule ^.*$ index.php [NC,L]
    </Directory>

**Don't forget to change `YOUR_WEB_DIR` to the directory in your web space that contains the `service/web/` content**
Restart apache after adding these lines for configuration to apply.

.htaccess
If using a .htaccess place the file in the `/YOUR_WEB_DIR/sumaserver` directory and add these lines

    RewriteEngine on
    RewriteCond %{REQUEST_FILENAME} -s [OR]
    RewriteCond %{REQUEST_FILENAME} -l [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^.*$ - [NC,L]
    RewriteRule ^.*$ index.php [NC,L]

An example .htaccess file named can be found at `/YOUR_WEB_DIR/sumaserver/htaccess_example`. To use, copy the contents of this file to a new file named `/YOUR_WEB_DIR/sumaserver/.htaccess`.

Database Setup
---------------

It is recommended you create two databases for Suma. One for production and one for testing. The database instructions are the same for both except for changing the database name.

Create database in MySQL using whatever tool you have available.

Create two Suma accounts:

1. One administrative account with `SELECT`, `INSERT`, `CREATE`, `DROP`, `DELETE`, `UPDATE`, `INDEX`, and `ALTER` permissions. **This account is for initializing and modifying the database. Do not include this account in your Suma configuration.**
2. One application account with `SELECT`, `INSERT`, `UPDATE`, and `INDEX` permissions.

Now you have to run a database initialization script included in the suma download.

1. Find the file schema.sql in `/SUMA_DOWNLOAD_LOCATION/service/config`.
2. Run that script to initialize database, create suma tables, and establish foreign key constraints.

    To run it you can use the command line MySQL tools, phpmyadmin, or any other database management tool you like. **This should be imported using the Suma administration MySQL account.**

> *Optional, but recommended:* If you wish to initialize the database with preloaded sample data so you can play around with Suma more quickly, then run the `schema_w_sample.sql` script instead of `schema.sql`.


Suma Server Software Configuration
-----------------------------------

* web/config.yaml

    In the `/SUMA_SERVER_INSTALL_DIR/web/config/` directory, copy `config_example.yaml` to a new file `config.yaml`. You must set some path variables in the `config.yaml` file for the Suma server to function correctly.

    `SUMA_SERVER_PATH` must be set to the `SUMA_SERVER_INSTALL_DIR` where the Suma server was installed earlier in these instructions (e.g. `/var/www/app/sumaserver`).

    `SUMA_CONTROLLER_PATH` must be set to `SUMA_SERVER_INSTALL_DIR/controllers` (e.g. `/var/www/app/sumaserver/controllers`).

    `SUMA_BASE_URL` must be set to the URL path for the Suma server. For example, if the URL is `http://YOUR_HOST/sumaserver`, set this to `/sumaserver`.

    `SUMA_DEBUG` can be set to `true` if you would like to see more verbose error messages. This should generally be set to `false`.

* config.yaml

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

    * Be sure that the log directory specified in `sumaserver:log:path` both exists and is **writable by the web server**.


Suma Client Configuration
--------------------------

* spaceassessConfig.js

    In the `YOUR_WEB_DIR/suma/web/config/` directory, copy `spaceassessConfig_example.js` to a new file `spaceassessConfig.js`. If the Suma server URL is anything other than `http://YOUR_HOST/sumaserver`, you will need to change the paths at the top of `YOUR_WEB_DIR/suma/web/config/spaceassessConfig.js`.


Suma Analysis Tools Configuration
----------------------------------

* analysis/config/config.yaml

    In the `YOUR_WEB_DIR/suma/analysis/config/` directory, copy `config_example.yaml` to a new file `config.yaml`. Change `baseUrl` to the URL for your Suma Query Server. If you used a directory other than `sumaserver` in the "Suma Software Installation" section above, that should be reflected in this URL.

* You can view the Suma analysis tools by visting `http://YOUR_SERVER/suma/analysis/reports`.

* To configure the nightly summary report:

    In the `YOUR_WEB_DIR/suma/analysis/config/config.yaml` file, edit the timezone, displayFormat, recipients, and errorRecipients as needed. See http://php.net/manual/en/timezones.php for information on timezone formats.

    Using cron, or some other scheduler, schedule a task to run the `YOUR_WEB_DIR/suma/analysis/reports/nightly/nightlyEmail.php` script as desired.

    Alternatively, `YOUR_WEB_DIR/suma/analysis/reports/nightly/nightly.php` may be run from the command line for quick reporting through stdout.

Other Things You Can Configure
-------------------------------

* The config.ini protocol allows for development/testing settings that can override the production settings.  To switch from using production settings to dev/testing settings, on the line in `/SUMA_SERVER_INSTALL_DIR/config/Globals.php`

        self::$_config = new Zend_Config_Ini($file, 'production');

you must change 'production' to 'development'.

* If you're getting generic error messages from the suma server you can change the `SUMA_DEBUG` setting in  `/YOUR_WEB_DIR/sumaserver/config/config.yaml` to `true` to generate more descriptive error messages.

    **Be sure to change this setting back before you use Suma in production**


How to create your first initiative
------------------------------------

1. Log in to the administrative console (see below)
2. Create and populate a location tree by clicking on the "Edit locations" link
3. Create and populate an initiative by clicking on the "Edit initiatives" link (don't forget also to enable the initiative using this tool)
4. Collect some data using the Suma client (`http://YOUR_SERVER/suma/web`) with a WebKit-based browser (e.g. Chrome, Safari, or iOS and Android browsers)
5. View your session log in the "Sessions list" page linked from the administrative console
6. Analyze your data using the analysis tools (`http://YOUR_SERVER/suma/analysis/reports`)


Overview of administrative tools
---------------------------------

To view the admin tools, visit the page at `http://YOUR_SERVER/sumaserver/admin/`. The username and password for these tools is set in config.ini.

* Location editor

    The location editor allows you to create location trees, create and arrange the location hierarchy and update titles and descriptions.

* Initiative editor

    The initiative editor allows you to create initiatives and activities, change titles and descriptions, and modify the order in which activities are displayed.

* Sessions list

    The sessions list is a human-readable session log.

* Direct JSON import

    This direct JSON import tool will allow you to paste JSON data into a web form and import it into Suma. Useful for recovery from log data.
