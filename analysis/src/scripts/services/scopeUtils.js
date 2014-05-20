'use strict';

angular.module('sumaAnalysis')
  .factory('scopeUtils', function ($q, actsLocs, validation) {
    return {
      stringifyDays: function (days) {
        var string;

        if (!days || days.length === 0) {
          return null;
        }

        string = days.join(',');

        return string;
      },
      stringifyActs: function (acts, filter, actGrpMode) {
        var actAry = [];

        if (actGrpMode) {
          _.each(acts, function (act) {
            if (act.type === 'activityGroup' && act.filter === filter) {
              actAry.push(act.id);
            }
          });
        } else {
          _.each(acts, function (act) {
            if (act.type === 'activity' && act.filter === filter && act.enabled === true) {
              actAry.push(act.id);
            }
          });
        }

        return actAry.join();
      },
      mapActs: function (acts, excludeActGrpsAry, requireActGrpsAry, excludeActsAry, requireActsAry) {
        return _.map(acts, function (act) {
          if (act.type === 'activityGroup') {
            if (_.contains(excludeActGrpsAry, String(act.id))) {
              act.filter = 'exclude';
            } else if (_.contains(requireActGrpsAry, String(act.id))) {
              act.filter = 'require';
            } else {
              act.filter = 'allow';
            }
          } else {
            if (_.contains(excludeActsAry, String(act.id))) {
              act.filter = 'exclude';
            } else if (_.contains(requireActsAry, String(act.id))) {
              act.filter = 'require';
            } else {
              act.filter = 'allow';
            }
          }

          return act;
        });
      },
      getMetadata: function (init) {
        return actsLocs.get(init);
      },
      set: function (urlParams, sumaConfig, inits) {
        var activities,
            dfd = $q.defer(),
            errors = [],
            errorMessage,
            excludeActsAry,
            excludeActGrpsAry,
            locations,
            metadata,
            newParams = {},
            requireActsAry,
            requireActGrpsAry;

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

          if (sumaConfig.formFields.zeroCounts) {
            newParams.zeroCounts = _.find(sumaConfig.formData.zeroOptions, function (e, i) {
              return String(e.id) === String(urlParams.zeroCounts);
            });

            if (!newParams.zeroCounts) {
              errors.push('Invalid value for zeroCounts. Valid values are "yes" or "no".');
            }
          }

          if (sumaConfig.formFields.days) {
            if (urlParams.days) {
              var days = urlParams.days.split(',');
              newParams.days = days;
            } else {
              newParams.days = [];
            }

            if (!newParams.days || newParams.days.length === 0) {
              errors.push('At least one calendar day should be selected. Valid values are "mo", "tu", "we", "th", "fr", "sa", "su". Values should be separated by a comma.');
            }
          }

          if (sumaConfig.formFields.activities || sumaConfig.formFields.locations) {
            metadata = this.getMetadata(newParams.init);
            activities = metadata.activities;
            locations = metadata.locations;
          }

          if (sumaConfig.formFields.activities) {
            excludeActsAry = urlParams.excludeActs || urlParams.excludeActs === '' ? urlParams.excludeActs.split(',') : null;
            requireActsAry = urlParams.requireActs || urlParams.requireActs === '' ? urlParams.requireActs.split(',') : null;
            excludeActGrpsAry = urlParams.excludeActGrps || urlParams.excludeActGrps === '' ? urlParams.excludeActGrps.split(',') : null;
            requireActGrpsAry = urlParams.requireActGrps || urlParams.requireActGrps === '' ? urlParams.requireActGrps.split(',') : null;

            // validate excludeActs
            if (validation.validateAct(excludeActsAry, activities, 'activity')) {
              newParams.excludeActs = excludeActsAry;
            } else {
              newParams.excludeActs = '';
              errors.push('Invalid value for excludeActs.');
            }

            // validate requireActs
            if (validation.validateAct(requireActsAry, activities, 'activity')) {
              newParams.requireActs = requireActsAry;
            } else {
              newParams.requireActs = '';
              errors.push('Invalid value for requireActs.');
            }

            // validate excludeActGrps
            if (validation.validateAct(excludeActGrpsAry, activities, 'activityGroup')) {
              newParams.excludeActGrps = excludeActGrpsAry;
            } else {
              newParams.excludeActGrps = '';
              errors.push('Invalid value for excludeActGrps.');
            }

            // validate requireActGrps
            if (validation.validateAct(requireActGrpsAry, activities, 'activityGroup')) {
              newParams.requireActGrps = requireActGrpsAry;
            } else {
              newParams.requireActGrps = '';
              errors.push('Invalid value for requireActGrps.');
            }

            activities = this.mapActs(activities, excludeActGrpsAry, requireActGrpsAry, excludeActsAry, requireActsAry);
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
              newParams.sdate = '';
              errors.push('Invalid value for sdate. Should be numeric and either 0 or 8 characters in length, not counting punctuation.');
            }
          }

          if (sumaConfig.formFields.edate) {
            // Validate edate
            if (validation.validateDateTime(urlParams.edate, 8)) {
              newParams.edate = urlParams.edate;
            } else {
              newParams.edate = '';
              errors.push('Invalid value for edate. Should be numeric and either 0 or 8 characters in length, not counting punctuation.');
            }
          }

          if (sumaConfig.formFields.stime) {
            // Validate stime
            if (validation.validateDateTime(urlParams.stime, 4, true)) {
              newParams.stime = urlParams.stime;
            } else {
              newParams.stime = '';
              errors.push('Invalid value for stime. Should be numeric and either 0 or 4 characters in length, not counting punctuation.');
            }
          }

          if (sumaConfig.formFields.etime) {
            // Validate etime
            if (validation.validateDateTime(urlParams.etime, 4, true)) {
              newParams.etime = urlParams.etime;
            } else {
              newParams.etime = '';
              errors.push('Invalid value for etime. Should be numeric and either 0 or 4 characters in length, not counting punctuation.');
            }
          }

          if (errors.length > 0) {
            errorMessage = 'Query parameter input error. ';

            _.each(errors, function (e) {
              errorMessage = errorMessage + e + ' ';
            });
          }

          dfd.resolve({
            params: newParams,
            actsLocs: metadata,
            locations: locations,
            activities: activities,
            errorMessage: errorMessage
          });
        }

        return dfd.promise;
      }
    };
  });