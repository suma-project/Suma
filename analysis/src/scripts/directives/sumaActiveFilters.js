'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActiveFilters', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activeFilters.html',
      scope: {acts: '=', locs: '='},
      link: function (scope, ele, attrs, depthFilter) {
        scope.display = false;
        scope.actsActive = false;
        scope.locsActive = false;

        function setActsDisplayStatus () {
          var states = _.uniq(_.pluck(scope.acts, 'filter'));

          if (_.contains(states, 'require') || _.contains(states, 'exclude')) {
            scope.display = true;
            scope.actsActive = true;
          } else {
            if (!scope.locsActive) {
              scope.display = false;
            }
            scope.actsActive = false;
          }
        }

        function setLocsDisplayStatus () {
          var states = _.uniq(_.pluck(scope.locs, 'filter'));

          if (_.contains(states, false)) {
            scope.display = true;
            scope.locsActive = true;
          } else {
            if (!scope.actsActive) {
              scope.display = false;
            }
            scope.locsActive = false;
          }
        }

        scope.$watch('acts', setActsDisplayStatus, true);
        scope.$watch('locs', setLocsDisplayStatus, true);
      }
    };
  });
