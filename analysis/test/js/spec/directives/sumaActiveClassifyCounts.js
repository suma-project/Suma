'use strict';

describe('Directive: sumaActiveClassifyCounts', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('views/directives/activeClassifyCounts.html'));

  var element,
    linkScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<div suma-active-classify-counts classify-counts="classifyCounts"></div>');

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    linkScope = element.isolateScope();
  }));

  it(':sumaActiveClassifyCounts should set scope.display to false if classifyCounts equals count', function () {
    scope.$apply(function() {
      scope.classifyCounts = {id: 'count'};
    });

    expect(linkScope.display).to.equal(false);
  });

  it(':sumaActiveClassifyCounts should set scope.display to true if classifyCounts equals start', function () {
    scope.$apply(function() {
      scope.classifyCounts = {id: 'start'};
    });

    expect(linkScope.display).to.equal(true);
  });

  it(':sumaActiveClassifyCounts should set scope.display to true if classifyCounts equals end', function () {
    scope.$apply(function() {
      scope.classifyCounts = {id: 'end'};
    });

    expect(linkScope.display).to.equal(true);
  });
});
