'use strict';

angular.module('sumaAnalysis')
  .directive('timepicker', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/timepicker.html',
      scope: {model: '=', placeholder: '@'},
      link: function postLink(scope, el, attrs) {
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

        el.find('.input-group').on('change.dp', function () {
          scope.$apply(function () {
            scope.model = el.find('input').val();
          });
        });
      }
    };
  });
