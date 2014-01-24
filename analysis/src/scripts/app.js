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
          {id: 'false', title: 'No'},
          {id: 'true', title: 'Yes'}
        ]
      },
      formDefaults: {
        count: 'countOptions',
        daygroup: 'dayOptions',
        session_filter: 'sessionOptions'
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
        resolve: {
          sumaConfig: function () {
            var newConfig = angular.copy(sumaBaseConfig);
            newConfig.dataProcessor = 'processHourlyData';
            newConfig.suppWatch = false;

            return newConfig;
          }
        }
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'ReportCtrl',
        resolve: {
          sumaConfig: function () {
            var newConfig = angular.copy(sumaBaseConfig);
            newConfig.formData = null;
            newConfig.formDefaults = null;
            newConfig.dataSource = 'getSessionsData';
            newConfig.dataProcessor = null;
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
