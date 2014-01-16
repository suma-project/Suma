'use strict';

angular.module('sumaAnalysis')
  .directive('sumaButtonsRadio', function () {
    var oldOption;

    return {
      restrict: 'E',
      templateUrl: 'views/directives/buttonsRadio.html',
      scope: {model: '=', options: '='},
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
