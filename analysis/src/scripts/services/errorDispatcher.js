'use strict';

angular.module('sumaAnalysis')
  .factory('errorDispatcher', function (uiStates) {
    return {
      dispatch: function (data, $scope) {
        uiStates.setUIState('error', $scope);
        $scope.errorMessage = data.message;
        $scope.errorCode = data.code;
      }
    };
  });
