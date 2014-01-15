'use strict';

angular.module('sumaAnalysis')
  .factory('initiatives', function ($http, $q) {
    return {
      get: function () {
        var dfd,
            url;

        dfd = $q.defer();
        url = 'lib/php/initiatives.php';

        $http.get(url).success(function (data, status, headers, config) {
          dfd.resolve(data);
        }).error(function (data, status, headers, config) {
          dfd.reject({message: data.message, code: status});
        });

        return dfd.promise;
      }
    };
  });
