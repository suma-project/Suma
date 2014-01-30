'use strict';

angular.module('sumaAnalysis')
  .factory('data', function ($http, $q, processTimeSeriesData, processCalendarData, processHourlyData) {
    return {
      getSessionsData: function (params, acts, locs, dataProcessor, tPromise) {
        var dfd,
            options,
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
          },
          timeout: tPromise.promise
        };

        $http.get(url, options).success(function(data) {
          dfd.resolve(data);
        }).error(function(data, status, headers, config) {
          if (status !== 0) {
            dfd.reject({message: data.message, code: status, timeout: false});
          } else {
            dfd.reject({message: 'Data.getSessionsData Timeout', code: status, timeout: true});
          }
        });

        return dfd.promise;
      },
      getData: function (params, acts, locs, dataProcessor, tPromise) {
        var dfd,
            options,
            processor,
            url;

        dfd = $q.defer();
        url = 'lib/php/dataResults.php';

        if (dataProcessor === 'processTimeSeriesData') {
          processor = processTimeSeriesData;
        } else if (dataProcessor === 'processCalendarData') {
          processor = processCalendarData;
        } else if (dataProcessor === 'processHourlyData'){
          processor = processHourlyData;
        } else {
          dfd.reject({message: 'Data processor not found.', code: 'None found.'});
        }

        options = {
          'params': {
            'id': params.init.id,
            'session': params.count ? params.count.id : 'count',
            'session_filter': params.session_filter ? params.session_filter.id : 'false',
            'sdate': params.sdate || '',
            'edate': params.edate || '',
            'stime': params.stime || '',
            'etime': params.etime || '',
            'daygroup': params.daygroup ? params.daygroup.id : 'all' ,
            'locations': params.location ? params.location.id : 'all',
            'activities': params.activity.type ? (params.activity.type + '-' + params.activity.id) : 'all'
          },
          timeout: tPromise.promise
        };

        $http.get(url, options).success(function(data) {
          processor.get(data, acts, locs).then(function (processedData) {
            dfd.resolve(processedData);
          }, function (data) {
            dfd.reject(data);
          });
        }).error(function(data, status, headers, config){
          if (status !== 0) {
            dfd.reject({message: data.message, code: status, timeout: false});
          } else {
            dfd.reject({message: 'Data.getData Timeout', code: status, timeout: true});
          }
        });

        return dfd.promise;
      }
    };
  });
