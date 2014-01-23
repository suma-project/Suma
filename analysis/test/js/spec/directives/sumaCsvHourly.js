'use strict';

describe('Directive: sumaCsvHourly', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('csvHourlyMock'));

  // load the directive's template
  beforeEach(module('views/directives/csv.html'));

  var element,
      scope,
      testLink,
      Ctrlscope;

  beforeEach(inject(function ($rootScope, $compile, mockData, mockLink) {
    element = angular.element('<span data-suma-csv-hourly data-data="data"></span>');
    testLink = mockLink;

    scope = $rootScope.$new();
    scope.data = mockData;

    element = $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();
  }));

  it('should attach a data url to the element', function () {
    Ctrlscope.download(scope.data);
    expect(Ctrlscope.href).to.equal(testLink);
  });
});
