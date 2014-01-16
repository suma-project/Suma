'use strict';

describe('Directive: sumaBarChart', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
      scope,
      linkScope,
      stub;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<suma-bar-chart id="chart-2" data="data.barChartData"></suma-bar-chart>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
    scope.$digest();

    linkScope = element.isolateScope();
  }));

  it('should respond to data change and call render', inject(function ($compile) {
    stub = sinon.stub(linkScope, 'render');
    stub.returns(true);

    scope.$apply(function() {
      scope.data = {};
      scope.data.barChartData = [1, 2, 3, 4];
    });

    scope.$apply(function() {
      scope.data.barChartData = [5, 6, 7, 8];
    });

    expect(stub).to.be.calledTwice();
    stub.restore();
  }));
});
