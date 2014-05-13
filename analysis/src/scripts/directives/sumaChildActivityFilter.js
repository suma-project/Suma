'use strict';

angular.module('sumaAnalysis')
  .directive('sumaChildActivityFilter', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/childActivityFilter.html',
      scope: {act: '=', disable: '='},
      link: function (scope, ele, attrs, depthFilter) {
        scope.filter = scope.act.filter;

        scope.$watch('filter', function (updatedFilter) {
          if (updatedFilter) {
            scope.act.filter = updatedFilter;
          }
        });

        scope.$watch('disable', function () {
          if (scope.disable === true) {
            scope.act.enabled = false;
          } else {
            scope.act.enabled = true;
          }
        });
      }
    };
  });
