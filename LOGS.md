Suma Logs
=========

Overview
---------

* The log directory path and log file name must be set in service/config/config.ini
    * The log file must also be created write permissions for the web server user.
* At present only client updates to the server are being logged.

Log actions
-----------

* Info
    * JSON INPUT - Input string sent to server from client.
    * SESSION INSERT - New database session entry.
    * COUNT INSERT - New database count entry.
    * C_A_JOIN INSERT - New database count_activity_join entry.
    * SESSION COMMITTED - Session committed to database.
* Error
    * MALFORMED JSON - Input string that does not follow the rules and conventions of JSON.
    * SKIPPING INVALID/MALFORMED SESSION - Session input is improperly formed.
    * NULL JSON ELEMENT(S) - Session missing critical component(s).
* Warning
    * SKIPPING SESSION WITH INVALID INITIATIVE ID - Sessions references a nonexistent initiative.
    * SKIPPING DUPLICATE SESSION - An identical session already exists in the database and is considered to have already been submitted.
    * SESSION ROLLBACK - Internal database transaction rollback which spans a single session.
    * Assuming unix timestamp is in milliseconds - Self explanatory.
* Debug
    * TRANSACTION START - Start of server processing client input.
    * TRANSACTION END - End of server processing client input.
