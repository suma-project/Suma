'use strict';

angular.module('sumaAnalysis', ['ngRoute', 'ajoslin.promise-tracker'])
  .config(function ($routeProvider, $compileProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html'
      })
      .when('/home', {
        redirectTo: '/'
      })
      .when('/timeseries', {
        templateUrl: 'views/timeSeries.html',
        controller: 'TimeSeriesCtrl',
        resolve: {
          sumaConfig: function () {
            return {
              formData: {
                countOptions: [{id: 'count', title: 'Count Date'}, {id: 'start', title: 'Session Start'}, {id: 'end', title: 'Session End'}],
                dayOptions: [{id: 'all', title: 'All'}, {id: 'weekdays', title: 'Weekdays Only'}, {id: 'weekends', title: 'Weekends Only'}],
                sessionOptions: [{id: 'false', title: 'No'}, {id: 'true', title: 'Yes'}]
              },
              formDefaults: {
                count: 'countOptions',
                daygroup: 'dayOptions',
                session_filter: 'sessionOptions'
              },
              dataSource: 'getData',
              dataProcessor: 'processTimeSeriesData',
              suppWatch: true
            }
          }
        }
      })
      .when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'TimeSeriesCtrl',
        resolve: {
          sumaConfig: function () {
            return {
              formData: {
                countOptions: [{id: 'count', title: 'Count Date'}, {id: 'start', title: 'Session Start'}, {id: 'end', title: 'Session End'}],
                dayOptions: [{id: 'all', title: 'All'}, {id: 'weekdays', title: 'Weekdays Only'}, {id: 'weekends', title: 'Weekends Only'}],
                sessionOptions: [{id: 'false', title: 'No'}, {id: 'true', title: 'Yes'}]
              },
              formDefaults: {
                count: 'countOptions',
                daygroup: 'dayOptions',
                session_filter: 'sessionOptions'
              },
              dataSource: 'getData',
              dataProcessor: 'processCalendarData',
              suppWatch: false
            }
          }
        }
      })
      .when('/hourly', {
        templateUrl: 'views/hourly.html',
        controller: 'TimeSeriesCtrl',
        resolve: {
          sumaConfig: function () {
            return {
              formData: {
                countOptions: [{id: 'count', title: 'Count Date'}, {id: 'start', title: 'Session Start'}, {id: 'end', title: 'Session End'}],
                dayOptions: [{id: 'all', title: 'All'}, {id: 'weekdays', title: 'Weekdays Only'}, {id: 'weekends', title: 'Weekends Only'}],
                sessionOptions: [{id: 'false', title: 'No'}, {id: 'true', title: 'Yes'}]
              },
              formDefaults: {
                count: 'countOptions',
                daygroup: 'dayOptions',
                session_filter: 'sessionOptions'
              },
              dataSource: 'getData',
              dataProcessor: 'processHourlyData',
              suppWatch: false
            }
          }
        }
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'TimeSeriesCtrl',
        resolve: {
          sumaConfig: function () {
            return {
              formData: {
                countOptions: [{id: 'count', title: 'Count Date'}, {id: 'start', title: 'Session Start'}, {id: 'end', title: 'Session End'}],
                dayOptions: [{id: 'all', title: 'All'}, {id: 'weekdays', title: 'Weekdays Only'}, {id: 'weekends', title: 'Weekends Only'}],
                sessionOptions: [{id: 'false', title: 'No'}, {id: 'true', title: 'Yes'}]
              },
              formDefaults: {
                count: 'countOptions',
                daygroup: 'dayOptions',
                session_filter: 'sessionOptions'
              },
              dataSource: 'getSessionsData',
              dataProcessor: 'processHourlyData',
              suppWatch: false
            }
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
