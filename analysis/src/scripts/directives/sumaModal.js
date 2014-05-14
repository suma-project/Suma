'use strict';

angular.module('sumaAnalysis')
  .directive('sumaModal', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/modal.html',
      transclude: true,
      scope: {
        modalId: '@',
        modalTitle: '@'
      },
      link: function (scope, el, attrs) {
        $('#' + scope.modalId).modal({
          show: false
        });
      }
    };
  });
