'use strict';

describe('Directive: sumaHourlyCalendarChart', function () {

  // load the directive's module
    beforeEach(module('sumaAnalysis'));

    var element,
        scope,
        linkScope;

    beforeEach(inject(function ($rootScope, $compile) {
      element = angular.element('<div suma-hourly-calendar-chart id="chart-2" data="data.data" stats="stats" ng-show="success"></div>');

      scope = $rootScope.$new();

      element = $compile(element)(scope);
      scope.$digest();

      linkScope = element.isolateScope();
    }));

    it('should respond to data change and call render', function () {
      var renderStub,
          statsStub;

      // Stub render method
      renderStub = sinon.stub(linkScope, 'render');
      renderStub.returns(true);

      // Stub updateStats method
      statsStub = sinon.stub(linkScope, 'updateStats');
      statsStub.returns(true);

      scope.$apply(function() {
        scope.data = {};
        scope.data.data = [1, 2, 3, 4];
      });

      scope.$apply(function() {
        scope.data.data = [5, 6, 7, 8];
      });

      // Assertions
      expect(renderStub).to.be.calledTwice();
      expect(statsStub).to.be.calledTwice();

      // Restore stubs
      renderStub.restore();
      statsStub.restore();
    });
  });
