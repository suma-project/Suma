'use strict';

describe('Directive: sumaChartDownload', function () {
  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('chartDownloadMock'));

  // load the directive's template
  beforeEach(module('views/directives/chartDownload.html'));

  it('should add data:image to scope.href', inject(function ($rootScope, $compile, mockChart1) {
    var element,
      Ctrlscope,
      scope;

    $('body').append(mockChart1);
    element = angular.element(
      '<span suma-chart-download chart="#chart-1" title="suma_timeseries_chart.png"></span>'
    );

    scope = $rootScope.$new();

    $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();

    Ctrlscope.download('#chart-1');

    // Assertions
    expect(Ctrlscope.href.split(';')[0]).to.equal('data:image/png');
  }));

  it('should add data:image to scope.href', inject(function ($rootScope, $compile, mockChart2) {
    var element,
      Ctrlscope,
      scope;

    $('body').append(mockChart2);

    element = angular.element(
      '<span suma-chart-download chart="#chart-2" title="suma_timeseries_chart.png" filter=".sub-graph"></span>'
    );

    scope = $rootScope.$new();

    $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();

    Ctrlscope.download('#chart-2', '.sub-graph');

    // Assertions
    expect(Ctrlscope.href.split(';')[0]).to.equal('data:image/png');
  }));
});
