'use strict';

describe('Directive: sumaActiveActs', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/activeActs.html'));

  var element,
    linkScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div suma-active-acts acts="activities"></div>');

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    linkScope = element.isolateScope();
  }));

  it(':sumaActiveActs should set scope.display to false if all acts are allowed', function () {
    scope.$apply(function() {
      scope.activities = [
        {filter: 'allow'},
        {filter: 'allow'},
        {filter: 'allow'}
      ];
    });

    expect(linkScope.display).to.equal(false);
  });

  it(':sumaActiveActs should set scope.display to true if some acts are required', function () {
    scope.$apply(function() {
      scope.activities = [
        {filter: 'allow'},
        {filter: 'require'},
        {filter: 'allow'}
      ];
    });

    expect(linkScope.display).to.equal(true);
  });

  it(':sumaActiveActs should set scope.display to true if some acts are excluded', function () {
    scope.$apply(function() {
      scope.activities = [
        {filter: 'allow'},
        {filter: 'allow'},
        {filter: 'exclude'}
      ];
    });

    expect(linkScope.display).to.equal(true);
  });
});
