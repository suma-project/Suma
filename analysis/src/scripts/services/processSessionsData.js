'use strict';

angular.module('sumaAnalysis')
  .factory('processSessionsData', function ($q, $rootScope) {
    function sortData(response) {
      return _.sortBy(response, 'start').reverse();
    }

    return {
      get: function (response) {
        var dfd = $q.defer();

        dfd.resolve(sortData(response));

        return dfd.promise;
      }
    };
  });
