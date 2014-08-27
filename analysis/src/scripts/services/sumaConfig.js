'use strict';

angular.module('sumaAnalysis')
  .factory('sumaConfig', function () {
    var sumaBaseConfig = {
      formData: {
        countOptions: [
          {id: 'count', title: 'Count Date'},
          {id: 'start', title: 'Session Start'},
          {id: 'end', title: 'Session End'}
        ],
        dayOptions: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        sessionOptions: [
          {id: 'no', title: 'No'},
          {id: 'yes', title: 'Yes'}
        ],
        zeroOptions: [
          {id: 'no', title: 'No'},
          {id: 'yes', title: 'Yes'}
        ],
        startDate: [moment().subtract('months', 4).format('YYYY-MM-DD')],
        endDate: [moment().format('YYYY-MM-DD')],
        startTime: [''],
        endTime: ['']
      },
      formDefaults: {
        classifyCounts: 'countOptions',
        wholeSession: 'sessionOptions',
        zeroCounts: 'zeroOptions',
        sdate: 'startDate',
        edate: 'endDate',
        stime: 'startTime',
        etime: 'endTime'
      },
      formFields: {
        sdate: true,
        edate: true,
        stime: true,
        etime: true,
        classifyCounts: true,
        days: true,
        wholeSession: true,
        zeroCounts: true,
        activities: true,
        locations: true
      },
      dataSource: 'getData',
      dataProcessor: 'processTimeSeriesData',
      suppWatch: true
    };

    return {
      getConfig: function (path) {
        var newConfig = angular.copy(sumaBaseConfig);

        if (path === '/timeseries') {
          return newConfig;
        }

        if (path === '/calendar') {
          newConfig.dataProcessor = 'processCalendarData';
          newConfig.suppWatch = false;

          return newConfig;
        }

        if (path === '/hourly') {
          newConfig.formFields.stime = false;
          newConfig.formFields.etime = false;
          newConfig.dataProcessor = 'processHourlyData';
          newConfig.suppWatch = false;

          return newConfig;
        }

        if (path === '/sessions') {
         newConfig.formFields.classifyCounts = false;
         newConfig.formFields.days = false;
         newConfig.formFields.wholeSession = false;
         newConfig.formFields.zeroCounts = false;
         newConfig.formFields.activities = false;
         newConfig.formFields.locations = false;

         newConfig.dataSource = 'getSessionsData';
         newConfig.dataProcessor = false;
         newConfig.suppWatch = false;

          return newConfig;
        }

        return newConfig;
      },
      setParams: function (cfg) {
        var params = {};

        _.each(cfg.formFields, function (field, fieldName) {
          // Set all fields except acts/locs, which are set after init is selected in form
          if (field && (fieldName !== 'locations' && fieldName !== 'activities' && fieldName !== 'days')) {
            params[cfg.formDefaults[fieldName]] = cfg.formData[cfg.formDefaults[fieldName]];
            params[fieldName] = params[cfg.formDefaults[fieldName]][0];

          } else if (field && fieldName === 'days') {
            params.dayOptions = cfg.formData.dayOptions;
            params.days = angular.copy(params.dayOptions);
          }
        });

        return params;
      }
    };
  });
