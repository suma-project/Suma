'use strict';

angular.module('sumaAnalysis')
  .factory('processRawData', function ($q, $rootScope) {
    function sortData(response) {
      return _.sortBy(response, 'time').reverse();
    }

    function processData(response) {
      return d3.nest()
          .key(function (d) {
            return moment(d.time, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD');
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
