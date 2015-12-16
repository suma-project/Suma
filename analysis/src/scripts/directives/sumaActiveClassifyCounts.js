'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActiveClassifyCounts', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activeClassifyCounts.html',
      scope: {classifyCounts: '='},
      link: function (scope, ele, attrs) {
        scope.display = false;
        scope.classifyCounts = false;

        function setDisplayStatus () {
          if (scope.classifyCounts.id === 'count') {
            scope.display = false;
          } else {
            scope.display = true;
          }
        }

        scope.$watch('classifyCounts', setDisplayStatus, true);
      }
    };
  });
