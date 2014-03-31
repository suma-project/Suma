'use strict';

// taken from http://stackoverflow.com/a/14519881
angular.module('sumaAnalysis')
  .directive('sumaChecklist', function () {
    return {
      scope: {
        list: '=checkList',
        value: '@'
      },
      link: function(scope, elem, attrs) {
        var handler,
            setupHandler,
            changeHandler;

        handler = function(setup) {
          var checked,
              index;

          checked = elem.prop('checked');
          index = scope.list.indexOf(scope.value);

          if (checked && index === -1) {
            if (setup) {
              elem.prop('checked', false);
            } else {
              scope.list.push(scope.value);
            }
          } else if (!checked && index !== -1) {
            if (setup) {
              elem.prop('checked', true);
            } else {
              scope.list.splice(index, 1);
            }
          }
        };

        setupHandler = _.bind(handler, null, true);
        changeHandler = _.bind(handler, null, false);

        elem.on('click', function() {
          scope.$apply(changeHandler);
        });

        scope.$watch('list', setupHandler, true);
      }
    };
  });
