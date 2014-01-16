'use strict';

angular.module('sumaAnalysis')
  .directive('sumaPopover', function () {
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
