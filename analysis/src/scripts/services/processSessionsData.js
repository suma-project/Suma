'use strict';

angular.module('sumaAnalysis')
  .factory('processSessionsData', function ($q, $rootScope) {
    function sortData(response) {
      return _.sortBy(response, 'start').reverse();
    }

    function processData(response) {
      return d3.nest()
          .key(function (d) {
            return moment(d.start, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
          })
          .entries(sortData(response));
    }

    return {
      get: function (response) {
        var dfd = $q.defer();

        dfd.resolve(processData(response));

        return dfd.promise;
      }
    };
  });
