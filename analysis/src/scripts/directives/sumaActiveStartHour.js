'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActiveStartHour', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activeStartHour.html',
      scope: {startHour: '='},
      link: function (scope, ele, attrs) {
        scope.display = false;
        scope.startHour = false;

        function setDisplayStatus () {
          if (scope.startHour.id === '0000') {
            scope.display = false;
          } else {
            scope.display = true;
          }
        }

        scope.$watch('startHour', setDisplayStatus, true);
      }
    };
  });
