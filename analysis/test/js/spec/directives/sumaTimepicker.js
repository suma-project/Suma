'use strict';

describe('Directive: sumaTimepicker', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/timepicker.html'));

  var element,
    linkScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div suma-timepicker model="params.stime" placeholder="00:00"></div>');

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    scope.$apply(function() {
      scope.params = {};
      scope.params.stime = '';
    });

    linkScope = element.isolateScope();
  }));

  it('should update scope.model on change', function () {
    element.find('input').val('updated value');
    element.find('.input-group').trigger('change.dp');

    // Assertions
    expect(linkScope.model).to.equal('updated value');
  });
});
