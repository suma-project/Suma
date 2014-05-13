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
      stringifyActs: function (actGrps, filter, actGrpMode) {
        var actAry = [];

        if (actGrpMode) {
          _.each(actGrps, function (actGrp) {
            if (actGrp.filter === filter) {
              actAry.push(actGrp.id);
            }
          });
        } else {
          _.each(actGrps, function (actGrp) {
            _.each(actGrp.children, function (child) {
              if (child.filter === filter && child.enabled === true) {
                actAry.push(child.id);
              }
            });
          });
        }

        return actAry.join();
      },
      getMetadata: function (init) {
        return actsLocs.get(init);
      },
      set: function (urlParams, sumaConfig, inits) {
        function testAct (id, exclude, require) {
          if (_.contains(exclude, id)) {
            return 'exclude';
          } else if (_.contains(require, id)) {
            return 'require';
          } else {
            return 'allow';
          }
        }

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
            excludeActsAry = urlParams.excludeActs.split(',');
            requireActsAry = urlParams.requireActs.split(',');
            excludeActGrpsAry = urlParams.excludeActGrps.split(',');
            requireActGrpsAry = urlParams.requireActGrps.split(',');

            newParams.excludeActs = excludeActsAry;
            newParams.requireActs = requireActsAry;
            newParams.requireActGrps = requireActGrpsAry;
            newParams.excludeActGrps = excludeActGrpsAry;

            // Set act.filter property based on exclude/require arrays
            activities = _.map(activities, function (actGrp, i) {
              actGrp.filter = testAct(String(actGrp.id), excludeActGrpsAry, requireActGrpsAry);
              actGrp.children = _.map(actGrp.children, function(act) {
                act.filter = testAct(String(act.id), excludeActsAry, requireActsAry);
                return act;
              });

              return actGrp;
            });
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