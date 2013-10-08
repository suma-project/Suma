var Session, Initiative, Activity, ActivityGroup, Person, Location;

// http://stackoverflow.com/a/14223920
function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }

    return [-1, -1, -1];
}


function initSADB(callback) {
    try
    {
        // This is necessary to deal a bug in Safari on iOS 7 (tested on iOS 7.0.2)
        // where a database must be created before it is expanded beyond 5MB.
        if (iOSversion()[0] >= 7) {
            persistence.store.websql.config(persistence, 'ncsuSpaceAssess', 'NCSU Libraries Space Assessment Tool', 5 * 1024 * 1024);
        }
        persistence.store.websql.config(persistence, 'ncsuSpaceAssess', 'NCSU Libraries Space Assessment Tool', 50 * 1024 * 1024);
    }
    catch(err)
    {
        alert("Error in browser (Web SQL) database setup. Are you using a WebKit browser (e.g. Chrome, Safari, Android Browser)?" +
              " This Suma client unfortunately does not support Firefox or IE at this point. If you still are getting this message," +
              " try clearing your browser data");
    }

    Session = persistence.define('Session', {
        startTime: "DATE",
        stopTime: "DATE"
    });

    Session.index('startTime');
    Session.index('stopTime');

    Initiative = persistence.define('Initiative', {
        serverId: "INT",
        name: "TEXT",
        description: "TEXT"
    });

    Activity = persistence.define('Activity', {
        serverId: "INT",
        name: "TEXT",
        description: "TEXT",
        rank: "INT"
    });

    ActivityGroup = persistence.define('ActivityGroup', {
        serverId: "INT",
        title: "TEXT",
        required: "BOOL",
        rank: "INT",
        allowMulti: "BOOL"
    });

    Person = persistence.define('Person', {
        timestamp: "DATE",
        count: "INT"
    });

    Person.index('timestamp');

    Location = persistence.define('Location', {
        serverId: "INT",
        name: "TEXT",
        description: "TEXT"
    });

    Note = persistence.define('Note', {
        timestamp: "DATE",
        title: "TEXT",
        body: "TEXT"
    });

    Initiative.hasMany('sessions', Session, 'initiative');
    Initiative.hasMany('activities', Activity, 'initiative');
    Initiative.hasMany('activityGroups', ActivityGroup, 'initiative');

    Person.hasMany('activities', Activity, 'people');

    ActivityGroup.hasMany('activities', Activity, 'activityGroup');

    Activity.hasMany('people', Person, 'activities');

    Session.hasMany('people', Person, 'session');
    Session.hasMany('notes', Note, 'session');

    // This points to just the top-level location for an initiative
    Location.hasMany('initiatives', Initiative, 'location');
    Location.hasMany('people', Person, 'location');
    Location.hasMany('children', Location, 'parent');

    // TODO: This is inefficient. Basically, reset the DB if we have no sessions
    // It also leds to slow metadata updates. Sometimes
    // you need to refresh multiple times to get new
    // locations, activities, or initiatives.
    // Allows schema updates and does periodic cleanup.
    // There is probably a better way to do this.
    persistence.schemaSync(function(tx) {
        Session.all().count(tx, function(count) {
            if (count === 0) {
                persistence.reset(tx,function() {
                    persistence.schemaSync(tx, function() {
                        callback();
                    });
                });
            } else {
                callback();
            }
        });
    });
}
