'use strict';

describe('Directive: sumaCsvRawUnprocessed', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('csvRawUnprocessedMock'));

  // load the directive's template
  beforeEach(module('views/directives/csv.html'));

  var element,
      scope,
      Ctrlscope,
      MockRawLink,
      MockRawActs;

  beforeEach(inject(function ($rootScope, $compile, mockRawData, mockRawLink, mockRawActs) {
    element = angular.element('<div suma-csv-raw-unprocessed data="data" params="params" acts="acts"></div>');
    MockRawLink = mockRawLink;
    MockRawActs = mockRawActs;

    scope = $rootScope.$new();
    scope.data = mockRawData;
    scope.params = {};
    scope.params.startHour = {id: '0000', title: '12:00 AM'};
    scope.params.init = {title: 'Sample Reference Initiative'};
    scope.params.sdate = '2015-03-09';
    scope.params.edate = '2015-07-09';
    scope.acts = MockRawActs;

    element = $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();
  }));

  it('should attach a data url to the element', function () {
    Ctrlscope.download(scope.data, scope.params);
    expect(Ctrlscope.href).to.equal(MockRawLink);
  });
});
