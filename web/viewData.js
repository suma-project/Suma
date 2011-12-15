function displaySessions(){
    $("tr.dataRow").remove();
    var allSessions = Session.all().order('startTime', true);
    allSessions.prefetch('initiative').each(function(session) {

        var sessionCount = 0;
        var locName = 'unknown';
        var locCounts = {};
        var sessionPeople = session.people.prefetch('location');
        sessionPeople.count(function(testcount) {

            var n = 0;
            sessionPeople.each(function(person) {
                n++;
                if (null != person.location) {
                    if (person.location.name in locCounts) {
                        locCounts[person.location.name]++;
                    } else {
                        locCounts[person.location.name] = 1;
                    }
                }
                if (n == testcount) {
                    $.each(locCounts, function(countedLocName, count) {
                        $("table#collectedDataTable").append('<tr class="dataRow"><td>' + session.startTime + '</td><td>' + session.initiative.name + '</td><td>' + countedLocName + '</td><td>' + count + '</td></tr>');
                    });
                }
            });
        });

    });
}

$(function(){
    initSADB();
    displaySessions();
});
