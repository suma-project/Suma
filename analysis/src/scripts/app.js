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
        reloadOnSearch: false,
        controller: 'ReportCtrl'
      })
      .when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false
      })
      .when('/hourly', {
        templateUrl: 'views/hourly.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    // whitelist data for csv download
    if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
          $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
        } else {
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
        }
  });
