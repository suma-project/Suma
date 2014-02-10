'use strict';

angular.module('sumaAnalysis')
  .factory('setScope', function ($q, actsLocs, validation) {
    var metadata,
        activities,
        locations;

    return {
      getMetadata: function (init) {
        metadata = actsLocs.get(init);

        activities = metadata.activities;
        locations = metadata.locations;
      },
      set: function (urlParams, sumaConfig, inits) {
        var dfd = $q.defer();
        var newParams = {};
        var errors = [];

        newParams.init = _.find(inits, function (e, i) {
          return String(e.id) === String(urlParams.id);
        });

        if (!newParams.init) {
          dfd.reject({message: 'Initiative ID Not Found.', code: 500});
        } else {

          if (sumaConfig.formFields.classifyCounts) {
            newParams.classifyCounts = _.find(sumaConfig.formData.countOptions, function (e, i) {
              return String(e.id) === String(urlParams.classifyCounts);
            });

            if (!newParams.classifyCounts) {
              errors.push('Invalid value for classifyCounts. Valid values are "count", "start", or "end".');
            }
          }

          if (sumaConfig.formFields.wholeSession) {
            newParams.wholeSession = _.find(sumaConfig.formData.sessionOptions, function (e, i) {
              return String(e.id) === String(urlParams.wholeSession);
            });

            if (!newParams.wholeSession) {
              errors.push('Invalid value for wholeSession. Valid values are "yes" or "no".');
            }
          }

          if (sumaConfig.formFields.daygroup) {
            newParams.daygroup = _.find(sumaConfig.formData.dayOptions, function (e, i) {
              return String(e.id) === String(urlParams.daygroup);
            });

            if (!newParams.daygroup) {
              errors.push('Invalid value for daygroup. Valid values are "all", "weekends", or "weekdays".');
            }
          }

          if (sumaConfig.formFields.activities || sumaConfig.formFields.locations) {
            this.getMetadata(newParams.init);
          }

          if (sumaConfig.formFields.activities) {
            newParams.activity = _.find(activities, function (e, i) {
              var type,
                  id;

              if (urlParams.activity === 'all') {
                return String(e.id) === String(urlParams.activity);
              } else {
                type = urlParams.activity.split('-')[0];
                id = urlParams.activity.split('-')[1];

                return String(e.id) === String(id) && String(e.type) === String(type);
              }
            });

            if (!newParams.activity) {
              errors.push('Invalid value for activity.');
            }
          }

          if (sumaConfig.formFields.locations) {
            newParams.location = _.find(locations, function (e, i) {
              return String(e.id) === String(urlParams.location);
            });

            if (!newParams.location) {
              errors.push('Invalid value for location.');
            }
          }

          if (sumaConfig.formFields.sdate) {
            // Validate sdate
            if (validation.validateDateTime(urlParams.sdate, 8)) {
              newParams.sdate = urlParams.sdate;
            } else {
              errors.push('Invalid value for sdate. Should be numeric and either 0 or 8 characters in length, not counting punctuation.');
            }
          }

          if (sumaConfig.formFields.edate) {
            // Validate edate
            if (validation.validateDateTime(urlParams.edate, 8)) {
              newParams.edate = urlParams.edate;
            } else {
              errors.push('Invalid value for edate. Should be numeric and either 0 or 8 characters in length, not counting punctuation.');
            }
          }

          if (sumaConfig.formFields.stime) {
            // Validate stime
            if (validation.validateDateTime(urlParams.stime, 4, true)) {
              newParams.stime = urlParams.stime;
            } else {
              errors.push('Invalid value for stime. Should be numeric and either 0 or 4 characters in length, not counting punctuation.');
            }
          }

          if (sumaConfig.formFields.etime) {
            // Validate etime
            if (validation.validateDateTime(urlParams.etime, 4, true)) {
              newParams.etime = urlParams.etime;
            } else {
              errors.push('Invalid value for etime. Should be numeric and either 0 or 4 characters in length, not counting punctuation.');
            }
          }

          if (errors.length > 0) {
            var msg = 'Query parameter input error. ';
            _.each(errors, function (e) {
              msg = msg + e + ' ';
            });

            dfd.reject({message: msg, code: 500});
          } else {
            dfd.resolve({
              params: newParams,
              actsLocs: metadata,
              locations: locations,
              activities: activities
            });
          }

          return dfd.promise;
        }
      }
    };
  });