'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActivityFilter', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activityFilter.html',
      scope: {acts: '='},
      link: function (scope, ele, attrs, depthFilter) {
        scope.flatActs = [];

        scope.$watch('acts', function (change) {
          var newFlatActs = [];
          if (scope.acts) {
            _.each(scope.acts, function (act) {
              _.each(act.children, function (child) {
                if (act.filter === 'exclude') {
                  child.enabled = false;
                } else {
                  child.enabled = true;
                }
              });
            });

            _.each(scope.acts, function (act) {
              newFlatActs.push(act);

              _.each(act.children, function (child) {
                newFlatActs.push(child);
              });
            });

            scope.flatActs = newFlatActs;
          }
        }, true);
      }
    };
  });
