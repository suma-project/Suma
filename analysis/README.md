Suma Data Analysis Module
=========================

The reports included here are early examples to help one get started with report development. More advanced reports are under development.

Configuration options
---------------------

* Update the `$_serverUrl` property to the base address of your Suma query server


Report requirements
-------------------

* A unique directory under analysis/reports/
* An index.php file in that directory for collecting user inputs
* Add an entry to analysis/index.php for your report (this will be more automated in the future)


API options
------------

* To use the analysis helper library, just add this to the start of your report code:

    `require_once('../../lib/Server_IO.php')`

* The following methods are provided by Server_IO:
  * `Server_IO::getData($params, $queryType)`
    * $params is an associative array of Suma Query Server parameters
    * $queryType specifies the type of query to perform, either 'sessions' or 'counts'
    * Returns a PHP array representation of the data returned from the Query Server (see QUERYSERVER.md)
  * `Server_IO::getInitiatives()`
    * Returns array representation of all initiatives that can be queried
      * Keys include: 'id', 'title', 'description'

Report Configuration Settings
-----------------------------

Any new report that has external configuration settings should utilize the `config.yaml` file at `analysis/config/config.yaml`. Each report should be namespaced as follows:

    nightly:
        timezone: America/New_York
        displayFormat: m-d-Y
        recipients: bddavids@ncsu.edu
        errorRecipients: bddavids@ncsu.edu

See the nightly report or view the docs on the [spyc library](https://github.com/tekimaki/spyc) for importing YAML configs into PHP.