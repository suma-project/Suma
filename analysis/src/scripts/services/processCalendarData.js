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
          dfd = $.Deferred(),
          data = {},
          sum;

      // Does response have enough values to draw meaningful graph?
      if (!response.periodSum) {
        return dfd.reject({statusText: 'no data'});
      }

      if (Object.keys(response.periodSum).length < 1) {
        return dfd.reject({statusText: 'no data'});
      }

      sum = sortData(response.periodSum);

      avg = sortData(response.periodAvg);

      data.options = [
        {title: 'Daily Avg', val: 'avg', data: avg},
        {title: 'Daily Sum', val: 'sum', data: sum}
      ];

      data.data = data.options[1];

      dfd.resolve(data);

      return dfd.promise();
    }

    return {
      get: function (response) {
        var dfd;

        dfd = $q.defer();

        dfd.resolve(processData(response));

        return dfd.promise;
      }
    };
  });
