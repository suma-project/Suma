'use strict';

angular.module('sumaAnalysis')
  .directive('sumaCsvSessions', function () {
    return {
      templateUrl: 'views/directives/csv.html',
      restrict: 'A',
      scope: {data: '='},
      controller: ['$scope', function ($scope) {

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

        $scope.buildCSV = function (counts, dict) {
          var data = '',
              base,
              href,
              space = '\n\n\n\n';

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

        $scope.download = function (data) {
          $scope.href = $scope.buildCSV(data);
        };
      }]
    };
  });
