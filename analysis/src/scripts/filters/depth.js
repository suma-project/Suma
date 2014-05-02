'use strict';

angular.module('sumaAnalysis')
  .filter('depth', function () {
    return function (input) {
      var depth = input.depth,
        indent = '',
        title  = input.hasOwnProperty('title') ? input.title : input.name;

      while (depth > 0) {
        depth -= 1;
        indent += '—';
      }

      return indent + _.unescape(title);
    };
  });
