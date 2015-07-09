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
        startHourOptions: [
          {id: '0000', title: '12:00 AM'},
          {id: '0100', title: '01:00 AM'},
          {id: '0200', title: '02:00 AM'},
          {id: '0300', title: '03:00 AM'},
          {id: '0400', title: '04:00 AM'},
          {id: '0500', title: '05:00 AM'},
          {id: '0600', title: '06:00 AM'},
          {id: '0700', title: '07:00 AM'},
          {id: '0800', title: '08:00 AM'},
          {id: '0900', title: '09:00 AM'},
          {id: '1000', title: '10:00 AM'},
          {id: '1100', title: '11:00 AM'},
          {id: '1200', title: '12:00 PM'},
          {id: '1300', title: '01:00 PM'},
          {id: '1400', title: '02:00 PM'},
          {id: '1500', title: '03:00 PM'},
          {id: '1600', title: '04:00 PM'},
          {id: '1700', title: '05:00 PM'},
          {id: '1800', title: '06:00 PM'},
          {id: '1900', title: '07:00 PM'},
          {id: '2000', title: '08:00 PM'},
          {id: '2100', title: '09:00 PM'},
          {id: '2200', title: '10:00 PM'},
          {id: '2300', title: '11:00 PM'}
        ],
        startDate: [moment().subtract(4, 'months').format('YYYY-MM-DD')],
        endDate: [moment().format('YYYY-MM-DD')],
        startTime: [''],
        endTime: ['']
      },
      formDefaults: {
        classifyCounts: 'countOptions',
        wholeSession: 'sessionOptions',
        zeroCounts: 'zeroOptions',
        startHour: 'startHourOptions',
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
        startHour: true,
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
          newConfig.formFields.startHour = false;
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
         newConfig.formFields.startHour = false;

         newConfig.dataSource = 'getSessionsData';
         newConfig.dataProcessor = false;
         newConfig.suppWatch = false;

          return newConfig;
        }

        if (path === '/raw') {
         newConfig.formFields.classifyCounts = false;
         newConfig.formFields.days = false;
         newConfig.formFields.wholeSession = false;
         newConfig.formFields.zeroCounts = false;
         newConfig.formFields.activities = true;
         newConfig.formFields.locations = true;
         newConfig.formFields.startHour = false;

         newConfig.dataSource = 'getRawData';
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
