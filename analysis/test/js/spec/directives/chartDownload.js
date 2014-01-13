'use strict';

describe('Directive: chartDownload', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  // load the directive's template
  beforeEach(module('views/directives/chartDownload.html'));

  var element,
    scope,
    ctrlScope,
    stub;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element(
      '<chart-download chart="#chart-1" title="suma_timeseries_chart.png" filter=".sub-graph"></chart-download>'
    );

    scope = $rootScope.$new();

    $compile(element)(scope);
    scope.$digest();

    ctrlScope = element.isolateScope();
  }));

  it('should call download when clicked', inject(function () {
    stub = sinon.stub(ctrlScope, 'download');
    stub.returns(true);

    element.find('a')[0].click()

    expect(stub).to.be.calledOnce();
    stub.restore();
  }));
});
