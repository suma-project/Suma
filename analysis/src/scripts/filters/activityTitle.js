'use strict';

angular.module('sumaAnalysis')
  .filter('activityTitle', function () {
    return function(input, acts, mode) {
      return  _.map(input, function (act) {
        var obj = _.find(acts, {id: parseInt(act, 10), type: mode});
        return obj ? _.unescape(obj.title) : 'None'
      }).join(', ');
    };
  });