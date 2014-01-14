'use strict';

describe('Controller: SessionsCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var SessionsCtrl,
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

    SessionsCtrl = $controller('SessionsCtrl', {
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
    expect(scope.params.sdate).to.equal(moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD'));
    expect(scope.params.edate).to.equal(moment().add('days', 1).format('YYYY-MM-DD'));
  });
});
