'use strict';

angular.module('sumaAnalysis')
  .directive('sumaCsv', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/csv.html',
      scope: {data: '=', params: '=', acts: '=', locs: '='},
      controller: ['$scope', '$location', '$filter', function ($scope, $location, $filter) {
        $scope.locationTitleFilter = $filter('locationTitle');
        $scope.activityTitleFilter = $filter('activityTitle');

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
            newObj.Weekday = o.weekday;
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
            var obj = {};

            obj[label]  = indent ? $scope.addCSVIndent(o) : o.name;
            obj.Count   = o.count;
            obj.Percent = o.percent;
            if (o.avg) {
              obj.Avg = o.avg;
            }

            return obj;
          }));
        };

        $scope.buildMetadata = function (params) {
          var string = '';

          string += _.capitalize(_.trim($location.path(), '/')) + ' Report' + '\n';
          string += 'Initiative: ' +  params.init.title + '\n';
          string += 'Classify By: ' + params.classifyCounts.title + '\n';
          string += 'Whole Session: ' + params.wholeSession.title + '\n';
          string += 'Zero Counts: ' + params.zeroCounts.title + '\n';
          string += 'Dates: ' + params.sdate + ' - ' +  params.edate + '\n';
          string += 'No Counts Before: ' + (params.stime || '00:00') + '\n';
          string += 'No Counts After: ' + (params.etime || '23:59') + '\n';
          string += 'Start 24-Hour Day: ' + params.startHour.title + '\n';
          string += 'Days: ' + params.days.join() +  '\n';
          string += 'EL: ' + $scope.locationTitleFilter(params.excludeLocs, $scope.locs) + '\n';
          string += 'EA: ' + $scope.activityTitleFilter(params.excludeActs, $scope.acts, 'activity') + '\n';
          string += 'RA: ' + $scope.activityTitleFilter(params.requireActs, $scope.acts, 'activity') + '\n';
          string += 'EAG: ' + $scope.activityTitleFilter(params.excludeActGrps, $scope.acts, 'activityGroup') + '\n';
          string += 'RAG: ' + $scope.activityTitleFilter(params.requireActGrps, $scope.acts, 'activityGroup') + '\n';

          return string;
        };

        $scope.buildCSV = function (counts, params) {
          var space = '\n\n\n',
              data = {},
              finalData = '',
              base,
              href;

          // Add note about startHour
          if (params.startHour.id !== '0000') {
            finalData += 'NOTICE: 24-Hour periods have been modified to start at ' + params.startHour.title + '\n';
          }

          // Convert data to strings
          data.Metadata   = $scope.buildMetadata(params);
          data.Primary    = $scope.buildPrimaryCSVString(counts.csv);
          data.Locations  = $scope.buildCSVString(counts.locationsTable, 'Location', true);
          data.Activities = $scope.buildCSVString(counts.activitiesTable, 'Activity', true);
          data.Hourly     = $scope.buildCSVString(counts.hourlySummary, 'Hour');
          data.Daily      = $scope.buildCSVString(counts.dayOfWeekSummary, 'Day');
          data.Monthly    = $scope.buildCSVString(counts.monthSummary, 'Month');
          data.Yearly     = $scope.buildCSVString(counts.yearSummary, 'Year');

          // Build final string with section headers and spacing
          _.each(data, function (str, name) {
            finalData += (name + '\n');
            finalData += str;
            finalData += space;
          });

          // Build download URL
          base = 'data:text/csv;charset=utf-8,';
          href = encodeURI(base + _.unescape(finalData));

          return href;
        };

        $scope.download = function (data, params) {
          $scope.href = $scope.buildCSV(data, params);
        };
      }]
    };
  });
