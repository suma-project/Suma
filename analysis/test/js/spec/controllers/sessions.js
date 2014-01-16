'use strict';

describe('Controller: SessionsCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var scope,
      Initiatives,
      SessionsData,
      ErrorDispatcher,
      UIStates,
      statesStub,
      initiativesStub,
      sessionsStub,
      errorDispatcherStub,
      okResponse,
      errorResponse;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, initiatives, errorDispatcher, uiStates, sessionsData, $q) {
    scope = $rootScope.$new();
    Initiatives = initiatives;
    SessionsData = sessionsData;
    ErrorDispatcher = errorDispatcher;
    UIStates = uiStates;

    okResponse = function () {
      var dfd = $q.defer();
      dfd.resolve({success: true});
      return dfd.promise;
    };

    errorResponse = function () {
      var dfd = $q.defer();
      dfd.reject({error: true});
      return dfd.promise;
    };

    initiativesStub = sinon.stub(Initiatives, 'get');
    sessionsStub = sinon.stub(SessionsData, 'get');

    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    errorDispatcherStub = sinon.stub(ErrorDispatcher, 'dispatch');
    errorDispatcherStub.returns(true);
  }));

  afterEach(function () {
    statesStub.restore();
    errorDispatcherStub.restore();
    initiativesStub.restore();
    sessionsStub.restore();
  });

  it(':initialize should set UI state to initial', inject(function ($controller) {
    var SessionsCtrl;

    initiativesStub.returns(okResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });

    expect(UIStates.setUIState).to.be.calledWithExactly('initial', scope);
  }));

  it(':initialize should set default values', inject(function ($controller) {
    var SessionsCtrl;

    initiativesStub.returns(okResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    }),

    expect(scope.params).to.be.an('object');
    expect(scope.params.sdate).to.equal(moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD'));
    expect(scope.params.edate).to.equal(moment().add('days', 1).format('YYYY-MM-DD'));
  }));

  it(':initialize should assign initiaives to scope', inject(function ($controller) {
    var SessionsCtrl;

    initiativesStub.returns(okResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });

    scope.$digest();
    expect(scope.inits).to.deep.equal({success: true})
  }));

  it(':initialize should dispatch an error if Initiatives.get fails', inject(function ($controller) {
    var SessionsCtrl;

    initiativesStub.returns(errorResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });

    scope.$digest();
    expect(scope.inits).to.equal(undefined);
    expect(errorDispatcherStub).to.have.been.calledOnce;
    expect(errorDispatcherStub).to.have.been.calledWith({error:true});
  }));

  it(':submit should setUIState to loading', inject(function($controller) {
    var SessionsCtrl;

    initiativesStub.returns(okResponse());
    sessionsStub.returns(okResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });

    scope.submit();

    expect(UIStates.setUIState).to.be.calledWith('loading');
  }));

  it(':submit should assign data to scope and set state to success', inject(function($controller) {
    var SessionsCtrl;

    initiativesStub.returns(okResponse());
    sessionsStub.returns(okResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });

    scope.submit();
    scope.$digest();

    expect(UIStates.setUIState).to.be.calledWith('success');
    expect(scope.data).to.deep.equal({success:true});
  }));

  it(':submit should dispatch an error if SessionsData.get fails', inject(function($controller) {
    var SessionsCtrl;

    initiativesStub.returns(okResponse());
    sessionsStub.returns(errorResponse());

    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });

    scope.submit();
    scope.$digest();

    expect(scope.data).to.equal(undefined);
    expect(errorDispatcherStub).to.have.been.calledOnce;
    expect(errorDispatcherStub).to.have.been.calledWith({error:true});
  }));
});
