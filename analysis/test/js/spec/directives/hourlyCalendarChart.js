'use strict';

describe('Directive: hourlyCalendarChart', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hourly-calendar-chart></hourly-calendar-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the hourlyCalendarChart directive');
  }));
});
