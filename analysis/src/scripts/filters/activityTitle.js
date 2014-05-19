'use strict';

angular.module('sumaAnalysis')
  .filter('activityTitle', function () {
    return function(input, acts, mode) {
      function getActGrpTitle (obj) {
        return _.find(acts, {id: obj.activityGroup, type: 'activityGroup'}).title;
      }

      return  _.map(input, function (act) {
        var obj = _.find(acts, {id: parseInt(act, 10), type: mode});
        return obj ? obj.type === 'activityGroup' ? _.unescape(obj.title) : getActGrpTitle(obj) + '-' + _.unescape(obj.title) : 'None'
      }).join(', ');
    };
  });