'use strict';

angular.module('sumaAnalysis')
  .directive('sumaCsvRaw', function () {
    return {
      templateUrl: 'views/directives/csv.html',
      restrict: 'A',
      scope: {data: '=', params: '=', acts: '='},
      controller: ['$scope', '$location', function ($scope, $location) {
        $scope.buildDict = function (acts) {
          var dict = {};

          _.each(acts, function (act) {
            if (act.type === 'activity') {
              dict[act.id] = act.altName;
            }
          });

          return dict;
        };

        $scope.buildCSVString = function (values, itemsSrc) {
          return d3.csv.format(_.map(values, function (val){
            var items = _.cloneDeep(itemsSrc);

            items['Count Date']    = val.time;
            items['Session Start'] = val.sessionStart;
            items['Session End']   = val.sessionEnd;
            items['Count ID']      = val.countId;
            items['Session ID']    = val.sessionId;
            items.Location         = val.location;

            _.each(val.activities, function (act, i) {
                var title = $scope.actDict[act];
                items[title] = 1;
            });

            return items;
          }));
        };

        $scope.buildMetadata = function (params) {
          return params.init.title + '\n' +
          params.sdate + ' to ' +  params.edate + '\n' +
          _.capitalize(_.trim($location.path(), '/')) + ' Report' + '\n';
        };

        $scope.buildCSV = function (counts, params) {
          var data = '',
              base,
              href,
              itemsSrc,
              space = '\n\n\n\n';

          data += $scope.buildMetadata(params);

          // Create base object to force activity headers
          itemsSrc = {
            'Count Date': null,
            'Session Start': null,
            'Session End': null,
            'Count ID': null,
            'Session ID': null,
            'Location': null
          };

          _.each($scope.actDict, function (act) {
            itemsSrc[act] = '';
          });

          _.each(counts, function (e) {
            data += (e.key + '\n');
            data += $scope.buildCSVString(e.values, itemsSrc);
            data += space;
          });

          // Build download URL
          base = 'data:application/csv;charset=utf-8,';
          href = encodeURI(base + _.unescape(data));

          return href;
        };

        $scope.download = function (data, params) {
          $scope.actDict = $scope.buildDict($scope.acts);
          $scope.href = $scope.buildCSV(data, params);
        };
      }]
    };
  });
