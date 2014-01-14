'use strict';

describe('Controller: HourlyCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var HourlyCtrl,
      scope,
      Initiatives,
      ErrorDispatcher,
      UIStates;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, initiatives, errorDispatcher, uiStates) {
    scope = $rootScope.$new();
    Initiatives = initiatives;
    ErrorDispatcher = errorDispatcher;
    UIStates = uiStates;

    HourlyCtrl = $controller('HourlyCtrl', {
      $scope: scope
    });
  }));

  it(':initialize should set UI state to initial', function () {
    var statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    scope.initialize();
    expect(UIStates.setUIState).to.be.calledWithExactly('initial', scope);

    statesStub.restore();
  });

  it(':initialize should set default values', function () {
    scope.initialize();
    expect(scope.params).to.be.an('object');
    expect(scope.countOptions).to.deep.equal([{id: 'count', title: 'Count Date'}, {id: 'start', title: 'Session Start'}, {id: 'end', title: 'Session End'}]);
    expect(scope.dayOptions).to.deep.equal([{id: 'all', title: 'All'}, {id: 'weekdays', title: 'Weekdays Only'}, {id: 'weekends', title: 'Weekends Only'}]);
    expect(scope.sessionOptions).to.deep.equal([{id: 'false', title: 'No'}, {id: 'true', title: 'Yes'}]);
    expect(scope.params.count).to.deep.equal({id: 'count', title: 'Count Date'});
    expect(scope.params.daygroup).to.deep.equal({id: 'all', title: 'All'});
    expect(scope.params.session_filter).to.deep.equal({id: 'false', title: 'No'});
    expect(scope.params.sdate).to.equal(moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD'));
    expect(scope.params.edate).to.equal(moment().add('days', 1).format('YYYY-MM-DD'));
  });
});
