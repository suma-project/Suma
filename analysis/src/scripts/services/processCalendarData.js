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
        var dfd = $q.defer();

        dfd.resolve(processData(response));

        return dfd.promise;
      }
    };
  });
