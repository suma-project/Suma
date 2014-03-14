'use strict';

angular.module('sumaAnalysis')
  .directive('sumaDatepicker', function ($timeout) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/datepicker.html',
      scope: {model: '='},
      link: function (scope, el, attrs) {
        var inputGroup = el.find('.input-group'),
            inputGroupAddon = el.find('.input-group-addon');

        // Initialize
        inputGroup.datetimepicker({
          defaultDate: scope.model,
          showToday: false,
          pickDate: true,
          pickTime: false,
          format: 'YYYY-MM-DD'
        });

        // Respond to changes from input
        inputGroup.on('dp.change', function () {
          scope.$apply(function () {
            scope.model = el.find('input').val();
          });
        });

        // Respond to changes from model
        inputGroupAddon.on('click', function (e) {
          inputGroup.data('DateTimePicker').setDate(scope.model);
          inputGroup.data('DateTimePicker').show();
        });
      }
    };
  });
