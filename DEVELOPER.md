Suma Developer Docs
=========================

Developing New Reports
----------------------
New suma reports may be developed within the AngularJS framework or as standalone reports. Reports developed within AngularJS should follow the model of the included reports and use a PHP file to retrieve data from the Suma query server as well as AngularJS based controllers, services, directives, views, etc. These reports will also need to be integrated into the various build processes that are facilitated by the tools and libraries listed below. However, if you are unfamiliar with these tools, particularly AngularJS, and you need to generate custom reports, it is possible to do so using whatever visualization and data processing tools you prefer. You will likely still want to use the `ServerIO.php` class discussed in the API and Data Retrieval documentation below.

Apache Configuration Note
-------------------------
If you plan on developing reports for inclusion in the Suma repository and will be making use of the Grunt build tools, you will need to add a virtual host in order to link to the .tmp directory that contains compiled style assets. For example, if you are using MAMP Pro as your development server, create a virtualhost alias for localhost as something like 'Alias /suma/analysis/src/styles "/Applications/MAMP/htdocs/suma/analysis/.tmp/styles/"'. **Please Note:** the paths in the alias will depend on your development environment. See http://darrenhall.info/development/yeoman-and-mamp for more information.

Reports Dependencies/Tools
--------------------------
* [AngularJS](http://angularjs.org)
* [Bower](http://bower.io)
* [Grunt](http://gruntjs.com)
* [Mocha](http://visionmedia.github.io/mocha)
* [SinonJS](http://sinonjs.org)
* [ChaiJS](http://chaijs.com)
* [PHP Unit](http://phpunit.de)

New Report Configuration Settings
---------------------------------
Any new report that has external configuration settings should utilize the `config.yaml` file at `analysis/config/config.yaml`. Be sure to add your config settings to `config_example.yaml` as well. Each report should be namespaced as follows:

    nightly:
        timezone: America/New_York
        displayFormat: m-d-Y
        recipients: bddavids@ncsu.edu
        errorRecipients: bddavids@ncsu.edu

See the nightly report or view the docs on the [spyc library](https://github.com/tekimaki/spyc) for importing YAML configs into PHP.

API and Data Retrieval
------------
* Most reports will utilize the `ServerIO.php` class to extract data from the Suma queryserver. In order to utilize this class, include the `ServerIO.php` file in your data processing code. Reports that will be added to the Suma repository should place their data processing code in the `analysis/src/lib/php` directory, which can then be accessed from within a new AngularJS service via HTTP. Custom reports that will be used outside of the Suma repository can still use the `ServerIO.php` class to extract data from Suma.

* The following methods are provided by Server_IO:
  * `Server_IO::getData($params, $queryType)`
    * $params is an associative array of Suma Query Server parameters
    * $queryType specifies the type of query to perform, either 'sessions' or 'counts'
    * Returns a PHP array representation of the data returned from the Query Server (see QUERYSERVER.md)
  * `Server_IO::getInitiatives()`
    * Returns array representation of all initiatives that can be queried
      * Keys include: 'id', 'title', 'description'

