'use strict';

describe('Directive: sumaModal', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/modal.html'));

  var element,
    location,
    stub,
    scope;

  beforeEach(inject(function ($rootScope, $compile, $location) {
    stub = sinon.stub($.fn, 'modal');
    stub.returns(true);

    location = $location;

    element = angular.element(
      '<div suma-modal modal-id="sumaModal" modal-title="Limit Activities" modal-save-text="Update"></div>'
    );

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();
  }));

  afterEach(function () {
    stub.restore();
  });

  it('should attach popover listener to element', function () {
    expect($.fn.modal).to.be.calledOnce;
    expect($.fn.modal).to.be.calledWith({
      show: false
    });
  });

  it('should hide modal on location change', function () {
    scope.$broadcast('$locationChangeSuccess');
    expect($.fn.modal).to.be.calledTwice;
    expect($.fn.modal).to.be.calledWith('hide');
  });
});
