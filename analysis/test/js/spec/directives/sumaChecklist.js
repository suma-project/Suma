'use strict';

describe('Directive: sumaChecklist', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    // instantiate directive
    element = angular.element(
      '<input type="checkbox" value="{{day}}" check-list="params.days" suma-checklist>'
    );

    scope = $rootScope.$new();

    // set scope data
    scope.$apply(function() {
      scope.params = {};

      scope.dayOptions = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

      scope.params.days = [];
      scope.day = 'mo';
    });

    $compile(element)(scope);
    scope.$digest();
  }));

  it('should change scope when selected', function () {
    var input = element[0];

    input.click();
    expect(input.checked).to.equal(true);
    expect(scope.params.days).to.deep.equal(['mo']);

    input.click();
    expect(input.checked).to.equal(false);
    expect(scope.params.days).to.deep.equal([]);
  });

  it('should respond to scope changes', function () {
    var input = element[0];

    scope.params.days=['mo'];
    scope.$apply();
    expect(input.checked).to.equal(true);

    scope.params.days=[];
    scope.$apply();
    expect(input.checked).to.equal(false);
  });
});
