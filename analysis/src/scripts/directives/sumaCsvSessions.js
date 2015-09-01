'use strict';

angular.module('sumaAnalysis')
  .directive('sumaCsvSessions', function () {
    return {
      templateUrl: 'views/directives/csv.html',
      restrict: 'A',
      scope: {data: '=', params: '='},
      controller: ['$scope', '$location', function ($scope, $location) {

        $scope.buildCSVString = function (values) {
          return d3.csv.format(_.map(values, function (val){
            return {
              'ID': val.id,
              'Session Start': val.start,
              'Session End': val.end,
              'Transaction Start': val.transStart,
              'TransactionEnd': val.transEnd,
              'Total': val.total
            };
          }));
        };

        $scope.buildMetadata = function (params) {
          var string = '';

          string += _.capitalize(_.trim($location.path(), '/')) + ' Report' + '\n';
          string += 'Initiative: ' +  params.init.title + '\n';
          string += 'Dates: ' + params.sdate + ' - ' +  params.edate + '\n';
          string += 'No Counts Before: ' + (params.stime || '00:00') + '\n';
          string += 'No Counts After: ' + (params.etime || '23:59') + '\n';

          return string;
        };

        $scope.buildCSV = function (counts, params) {
          var data = '',
              base,
              href,
              space = '\n\n\n\n';

          data += $scope.buildMetadata(params);

          _.each(counts, function (e) {
            data += (e.key + '\n');
            data += $scope.buildCSVString(e.values);
            data += space;
          });

          // Build download URL
          base = 'data:application/csv;charset=utf-8,';
          href = encodeURI(base + _.unescape(data));

          return href;
        };

        $scope.download = function (data, params) {
          $scope.href = $scope.buildCSV(data, params);
        };
      }]
    };
  });
