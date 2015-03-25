'use strict';

describe('Directive: sumaDatepicker', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/datepicker.html'));

  var element,
    linkScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    // click event requires position: relative, for some unknown reason
    element = angular.element('<div suma-datepicker model="params.sdate" style="position: relative"></div>');

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
    element.find('input').val('2014-01-02');
    element.find('.input-group').trigger('dp.change');

    expect(linkScope.model).to.equal('2014-01-02');
  });

  it('should call setDate and show on model change', function () {
    // Stub setDate and show
    var setDateStub = sinon.stub(element.find('.input-group').data('DateTimePicker'), 'date'),
        showStub = sinon.stub(element.find('.input-group').data('DateTimePicker'), 'show');

    // Trigger event via click
    element.find('.input-group-addon').click();

    // Assertions
    expect(element.find('.input-group').data('DateTimePicker').date).to.be.calledOnce;
    expect(element.find('.input-group').data('DateTimePicker').show).to.be.calledOnce;

    // Restore stubs
    setDateStub.restore();
    showStub.restore();
  });
});
