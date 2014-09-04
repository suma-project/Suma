'use strict';

angular.module('dataMock', [])
  .value('mockParams1', {
  init: {id: 1},
  classifyCounts: '',
  wholeSession: '',
  days: '',
  zeroCounts: 'no'
}).value('mockParams2', {
  init: {id: 1},
  classifyCounts: {id: 'count'},
  wholeSession: {id: 'no'},
  days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
}).value('mockParams3', {
  init: {id: 1},
  classifyCounts: {id: 'count'},
  wholeSession: {id: 'yes'},
  days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
}).value('mockParams4', {
  init: {id: 1}
}).value('mockParams5', {
  init: {id: 1},
  classifyCounts: '',
  wholeSession: '',
  days: '',
  zeroCounts: 'no',
  excludeLocs: [''],
  excludeActs: [''],
  requireActs: [''],
  excludeActGrps: [''],
  requireActGrps: ['']
}).value('mockUrl1', 'lib/php/dataResults.php?edate=&etime=&id=1&sdate=&stime=')
.value('mockUrl2', 'lib/php/dataResults.php?classifyCounts=count&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&sdate=&stime=&wholeSession=no')
.value('mockUrl3', 'lib/php/sessionsResults.php?classifyCounts=session&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&locations=all&sdate=&stime=&wholeSession=yes')
.value('mockUrl4', 'lib/php/dataResults.php?classifyCounts=count&days=mo,tu,we,th,fr,sa,su&edate=&etime=&id=1&sdate=&stime=&wholeSession=yes')
.value('mockUrl5', 'lib/php/sessionsResults.php?edate=&etime=&id=1&sdate=&stime=')
.value('mockUrl6', 'lib/php/dataResults.php?edate=&etime=&excludeActGrps=&excludeActs=&excludeLocs=&id=1&requireActGrps=&requireActs=&sdate=&stime=');
