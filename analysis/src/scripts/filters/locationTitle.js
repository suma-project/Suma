'use strict';

angular.module('sumaAnalysis')
  .filter('locationTitle', function () {
    return function(input, locs) {
      return  _.map(input, function (loc) {
        var obj = _.find(locs, {id: parseInt(loc, 10)});
        return obj ? _.unescape(obj.title) : 'None';
      }).join(', ');
    };
  });