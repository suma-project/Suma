'use strict';

angular.module('dataMock', [])
  .value('mockParams1', {
  init: {id: 1},
  classifyCounts: {id: 'count'},
  wholeSession: '',
  days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
  location: {id: 'all'},
  activity: {id: 'all'}
}).value('mockParams2', {
  init: {id: 1},
  classifyCounts: '',
  wholeSession: {id: 'no'},
  days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
  location: {id: 'all'},
  activity: {type: 'activity', id: 4}
}).value('mockParams3', {
  init: {id: 1},
  classifyCounts: {id: 'count'},
  wholeSession: {id: 'yes'},
  days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
  location: false,
  activity: {type: 'activity', id: 4}
}).value('mockParams4', {
  init: {id: 1}
}).value('mockUrl1', 'lib/php/dataResults.php?activities=all&classifyCounts=count&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&locations=all&sdate=&stime=&wholeSession=no')
.value('mockUrl2', 'lib/php/dataResults.php?activities=activity-4&classifyCounts=count&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&locations=all&sdate=&stime=&wholeSession=no')
.value('mockUrl3', 'lib/php/sessionsResults.php?activities=all&classifyCounts=session&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&locations=all&sdate=&stime=&wholeSession=yes')
.value('mockUrl4', 'lib/php/dataResults.php?activities=activity-4&classifyCounts=count&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&locations=all&sdate=&stime=&wholeSession=yes')
.value('mockUrl5', 'lib/php/sessionsResults.php?edate=&etime=&id=1&sdate=&stime=');
