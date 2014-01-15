'use strict';

describe('Directive: timepicker', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/timepicker.html'));

  var element,
    linkScope,
    scope,
    stub;

  beforeEach(inject(function ($rootScope, $compile) {
    stub = sinon.stub($.fn, 'datetimepicker');
    stub.returns(true);

    element = angular.element('<timepicker model="params.stime" placeholder="00:00"></timepicker>');

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    scope.$apply(function() {
      scope.params = {};
      scope.params.stime = '';
    });

    linkScope = element.isolateScope();
  }));

  it('should attach timepicker listener to element', inject(function ($compile) {
    expect($.fn.datetimepicker).to.be.calledOnce;
    expect($.fn.datetimepicker).to.be.calledWith({
      defaultDate: moment("00:00", 'HH:mm'),
      pickDate: false,
      pickTime: true,
      icons: {
        time: 'fa fa-clock-o',
        up: 'fa fa-arrow-up',
        down: 'fa fa-arrow-down'
      }
    });
    stub.restore();
  }));

  it('should call scope.$apply on change', inject(function ($compile) {
    element.find('input').val('updated value');
    element.find('.input-group').trigger('change.dp');

    expect(linkScope.model).to.equal('updated value');
  }));
});
