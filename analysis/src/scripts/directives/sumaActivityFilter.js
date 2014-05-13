'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActivityFilter', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activityFilter.html',
      scope: {act: '='},
      link: function (scope, ele, attrs, depthFilter) {
        scope.filter = scope.act.filter;

        scope.$watch('filter', function (updatedFilter) {
          if (updatedFilter) {
            scope.act.filter = updatedFilter;
          }
        });
      }
    };
  });
