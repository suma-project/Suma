'use strict';

angular.module('sumaAnalysis')
  .filter('truncate', function () {
    return function (input, length, separator, omission) {
      return _.trunc(input, {
        'length': length ? length : 30,
        'separator': separator,
        'omission': omission ? omission : '...'
      });
    };
  });
