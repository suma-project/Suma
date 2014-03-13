'use strict';

angular.module('sumaAnalysis')
  .directive('sumaDatepicker', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/datepicker.html',
      scope: {model: '='},
      link: function (scope, el, attrs) {
        // Initialize
        el.find('.input-group').datetimepicker({
          defaultDate: scope.model,
          pickDate: true,
          pickTime: false
        });

        // Respond to changes from input
        el.find('.input-group').on('change.dp', function () {
          scope.$apply(function () {
            scope.model = el.find('input').val();
          });
        });

        // Respond to changes from model
        scope.$watch('model', function () {
          el.find('.input-group').data('DateTimePicker').setDate(scope.model);
        }, true);
      }
    };
  });
