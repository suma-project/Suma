Suma Logs
=========

Overview
---------

* The log directory path and log file name must be set in service/config/config.ini
    * The log file must also be created with write permissions for the web server user.


Log actions
-----------

* Info
    * JSON INPUT - Input string sent to server from client.
    * SESSION INSERT - New database session entry.
    * COUNT INSERT - New database count entry.
    * C_A_JOIN INSERT - New database count_activity_join entry.
    * SESSION COMMITTED - Session committed to database.
    * ACTIVITY ENABLED - Activity flagged as enabled.
    * ACTIVITY DISABLED - Activity flagged as disabled.
    * ACTIVITY CREATED - New database activity entry.
    * ACTIVITY GROUP CREATED - New database activity_group entry.
    * ACTIVITY GROUP UPDATED - Activity Group updated.
    * INITIATIVE ENABLED - Initiative flagged as enabled.
    * INITIATIVE DISABLED - Initiative flagged as disabled.
    * INITIATIVE UPDATED - Initiative updated.
    * INITIATIVE ROOT SET - Initiative assigned a location root.
    * INITIATIVE CREATED - New database initiative entry.
    * LOCATION CREATED - New database location entry.
    * LOCATION DISABLED - Location flagged as disabled.
    * LOCATION ENABLED - Location flagged as enabled.
* Error
    * MALFORMED JSON - Input string that does not follow the rules and conventions of JSON.
    * SKIPPING INVALID/MALFORMED SESSION - Session input is improperly formed.
    * NULL JSON ELEMENT(S) - Session missing critical component(s).
    * INVALID INITIATIVE ID - Id is invalid because it is not numeric
    * NONEXISTENT INITIATIVE - No initiative found with requested id.
    * NONEXISTENT ACTIVITY - No activity found with requested id.
    * NONEXISTENT LOCATION - No location found with requested id.
    * NONEXISTENT SESSION - No session found with requested id.
    * NONEXISTENT ACTIVITY GROUP - No activity group found with requested id.
* Warning
    * SKIPPING SESSION WITH INVALID INITIATIVE ID - Sessions references a nonexistent initiative.
    * SKIPPING DUPLICATE SESSION - An identical session already exists in the database and is considered to have already been submitted.
    * SESSION ROLLBACK - Internal database transaction rollback which spans a single session.
    * Assuming unix timestamp is in milliseconds - Self explanatory.
    * DUPLICATE ACTIVITY CREATION DENIED - Activity name conflict, must be unique.
    * DUPLICATE INITIATIVE CREATION DENIED - Initiative name conflict, must be unique.
    * FAILED ADMIN LOGIN - Invalid login credentials entered for admin page.
    * CANNOT SET INITIATIVE ROOT, LOCATION DOES NOT EXIST - Necessary location not found.
* Debug
    * TRANSACTION START - Start of server processing client input.
    * TRANSACTION END - End of server processing client input.