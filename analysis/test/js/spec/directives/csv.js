'use strict';

describe('Directive: csv', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<csv></csv>');
    element = $compile(element)(scope);
    expect(true).to.equal(false);
  }));
});
