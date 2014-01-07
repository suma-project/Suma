'use strict';

angular.module('sumaAnalysis')
  .factory('sessionsData', function ($q, $http) {
    return {
      get: function (params) {
        var dfd,
            options,
            processor,
            url;

        dfd = $q.defer();
        url = 'lib/php/sessionsResults.php';

        options = {
          'params': {
            'id': params.init.id,
            'session': 'session',
            'session_filter': 'true',
            'sdate': params.sdate || '',
            'edate': params.edate || '',
            'stime': params.stime || '',
            'etime': params.etime || '',
            'daygroup': 'all' ,
            'locations': 'all',
            'activities': 'all'
          }
        };

        $http.get(url, options).success(function(data) {
          dfd.resolve(data);
        }).error(function(data, status, headers, config){
          dfd.reject({message: data.message, code: status});
        });

        return dfd.promise;
      }
    };
  });
