'use strict';

angular.module('sumaAnalysis')
  .factory('data', function ($http, $q, $timeout, processTimeSeriesData, processCalendarData, processHourlyData) {
    return {
      getSessionsData: function (cfg) {
        var dfd,
            options,
            url;

        dfd = $q.defer();
        url = 'lib/php/sessionsResults.php';

        options = {
          'params': {
            'id': cfg.params.init.id,
            'session': 'session',
            'session_filter': 'true',
            'sdate': cfg.params.sdate || '',
            'edate': cfg.params.edate || '',
            'stime': cfg.params.stime || '',
            'etime': cfg.params.etime || '',
            'daygroup': 'all' ,
            'locations': 'all',
            'activities': 'all'
          },
          timeout: cfg.timeoutPromise.promise
        };

        $http.get(url, options).success(function(data) {
          dfd.resolve(data);
        }).error(function(data, status, headers, config) {
          if (status === 0) {
            dfd.reject({
              message: 'Data.getSessionsData Timeout',
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
            message: 'Data.getData Timeout',
            code: 0
          });
          cfg.timeoutPromise.resolve();
        }, cfg.timeout);

        return dfd.promise;
      },
      getData: function (cfg) {
        var dfd,
            options,
            processor,
            url;

        dfd = $q.defer();
        url = 'lib/php/dataResults.php';

        if (cfg.dataProcessor === 'processTimeSeriesData') {
          processor = processTimeSeriesData;
        } else if (cfg.dataProcessor === 'processCalendarData') {
          processor = processCalendarData;
        } else if (cfg.dataProcessor === 'processHourlyData'){
          processor = processHourlyData;
        } else {
          dfd.reject({message: 'Data processor not found.', code: 'None found.'});
        }

        options = {
          params: {
            id: cfg.params.init.id,
            sdate: cfg.params.sdate || '',
            edate: cfg.params.edate || '',
            stime: cfg.params.stime || '',
            etime: cfg.params.etime || '',
            session: cfg.params.count ? cfg.params.count.id : 'count',
            session_filter: cfg.params.session_filter ? cfg.params.session_filter.id : 'false',
            daygroup: cfg.params.daygroup ? cfg.params.daygroup.id : 'all' ,
            locations: cfg.params.location ? cfg.params.location.id : 'all',
            activities: cfg.params.activity.type ? (cfg.params.activity.type + '-' + cfg.params.activity.id) : 'all'
          },
          timeout: cfg.timeoutPromise.promise
        };

        $http.get(url, options).success(function(data) {
          processor.get(data, cfg.acts, cfg.locs).then(function (processedData) {
            dfd.resolve(processedData);
          }, function (data) {
            dfd.reject(data);
          });
        }).error(function(data, status, headers, config){
          if (status === 0) {
            dfd.reject({
              message: 'Data.getData Timeout',
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
            message: 'Data.getData Timeout',
            code: 0
          });
          cfg.timeoutPromise.resolve();
        }, cfg.timeout);

        return dfd.promise;
      }
    };
  });
