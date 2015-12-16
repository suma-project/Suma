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
    element = angular.element('<div suma-csv data="data" params="params"></div>');
    MockLink = mockLink;

    scope = $rootScope.$new();
    scope.data = mockData;
    scope.params = {};
    scope.params.startHour = {id: '0000', title: '12:00 AM'};
    scope.params.init = {title: 'Test'};
    scope.params.sdate = '2014-01-01';
    scope.params.edate = '2014-01-31';
    scope.params.classifyCounts = {title: 'Test'};
    scope.params.startHour = {title: '0000'};
    scope.params.wholeSession = {title: 'Yes'};
    scope.params.zeroCounts = {title: 'No'};
    scope.params.stime = '';
    scope.params.etime = '';
    scope.params.days = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
    scope.params.excludeLocs = [''];
    scope.params.excludeActs = [''];
    scope.params.requireActs = [''];
    scope.params.excludeActGrps = [''];
    scope.params.requireActGrps = [''];

    element = $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();
  }));

  it('should attach a data url to the element', function () {
    Ctrlscope.download(scope.data, scope.params);
    expect(Ctrlscope.href).to.equal(MockLink);
  });
});
