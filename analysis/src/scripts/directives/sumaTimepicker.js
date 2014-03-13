'use strict';

angular.module('sumaAnalysis')
  .directive('sumaTimepicker', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/timepicker.html',
      scope: {model: '=', placeholder: '@'},
      link: function (scope, el, attrs) {
        // Initialize
        el.find('.input-group').datetimepicker({
          defaultDate: moment(scope.placeholder, 'HH:mm'),
          pickDate: false,
          pickTime: true,
          icons: {
            time: 'fa fa-clock-o',
            up: 'fa fa-arrow-up',
            down: 'fa fa-arrow-down'
          }
        });

        // Respond to changes from input
        el.find('.input-group').on('change.dp', function () {
          scope.$apply(function () {
            scope.model = el.find('input').val();
          });
        });

        // Respond to changes from model
        scope.$watch('model', function () {
          el.find('.input-group').data('DateTimePicker').setDate(moment(scope.model, 'HH:mm'));
        }, true);
      }
    };
  });
