Suma Developer Docs
=========================

Developing New Reports
-------------------

Reports Dependencies/Tool
--------------------------

* [AngularJS](http://angularjs.org)
* [Bower](http://bower.io)
* [Grunt](http://gruntjs.com)
* [Mocha](http://visionmedia.github.io/mocha)
* [SinonJS](http://sinonjs.org)
* [ChaiJS](http://chaijs.com)
* [PHP Unit](http://phpunit.de)

New Report Configuration Settings
-----------------------------
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

