'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActiveActs', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activeActs.html',
      scope: {acts: '='},
      link: function (scope, ele, attrs, depthFilter) {
        scope.display = false;

        function setDisplayStatus () {
          var states = _.uniq(_.pluck(scope.acts, 'filter'));

          if (_.contains(states, 'require') || _.contains(states, 'exclude')) {
            scope.display = true;
          } else {
            scope.display = false;
          }
        }

        scope.$watch('acts', setDisplayStatus, true);
      }
    };
  });
