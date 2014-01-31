'use strict';

angular.module('sumaAnalysis')
  .factory('initiatives', function ($http, $q, $timeout) {
    return {
      get: function (cfg) {
        var dfd,
            options,
            url;

        dfd = $q.defer();
        url = 'lib/php/initiatives.php';

        options = {
          timeout: cfg.timeoutPromise.promise
        };

        $http.get(url, options).success(function (data, status, headers, config) {
          dfd.resolve(data);
        }).error(function (data, status, headers, config) {
          if (status === 0) {
            dfd.reject({
              message: 'Initiatives.get Timeout',
              code: status,
              promiseTimeout: true
            });
          } else {
            dfd.reject({
              message: data.message,
              code: status
            });
          }
        });

        $timeout(function () {
          dfd.reject({
            message: 'Initiatives.get Timeout',
            code: 0
          });
          cfg.timeoutPromise.resolve();
        }, cfg.timeout);

        return dfd.promise;
      }
    };
  });
