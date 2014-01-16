'use strict';

describe('Directive: sumaTimeSeriesChart', function () {
  // load the directive's module
    beforeEach(module('sumaAnalysis'));

    var element,
        scope,
        linkScope,
        renderStub;

    beforeEach(inject(function ($rootScope, $compile) {
      element = angular.element('<suma-time-series-chart id="chart-1" data="data.timeSeriesData" ng-show="success"></suma-time-series-chart>');

      scope = $rootScope.$new();

      element = $compile(element)(scope);
      scope.$digest();

      linkScope = element.isolateScope();
    }));

    it('should respond to data change and call render', inject(function ($compile) {
      renderStub = sinon.stub(linkScope, 'render');
      renderStub.returns(true);

      scope.$apply(function() {
        scope.data = {};
        scope.data.timeSeriesData = [1, 2, 3, 4];
      });

      scope.$apply(function() {
        scope.data.timeSeriesData = [5, 6, 7, 8];
      });

      expect(renderStub).to.be.calledTwice();

      renderStub.restore();
    }));
});
