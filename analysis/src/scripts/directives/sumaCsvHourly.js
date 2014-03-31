'use strict';

angular.module('sumaAnalysis')
  .directive('sumaCsvHourly', function () {
    var dict = {
      weekdays: {
        1: 'Sunday',
        2: 'Monday',
        3: 'Tuesday',
        4: 'Wednesday',
        5: 'Thursday',
        6: 'Friday',
        7: 'Saturday'
      },
      hours: {
        1: '12:00 AM',
        2: '1:00 AM',
        3: '2:00 AM',
        4: '3:00 AM',
        5: '4:00 AM',
        6: '5:00 AM',
        7: '6:00 AM',
        8: '7:00 AM',
        9: '8:00 AM',
        10: '9:00 AM',
        11: '10:00 AM',
        12: '11:00 AM',
        13: '12:00 PM',
        14: '1:00 PM',
        15: '2:00 PM',
        16: '3:00 PM',
        17: '4:00 PM',
        18: '5:00 PM',
        19: '6:00 PM',
        20: '7:00 PM',
        21: '8:00 PM',
        22: '9:00 PM',
        23: '10:00 PM',
        24: '11:00 PM'
      }
    };

    return {
      templateUrl: 'views/directives/csv.html',
      restrict: 'A',
      scope: {data: '='},
      controller: ['$scope', function ($scope) {
        $scope.buildCSVString = function (counts, dict) {
          return d3.csv.format(_.map(counts, function (obj) {
            var count;

            if (obj.value === undefined || obj.value === null) {
              count = 'No Data Found';
            } else {
              count = obj.value;
            }

            return {
              Day: dict.weekdays[obj.day],
              Hour: dict.hours[obj.hour],
              Count: count
            };
          }));
        };

        $scope.buildCSV = function (counts, dict) {
          var data = {},
              finalData = '',
              base,
              href,
              lines,
              space = '\n\n\n\n';

          data.AvgOfCounts = $scope.buildCSVString(counts.avg, dict);
          data.AvgOfDays = $scope.buildCSVString(counts.avgDays, dict);
          data.Sums = $scope.buildCSVString(counts.sum, dict);

          _.each(data, function (str, name) {
            finalData += (name + '\n');
            finalData += str;
            finalData += space;
          });

          // Build download URL
          base = 'data:application/csv;charset=utf-8,';
          href = encodeURI(base + _.unescape(finalData));

          return href;
        };

        $scope.download = function (data) {
          $scope.href = $scope.buildCSV(data, dict);
        };
      }]
    };
  });
