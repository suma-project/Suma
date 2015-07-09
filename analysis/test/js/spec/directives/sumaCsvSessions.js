'use strict';

describe('Directive: sumaCsvSessions', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('csvSessionsMock'));

  // load the directive's template
  beforeEach(module('views/directives/csv.html'));

  var element,
      scope,
      Ctrlscope,
      MockSessionsLink;

  beforeEach(inject(function ($rootScope, $compile, mockSessionsData, mockSessionsLink) {
    element = angular.element('<div suma-csv-sessions data="data" params="params"></div>');
    MockSessionsLink = mockSessionsLink;

    scope = $rootScope.$new();
    scope.data = mockSessionsData;
    scope.params = {};
    scope.params.startHour = {id: '0000', title: '12:00 AM'};
    scope.params.init = {title: 'Sample Reference Initiative'};
    scope.params.sdate = '2015-03-09';
    scope.params.edate = '2015-07-09';

    element = $compile(element)(scope);
    scope.$digest();

    Ctrlscope = element.isolateScope();
  }));

  it('should attach a data url to the element', function () {
    Ctrlscope.download(scope.data, scope.params);
    expect(Ctrlscope.href).to.equal(MockSessionsLink);
  });
});
