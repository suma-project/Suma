var Session, Initiative, Activity, ActivityGroup, Person, Location;


function initSADB(callback) {
    try
    {
    persistence.store.websql.config(persistence, 'ncsuSpaceAssess', 'NCSU Libraries Space Assessment Tool', 50 * 1024 * 1024);
    }
    catch(err)
    {
    alert("DB Error");
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

    Initiative.hasMany('sessions', Session, 'initiative');
    Initiative.hasMany('activities', Activity, 'initiative');
    Initiative.hasMany('activityGroups', ActivityGroup, 'initiative');

    Person.hasMany('activities', Activity, 'people');

    ActivityGroup.hasMany('activities', Activity, 'activityGroup');

    Activity.hasMany('people', Person, 'activities');

    Session.hasMany('people', Person, 'session');

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
