'use strict';

angular.module('sumaAnalysis')
  .factory('data', function ($http, $q, processTimeSeriesData, processCalendarData, processHourlyData) {
    return {
      get: function (params, acts, locs, dataProcessor) {
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
            'session': params.count.id || 'count',
            'session_filter': params.session_filter.id || 'false',
            'sdate': params.sdate || '',
            'edate': params.edate || '',
            'stime': params.stime || '',
            'etime': params.etime || '',
            'daygroup': params.daygroup.id || 'all' ,
            'locations': params.location.id || 'all',
            'activities': params.activity.id === 'all' ? 'all' : (params.activity.type + '-' + params.activity.id) || 'all'
          }
        };

        $http.get(url, options).success(function(data) {
          processor.get(data, acts, locs).then(function (processedData) {
            dfd.resolve(processedData);
          });
        }).error(function(data, status, headers, config){
          dfd.reject({message: data.message, code: status});
        });

        return dfd.promise;
      }
    };
  });
