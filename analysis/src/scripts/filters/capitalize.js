'use strict';

angular.module('sumaAnalysis')
  .filter('capitalize', function () {
    return function(str) {
      return _.capitalize(str);
    };
  });
