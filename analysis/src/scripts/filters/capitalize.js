'use strict';

angular.module('sumaAnalysis')
  .filter('capitalize', function () {
    return function(input, scope) {
      if (input !== null && input !== undefined) {
        input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
      } else {
        return input;
      }
    };
  });
