'use strict';

angular.module('sumaAnalysis')
  .directive('csv', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/csv.html',
      scope: {data: '='},
      controller: ['$scope', function ($scope) {
        $scope.addCSVIndent = function (item) {
          var indent = '';

          while (item.depth > 0) {
            item.depth -= 1;
            indent += '     '; // 5 spaces
          }

          return indent + item.name;
        };

        $scope.buildPrimaryCSVString = function (counts) {
          return d3.csv.format(_.map(counts, function (o) {
            var newObj = {};

            newObj.Date = o.date;
            newObj.Total = o.total;

            _.each(o.locations, function (loc, i) {
              newObj[i] = loc;
            });

            _.each(o.activities, function (act, i) {
              newObj[i] = act;
            });

            return newObj;
          }));
        };

        $scope.buildCSVString = function (counts, label, indent) {
          return d3.csv.format(_.map(counts, function (o, i) {
            var object = {};

            object[label] = indent ? $scope.addCSVIndent(o) : o.name;
            object.Count = o.count;
            object.Percent = o.percent;

            return object;
          }));
        };

        $scope.buildCSV = function (counts) {
          var space = '\n\n\n',
              data = {},
              finalData = '',
              base,
              href;

          // Convert data to strings
          data.Primary = $scope.buildPrimaryCSVString(counts.csv);
          data.Locations = $scope.buildCSVString(counts.locationsTable, 'Location', true);
          data.Activities = $scope.buildCSVString(counts.activitiesTable, 'Activity', true);
          data.Hourly = $scope.buildCSVString(counts.hourlySummary, 'Hour');
          data.Daily = $scope.buildCSVString(counts.dayOfWeekSummary, 'Day');
          data.Monthly = $scope.buildCSVString(counts.monthSummary, 'Month');
          data.Yearly = $scope.buildCSVString(counts.yearSummary, 'Year');

          // Build final string with section headers and spacing
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
          $scope.href = $scope.buildCSV(data);
        };
      }]
    };
  });
