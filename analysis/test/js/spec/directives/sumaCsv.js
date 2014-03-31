'use strict';

describe('Directive: sumaCsv', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('csvMock'));

  // load the directive's template
  beforeEach(module('views/directives/csv.html'));

  var element,
      scope,
      Ctrlscope,
      MockLink;

  beforeEach(inject(function ($rootScope, $compile, mockData, mockLink) {
    element = angular.element('<div suma-csv data="data"></div>');
    MockLink = mockLink;

    scope = $rootScope.$new();
    scope.data = mockData;

    element = $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();
  }));

  it('should attach a data url to the element', function () {
    Ctrlscope.download(scope.data);
    expect(Ctrlscope.href).to.equal(MockLink);
  });
});
