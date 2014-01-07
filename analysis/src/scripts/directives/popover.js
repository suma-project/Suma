'use strict';

angular.module('sumaAnalysis')
  .directive('popover', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.popover({
          trigger: 'hover',
          delay: 300,
          placement: 'top'
        });
      }
    };
  });
