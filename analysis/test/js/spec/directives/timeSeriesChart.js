'use strict';

describe('Directive: timeSeriesChart', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    // element = angular.element('<timeseries-chart></timeseries-chart>');
    // element = $compile(element)(scope);
    // expect(element.text()).toBe('this is the timeseriesChart directive');
    expect(true).to.equal(false)
  }));
});
