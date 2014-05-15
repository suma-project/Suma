'use strict';

angular.module('sumaAnalysis')
  .filter('unescape', function () {
    return function (input) {
      return _.unescape(input);
    };
  });
