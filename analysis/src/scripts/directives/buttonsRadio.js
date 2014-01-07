'use strict';

angular.module('sumaAnalysis')
  .directive('buttonsRadio', function () {
    var oldOption;

    return {
      restrict: 'E',
      templateUrl: 'views/directives/buttonsRadio.html',
      scope: {model: '=model', options: '='},
      controller: ['$scope', function ($scope) {
        $scope.activate = function (option) {
          if (option.$$hashKey !== oldOption) {
            $scope.model = option;
          }
          oldOption = option.$$hashKey;
        };
      }]
    };
  });
