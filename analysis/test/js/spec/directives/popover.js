'use strict';

describe('Directive: popover', function () {
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
      '<label for="initiatives" class="suma-popover" data-title="Select Initiative" data-content="Select an initiative to reveal additional filters." popover>Select an Initiative</label>'
    )
    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();
  }));

  it('should attach popover listener to element', inject(function ($compile) {
    expect($.fn.popover).to.be.calledOnce;
    expect($.fn.popover).to.be.calledWith({
      trigger: 'hover',
      delay: 300,
      placement: 'top'
    });
    stub.restore();
  }));
});
