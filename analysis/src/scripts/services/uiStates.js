'use strict';

angular.module('sumaAnalysis')
  .factory('uiStates', function () {
    var states = ['initial', 'loading', 'success', 'error'];

    return {
      setUIState: function (s, $scope) {
        _.each(states, function (state, key) {
          if (s === state) {
            $scope[state] = true;
          } else {
            $scope[state] = false;
          }
        });
      }
    };
  });
