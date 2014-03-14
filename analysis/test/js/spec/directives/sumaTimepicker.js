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
    element.find('input').val('0100');
    element.find('.input-group').trigger('dp.change');

    // Assertions
    expect(linkScope.model).to.equal('0100');
  });

  it('should call setDate and show on model change', function () {
    // Stub setDate and show
    var setDateStub = sinon.stub(element.find('.input-group').data('DateTimePicker'), 'setDate'),
        showStub = sinon.stub(element.find('.input-group').data('DateTimePicker'), 'show');

    // Trigger event via click
    element.find('.input-group-addon').click();

    // Assertions
    expect(element.find('.input-group').data('DateTimePicker').setDate).to.be.calledOnce;
    expect(element.find('.input-group').data('DateTimePicker').show).to.be.calledOnce;

    // Restore stubs
    setDateStub.restore();
    showStub.restore();
  });
});
