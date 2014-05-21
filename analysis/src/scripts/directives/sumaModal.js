'use strict';

angular.module('sumaAnalysis')
  .directive('sumaModal', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/modal.html',
      transclude: true,
      scope: {
        modalId: '@',
        modalTitle: '@',
        modalSaveText: '@'
      },
      link: function (scope, el, attrs) {
        var tgt = $('#' + scope.modalId);

        // Initialize modal
        $(tgt).modal({
          show: false
        });

        // Hide modal when navigating between pages
        scope.$on('$locationChangeSuccess', function (e) {
          $(tgt).modal('hide');
        });
      }
    };
  });
