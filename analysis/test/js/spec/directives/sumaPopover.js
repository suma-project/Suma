'use strict';

describe('Directive: sumaPopover', function () {
  var element,
    scope,
    stub;

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(inject(function ($rootScope, $compile) {
    // Stub out popover
    stub = sinon.stub($.fn, 'popover');
    stub.returns(true);

    // instantiate directive
    element = angular.element(
      '<label suma-popover>Select an Initiative</label>'
    );
    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();
  }));

  it('should attach popover listener to element', function () {
    expect($.fn.popover).to.be.calledOnce;
    expect($.fn.popover).to.be.calledWith({
      trigger: 'hover',
      delay: 300,
      placement: 'top'
    });
    stub.restore();
  });
});
