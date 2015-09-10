'use strict';

describe('Directive: sumaActiveStartHour', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/activeStartHour.html'));

  var element,
    linkScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div suma-active-start-hour start-hour="startHour"></div>');

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    linkScope = element.isolateScope();
  }));

  it(':sumaActiveStartHour should set scope.display to false if startHour is 0000', function () {
    scope.$apply(function() {
      scope.startHour = {id: '0000'};
    });

    expect(linkScope.display).to.equal(false);
  });

  it(':sumaActiveStartHour should set scope.display to true if startHour is not 0000', function () {
    scope.$apply(function() {
      scope.startHour = {id: '0100'};
    });

    expect(linkScope.display).to.equal(true);
  });
});
