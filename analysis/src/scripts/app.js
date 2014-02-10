'use strict';

angular.module('sumaAnalysis', ['ngRoute', 'ajoslin.promise-tracker'])
  .config(function ($routeProvider, $compileProvider) {
    var sumaBaseConfig = {
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
        daygroup: 'dayOptions',
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
        daygroup: true,
        wholeSession: true,
        activities: true,
        locations: true
      },
      dataSource: 'getData',
      dataProcessor: 'processTimeSeriesData',
      suppWatch: true
    };

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html'
      })
      .when('/home', {
        redirectTo: '/'
      })
      .when('/timeseries', {
        templateUrl: 'views/timeSeries.html',
        reloadOnSearch: false,
        controller: 'ReportCtrl',
        resolve: {
          sumaConfig: function () {
            return sumaBaseConfig;
          }
        }
      })
      .when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false,
        resolve: {
          sumaConfig: function () {
            var newConfig = angular.copy(sumaBaseConfig);
            newConfig.dataProcessor = 'processCalendarData';
            newConfig.suppWatch = false;

            return newConfig;
          }
        }
      })
      .when('/hourly', {
        templateUrl: 'views/hourly.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false,
        resolve: {
          sumaConfig: function () {
            var newConfig = angular.copy(sumaBaseConfig);

            newConfig.formFields.classifyCounts = false;
            newConfig.formFields.wholeSession = false;
            newConfig.formFields.stime = false;
            newConfig.formFields.etime = false;

            newConfig.dataProcessor = 'processHourlyData';
            newConfig.suppWatch = false;

            return newConfig;
          }
        }
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false,
        resolve: {
          sumaConfig: function () {
            var newConfig = angular.copy(sumaBaseConfig);

            newConfig.formFields.classifyCounts = false;
            newConfig.formFields.daygroup = false;
            newConfig.formFields.wholeSession = false;
            newConfig.formFields.activities = false;
            newConfig.formFields.locations = false;

            newConfig.dataSource = 'getSessionsData';
            newConfig.dataProcessor = false;
            newConfig.suppWatch = false;

            return newConfig;
          }
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
      });
      // .otherwise({
      //   redirectTo: '/'
      // });
      //

    // whitelist data for csv download
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(data):/);

  });
