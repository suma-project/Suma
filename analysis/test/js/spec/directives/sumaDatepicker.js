'use strict';

describe('Directive: sumaDatepicker', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/datepicker.html'));

  var element,
    linkScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div suma-datepicker model="params.sdate"></div>');

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    scope.$apply(function() {
      scope.params = {};
      scope.params.sdate = '2014-01-01';
    });

    linkScope = element.isolateScope();
  }));

  it('should update scope.model on change', function () {
    element.find('input').val('updated value');
    element.find('.input-group').trigger('change.dp');

    expect(linkScope.model).to.equal('updated value');
  });
});
