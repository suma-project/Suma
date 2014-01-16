'use strict';

angular.module('sumaAnalysis')
  .directive('sumaDatepicker', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/datepicker.html',
      scope: {model: '='},
      link: function postLink(scope, el, attrs) {
        el.find('.input-group').datetimepicker({
          defaultDate: scope.model,
          pickDate: true,
          pickTime: false
        });

        el.find('.input-group').on('change.dp', function () {
          scope.$apply(function () {
            scope.model = el.find('input').val();
          });
        });
      }
    };
  });
