'use strict';

angular.module('dataMock', [])
  .value('mockParams1', {
  init: {id: 1},
  count: {id: 'count'},
  session_filter: '',
  daygroup: {id: 'all'},
  location: {id: 'all'},
  activity: {id: 'all'}
}).value('mockParams2', {
  init: {id: 1},
  count: '',
  session_filter: {id: 'false'},
  daygroup: {id: 'all'},
  location: {id: 'all'},
  activity: {type: 'activity', id: 4}
}).value('mockParams3', {
  init: {id: 1},
  count: {id: 'count'},
  session_filter: {id: 'true'},
  daygroup: false,
  location: false,
  activity: {type: 'activity', id: 4}
}).value('mockUrl1', 'lib/php/dataResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
.value('mockUrl2', 'lib/php/dataResults.php?activities=activity-4&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
.value('mockUrl3', 'lib/php/sessionsResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=session&session_filter=true&stime=')
.value('mockUrl4', 'lib/php/dataResults.php?activities=activity-4&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=true&stime=');
