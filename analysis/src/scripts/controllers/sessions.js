'use strict';

angular.module('sumaAnalysis')
  .controller('SessionsCtrl', function ($scope, $http, $timeout, initiatives, sessionsData, promiseTracker, uiStates, errorDispatcher) {
    $scope.initialize = function () {
      // UI State
      uiStates.setUIState('initial', $scope);

      // Form data
      $scope.params = {};

      // Date defaults
      $scope.params.sdate = moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD');
      $scope.params.edate = moment().add('days', 1).format('YYYY-MM-DD');

      // Get inits on load
      $scope.loadInits = initiatives.get().then(function (data) {
        $scope.inits = data;
      }, function (data) {
        errorDispatcher.dispatch(data, $scope);
      });

      // Setup promise tracker for spinner on initial load
      $scope.finder = promiseTracker('initTracker');
      $scope.finder.addPromise($scope.loadInits);
    };

    $scope.submit = function () {
      // UI State
      uiStates.setUIState('loading', $scope);

      sessionsData.get($scope.params)
        .then(function (data) {
          // Bind Data to Scope
          $scope.data = data;

          // UI State
          uiStates.setUIState('success', $scope);
        }, function (data) {
          errorDispatcher.dispatch(data, $scope);
        });
    };

    $scope.initialize();
  });
