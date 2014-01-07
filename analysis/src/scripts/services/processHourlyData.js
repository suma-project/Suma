'use strict';

angular.module('sumaAnalysis')
  .factory('processHourlyData', function ($q, $rootScope) {
    function processData (response) {
      var dfd = $.Deferred(),
      data = {};

      data.sum = _.flatten(_.map(response.dailyHourSummary, function (day, d) {
        return _.map(day, function (hour, h) {
          return {
            day: d + 1,
            hour: h + 1,
            value: hour.sum
          };
        });
      }));

      // Does response have enough values to draw meaningful graph?
      if (_.compact(_.pluck(data.sum, 'value')) < 1) {
        return dfd.reject({statusText: 'no data'});
      }

      data.avg = _.flatten(_.map(response.dailyHourSummary, function (day, d) {
        return _.map(day, function (hour, h) {
          return {
            day: d + 1,
            hour: h + 1,
            value: hour.avg
          };
        });
      }));

      data.avgDays = _.flatten(_.map(response.dailyHourSummary, function (day, d) {
        return _.map(day, function (hour, h) {
          return {
            day: d + 1,
            hour: h + 1,
            value: hour.avgDays
          };
        });
      }));

      data.options = [
        {title: 'Avg Counts', val: 'avg', data: data.avg},
        {title: 'Avg Days', val: 'avgDays', data: data.avgDays},
        {title: 'Sum', val: 'sum', data: data.sum}
      ];

      data.data = data.options[0];

      dfd.resolve(data);

      return dfd.promise();
    }
    // Public API here
    return {
      get: function (response) {
        var dfd;

        dfd = $q.defer();

        dfd.resolve(processData(response));

        return dfd.promise;
      }
    };
  });
