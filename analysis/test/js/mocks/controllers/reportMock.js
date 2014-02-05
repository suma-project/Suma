'use strict';

angular.module('reportMock', [])
  .value('sumaConfig', {
  formData: {
    countOptions: [
      {id: 'count', title: 'Count Date'},
      {id: 'start', title: 'Session Start'},
      {id: 'end', title: 'Session End'}
    ],
    dayOptions: [
      {id: 'all', title: 'All'},
      {id: 'weekdays', title: 'Weekdays Only'},
      {id: 'weekends', title: 'Weekends Only'}
    ],
    sessionOptions: [
      {id: 'false', title: 'No'},
      {id: 'true', title: 'Yes'}
    ]
  },
  formDefaults: {
    classifyCounts: 'countOptions',
    daygroup: 'dayOptions',
    wholeSession: 'sessionOptions'
  },
  dataSource: 'getData',
  dataProcessor: 'processTimeSeriesData',
  suppWatch: true
}).value('sumaConfig2', {
  formData: {
    countOptions: [
      {id: 'count', title: 'Count Date'},
      {id: 'start', title: 'Session Start'},
      {id: 'end', title: 'Session End'}
    ],
    dayOptions: [
      {id: 'all', title: 'All'},
      {id: 'weekdays', title: 'Weekdays Only'},
      {id: 'weekends', title: 'Weekends Only'}
    ],
    sessionOptions: [
      {id: 'false', title: 'No'},
      {id: 'true', title: 'Yes'}
    ]
  },
  formDefaults: {
    classifyCounts: 'countOptions',
    daygroup: 'dayOptions',
    wholeSession: 'sessionOptions'
  },
  dataSource: 'getData',
  dataProcessor: 'processTimeSeriesData',
  suppWatch: false
}).value('defaults', {
  countOptions : [
    {id: 'count', title: 'Count Date'},
    {id: 'start', title: 'Session Start'},
    {id: 'end', title: 'Session End'}
  ],
  dayOptions : [
    {id: 'all', title: 'All'},
    {id: 'weekdays', title: 'Weekdays Only'},
    {id: 'weekends', title: 'Weekends Only'}
  ],
  sessionOptions : [
    {id: 'false', title: 'No'},
    {id: 'true', title: 'Yes'}
  ],
  classifyCounts : {id: 'count', title: 'Count Date'},
  daygroup : {id: 'all', title: 'All'},
  wholeSession : {id: 'false', title: 'No'},
  sDate : moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD'),
  eDate : moment().add('days', 1).format('YYYY-MM-DD')
});
