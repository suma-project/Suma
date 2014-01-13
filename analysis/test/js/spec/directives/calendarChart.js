'use strict';

describe('Directive: calendarChart', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
      scope,
      linkScope,
      renderStub,
      statsStub;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<calendar-chart id="chart-1" data="data.data" stats="stats" ng-show="success"></calendar-chart>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
    scope.$digest();

    linkScope = element.isolateScope();
  }));

  it('should respond to data change and call render', inject(function ($compile) {
    renderStub = sinon.stub(linkScope, 'render');
    renderStub.returns(true);

    statsStub = sinon.stub(linkScope, 'updateStats');
    statsStub.returns(true);

    scope.$apply(function() {
      scope.data = {};
      scope.data.data = [1, 2, 3, 4];
    });

    scope.$apply(function() {
      scope.data.data = [5, 6, 7, 8];
    });

    expect(renderStub).to.be.calledTwice();
    expect(statsStub).to.be.calledTwice();

    renderStub.restore();
    statsStub.restore();
  }));
});
