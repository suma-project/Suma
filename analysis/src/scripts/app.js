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
        controller: 'TimeSeriesCtrl'
      })
      .when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl'
      })
      .when('/hourly', {
        templateUrl: 'views/hourly.html',
        controller: 'HourlyCtrl'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'SessionsCtrl'
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

    // Whitelist data for CSV download
    if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    } else {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    }
  });
