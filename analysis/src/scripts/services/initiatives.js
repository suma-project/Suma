'use strict';

angular.module('sumaAnalysis')
  .factory('initiatives', function ($http, $q) {
    return {
      get: function (timeoutPromise) {
        var dfd,
            url;

        dfd = $q.defer();
        url = 'lib/php/initiatives.php';

        $http.get(url, {timeout: timeoutPromise.promise}).success(function (data, status, headers, config) {
          dfd.resolve(data);
        }).error(function (data, status, headers, config) {
          if (status !== 0) {
            dfd.reject({message: data.message, code: status, timeout: false});
          } else {
            dfd.reject({message: 'Initiatives.get Timeout', code: status, timeout: true});
          }
        });

        return dfd.promise;
      }
    };
  });
