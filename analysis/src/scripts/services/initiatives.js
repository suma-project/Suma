'use strict';

angular.module('sumaAnalysis')
  .factory('initiatives', function ($http, $q, $timeout) {
    return {
      get: function (cfg) {
        var dfd,
            options,
            self = this,
            url;

        dfd = $q.defer();
        url = 'lib/php/initiatives.php';

        options = {
          timeout: cfg.timeoutPromise.promise
        };

        this.httpSuccess = function (response) {
          dfd.resolve(response.data);
        };

        this.httpError = function (response) {
          if (response.status === 0) {
            dfd.reject({
              message: 'Initiatives.get Timeout',
              code: response.status,
              promiseTimeout: true
            });
          } else {
            dfd.reject({
              message: response.data.message,
              code: response.status
            });
          }
        };

        $http.get(url, options).then(self.httpSuccess, self.httpError);

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
