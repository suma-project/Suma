'use strict';

angular.module('sumaAnalysis')
  .directive('sumaActivityFilter', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/activityFilter.html',
      scope: {acts: '='},
      link: function (scope, ele, attrs, depthFilter) {
        function setFilterStatus () {
          var actGrps = _.filter(scope.acts, {type: 'activityGroup'});

          _.each(actGrps, function (actGrp) {
            var acts = _.filter(scope.acts, {type: 'activity', activityGroup: actGrp.id});

            _.each(acts, function (act) {
              if (actGrp.filter === 'exclude') {
                act.enabled = false;
              } else {
                act.enabled = true;
              }
            });
          });
        }

        scope.$watch('acts', setFilterStatus, true);
      }
    };
  });
