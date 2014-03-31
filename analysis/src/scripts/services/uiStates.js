'use strict';

angular.module('sumaAnalysis')
  .factory('uiStates', function () {
    var states = ['initial', 'loading', 'success', 'error'];

    return {
      setUIState: function (s) {
        var newState = {};

        _.each(states, function (state, key) {
          if (s === state) {
            newState[state] = true;
          } else {
            newState[state] = false;
          }
        });

        return newState;
      }
    };
  });
