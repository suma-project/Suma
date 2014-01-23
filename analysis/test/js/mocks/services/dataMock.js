'use strict';

angular.module('dataMock', [])
  .value('mockParams1', {
  init: {id: 1},
  count: {},
  session_filter: 'false',
  daygroup: {},
  location: {id: 'all'},
  activity: {id: 'all'}
}).value('mockParams2', {
  init: {id: 1},
  count: {},
  session_filter: 'false',
  daygroup: {},
  location: {},
  activity: {type: 'activity', id: 4}
});