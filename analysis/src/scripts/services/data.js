'use strict';

angular.module('sumaAnalysis')
  .factory('data', function ($http, $q, $timeout, processTimeSeriesData, processCalendarData, processHourlyData, processSessionsData, processRawData) {
    return {
      getRawData: function (cfg) {
        var dfd,
            options,
            self = this,
            url;

        dfd = $q.defer();
        url = 'lib/php/rawDataResults.php';

        options = {
          'params': {
            'id'   : cfg.params.init.id,
            'sdate': cfg.params.sdate || '',
            'edate': cfg.params.edate || '',
            'stime': cfg.params.stime || '',
            'etime': cfg.params.etime || ''
          },
          timeout: cfg.timeoutPromise.promise
        };

        this.httpSuccess = function (response) {
          processRawData.get(response.data).then(function (processedData) {
            dfd.resolve(processedData);
          });
        };

        this.httpError = function (response) {
          if (response.status === 0) {
            dfd.reject({
              message: 'Data.getSessionsData Timeout',
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
            message: 'Data.getSessionsData Timeout',
            code: 0
          });
          cfg.timeoutPromise.resolve();
        }, cfg.timeout);

        return dfd.promise;
      },
      getSessionsData: function (cfg) {
        var dfd,
            options,
            self = this,
            url;

        dfd = $q.defer();
        url = 'lib/php/sessionsResults.php';

        options = {
          'params': {
            'id'   : cfg.params.init.id,
            'sdate': cfg.params.sdate || '',
            'edate': cfg.params.edate || '',
            'stime': cfg.params.stime || '',
            'etime': cfg.params.etime || ''
          },
          timeout: cfg.timeoutPromise.promise
        };

        this.httpSuccess = function (response) {
          processSessionsData.get(response.data).then(function (processedData) {
            dfd.resolve(processedData);
          });
        };

        this.httpError = function (response) {
          if (response.status === 0) {
            dfd.reject({
              message: 'Data.getSessionsData Timeout',
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
            message: 'Data.getSessionsData Timeout',
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
            self = this,
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
            id            : cfg.params.init.id,
            sdate         : cfg.params.sdate || '',
            edate         : cfg.params.edate || '',
            stime         : cfg.params.stime || '',
            etime         : cfg.params.etime || '',
            startHour     : cfg.params.startHour      ? cfg.params.startHour.id             : null,
            classifyCounts: cfg.params.classifyCounts ? cfg.params.classifyCounts.id        : null,
            wholeSession  : cfg.params.wholeSession   ? cfg.params.wholeSession.id          : null,
            days          : cfg.params.days           ? cfg.params.days.join(',')           : null,
            excludeLocs   : cfg.params.excludeLocs    ? cfg.params.excludeLocs.join(',')    : null,
            excludeActs   : cfg.params.excludeActs    ? cfg.params.excludeActs.join(',')    : null,
            requireActs   : cfg.params.requireActs    ? cfg.params.requireActs.join(',')    : null,
            excludeActGrps: cfg.params.excludeActGrps ? cfg.params.excludeActGrps.join(',') : null,
            requireActGrps: cfg.params.requireActGrps ? cfg.params.requireActGrps.join(',') : null
          },
          timeout: cfg.timeoutPromise.promise
        };

        this.httpSuccess = function (response) {
          processor.get(response.data, cfg.acts, cfg.locs, cfg.params).then(function (processedData) {
            dfd.resolve(processedData);
          }, self.processorError);
        };

        this.httpError = function (response) {
          if (response.status === 0) {
            dfd.reject({
              message: 'Data.getData Timeout',
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

        this.processorError = function (response) {
          dfd.reject(response);
        };

        $http.get(url, options).then(self.httpSuccess, self.httpError);

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
