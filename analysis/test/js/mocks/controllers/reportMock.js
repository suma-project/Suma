'use strict';

angular.module('reportMock', [])
  .value('sumaConfig', {
  formData: {
    countOptions: [
      {id: 'count', title: 'Count Date'},
      {id: 'start', title: 'Session Start'},
      {id: 'end', title: 'Session End'}
    ],
    dayOptions: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    sessionOptions: [
      {id: 'no', title: 'No'},
      {id: 'yes', title: 'Yes'}
    ],
    startDate: [moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD')],
    endDate: [moment().add('days', 1).format('YYYY-MM-DD')],
    startTime: [''],
    endTime: ['']
  },
  formDefaults: {
    classifyCounts: 'countOptions',
    wholeSession: 'sessionOptions',
    sdate: 'startDate',
    edate: 'endDate',
    stime: 'startTime',
    etime: 'endTime'
  },
  formFields: {
    sdate: true,
    edate: true,
    stime: true,
    etime: true,
    classifyCounts: true,
    days: true,
    wholeSession: true,
    activities: true,
    locations: true
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
    dayOptions: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    sessionOptions: [
      {id: 'no', title: 'No'},
      {id: 'yes', title: 'Yes'}
    ],
    startDate: [moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD')],
    endDate: [moment().add('days', 1).format('YYYY-MM-DD')],
    startTime: [''],
    endTime: ['']
  },
  formDefaults: {
    classifyCounts: 'countOptions',
    wholeSession: 'sessionOptions',
    sdate: 'startDate',
    edate: 'endDate',
    stime: 'startTime',
    etime: 'endTime'
  },
  formFields: {
    sdate: true,
    edate: true,
    stime: true,
    etime: true,
    classifyCounts: true,
    days: true,
    wholeSession: true,
    activities: true,
    locations: true
  },
  dataSource: 'getData',
  dataProcessor: 'processTimeSeriesData',
  suppWatch: false
}).value('sumaConfig3', {
  formData: {
    countOptions: [
      {id: 'count', title: 'Count Date'},
      {id: 'start', title: 'Session Start'},
      {id: 'end', title: 'Session End'}
    ],
    dayOptions: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    sessionOptions: [
      {id: 'no', title: 'No'},
      {id: 'yes', title: 'Yes'}
    ],
    startDate: [moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD')],
    endDate: [moment().add('days', 1).format('YYYY-MM-DD')],
    startTime: [''],
    endTime: ['']
  },
  formDefaults: {
    classifyCounts: 'countOptions',
    wholeSession: 'sessionOptions',
    sdate: 'startDate',
    edate: 'endDate',
    stime: 'startTime',
    etime: 'endTime'
  },
  formFields: {
    sdate: false,
    edate: false,
    stime: false,
    etime: false,
    classifyCounts: false,
    days: false,
    wholeSession: false,
    activities: false,
    locations: false
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
  dayOptions: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
  sessionOptions : [
    {id: 'no', title: 'No'},
    {id: 'yes', title: 'Yes'}
  ],
  classifyCounts : {id: 'count', title: 'Count Date'},
  days : {id: 'all', title: 'All'},
  wholeSession : {id: 'no', title: 'No'},
  sDate : moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD'),
  eDate : moment().add('days', 1).format('YYYY-MM-DD')
});
