'use strict';

angular.module('sumaAnalysis')
  .factory('processCalendarData', function ($q, $rootScope) {

    function sortData(response) {
      return _.sortBy(
        _.map(response, function (count, date) {
          return {
            date: date,
            count: count.count
          };
        }),
        function (obj) {
          return obj.date;
        }
      );
    }

    function processData(response) {
      var avg,
          data = {},
          sum;

      sum = sortData(response.periodSum);

      avg = sortData(response.periodAvg);

      data.options = [
        {title: 'Daily Avg', val: 'avg', data: avg},
        {title: 'Daily Sum', val: 'sum', data: sum}
      ];

      data.data = data.options[1];

      return data;
    }

    return {
      get: function (response) {
        var dfd;

        dfd = $q.defer();

        // TODO: improve rejection of poor data set
        // Does response have enough values to draw meaningful graph?
        if (!response.periodSum) {
          dfd.reject({statusText: 'no data, periodSum not found'});
        }

        if (response.periodSum) {
          if (Object.keys(response.periodSum).length < 1) {
            dfd.reject({statusText: 'not enough data'});
          }
        }

        dfd.resolve(processData(response));

        return dfd.promise;
      }
    };
  });
