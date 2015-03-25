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
          format: 'YYYY-MM-DD',
          icons: {
            previous: 'fa fa-arrow-left',
            next: 'fa fa-arrow-right'
          }
        });

        // Respond to changes from input
        inputGroup.on('dp.change', function () {
          scope.$apply(function () {
            scope.model = el.find('input').val();
          });
        });

        // Respond to changes from model
        inputGroupAddon.on('click', function (e) {
          inputGroup.data('DateTimePicker').date(scope.model);
          inputGroup.data('DateTimePicker').show();
        });
      }
    };
  });
