'use strict';

angular.module('sumaAnalysis')
  .service('validation', function Validation() {
    this.isNumber = function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    this.validateAct = function (acts, dict, mode) {
      var test,
          validIds;

      // Get list of valid ids
      validIds = _.pluck(_.filter(dict, {type: mode}), 'id');

      // Default to valid
      test = true;

      // Is each activity a member of the validIds array?
      _.each(acts, function (act) {
        if (!_.contains(validIds, parseInt(act, 10)) && act !== '') {
          test = false;
        }
      });

      return test;
    };

    this.validateDateTime = function (value, maxLength, pad) {
      var stripped,
          val;

      // Cast value to string
      val = String(value);

      // Empty strings are valid
      if (val === '') {
        return true;
      }

      // Remove punctuation
      stripped = val.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');

      // Pad with 0 if flag is true and length is 3 (times)
      if (pad && stripped.length === 3) {
        stripped = '0' + stripped;
      }

      // Values that are numeric and have a length of either 0 or the max are valid
      if (this.isNumber(stripped) && (stripped.length === 0 || stripped.length === maxLength)) {
        return true;
      }

      // String is invalid
      return false;
    };
  });
