'use strict';

describe('Directive: sumaCsv', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  // load the directive's template
  beforeEach(module('views/directives/csv.html'));

  var element,
      scope,
      ctrlScope,
      stub;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<suma-csv data="data"></suma-csv>');

    scope = $rootScope.$new();

    element = $compile(element)(scope);
    scope.$digest();

    ctrlScope = element.isolateScope();
  }));

  it('should call download when clicked', inject(function ($compile) {

    stub = sinon.stub(ctrlScope, 'download');
    stub.returns(true);

    element.find('a')[0].click()

    expect(stub).to.be.calledOnce();
    stub.restore();
  }));
});
