'use strict';

// taken from Underscore.string capitalize method
angular.module('sumaAnalysis')
  .filter('capitalize', function () {
    return function(str) {
      str = (str === undefined || str === null) ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  });
