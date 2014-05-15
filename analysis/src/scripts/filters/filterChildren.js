'use strict';

angular.module('sumaAnalysis')
  .filter('filterChildren', function () {
    return function (input, filter, enabled) {
      return _.filter(input, function (e) {
        return _.some(e.children, {'filter': filter, 'enabled': enabled});
      });
    };
  });
