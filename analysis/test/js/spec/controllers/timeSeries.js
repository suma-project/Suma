'use strict';

describe('Controller: TimeSeriesCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var TimeSeriesCtrl,
    scope,
    Initiatives,
    Data,
    ActsLocs,
    ErrorDispatcher,
    UIStates,
    statesStub,
    initiativesStub,
    dataStub,
    errorDispatcherStub,
    actsLocsStub,
    okResponse,
    errorResponse,
    dataResponse,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, initiatives, errorDispatcher, uiStates, data, $q, $location, actsLocs) {
    scope = $rootScope.$new();
    Initiatives = initiatives;
    Data = data;
    ErrorDispatcher = errorDispatcher;
    UIStates = uiStates;
    location = $location;
    ActsLocs = actsLocs;

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

    dataResponse = function () {
      var dfd = $q.defer();
      dfd.resolve({success: true, barChartData: {title:'title'}, actsLocsData: {items:[{title: 'title'}, {title: 'title'}, {title: 'title'}]}});
      return dfd.promise;
    };

    initiativesStub = sinon.stub(Initiatives, 'get');
    dataStub = sinon.stub(Data, 'get');

    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    errorDispatcherStub = sinon.stub(ErrorDispatcher, 'dispatch');
    errorDispatcherStub.returns(true);
  }));

  afterEach(function () {
    statesStub.restore();
    errorDispatcherStub.restore();
    initiativesStub.restore();
    dataStub.restore();
  });

  it(':initialize should set UI state to initial', inject(function ($controller) {
    initiativesStub.returns(okResponse());
    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });

    expect(UIStates.setUIState).to.be.calledWithExactly('initial', scope);
  }));

  it(':initialize should set default values', inject(function ($controller) {
    initiativesStub.returns(okResponse());

    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });

    expect(scope.params).to.be.an('object');
    expect(scope.countOptions).to.deep.equal([{id: 'count', title: 'Count Date'}, {id: 'start', title: 'Session Start'}, {id: 'end', title: 'Session End'}]);
    expect(scope.dayOptions).to.deep.equal([{id: 'all', title: 'All'}, {id: 'weekdays', title: 'Weekdays Only'}, {id: 'weekends', title: 'Weekends Only'}]);
    expect(scope.sessionOptions).to.deep.equal([{id: 'false', title: 'No'}, {id: 'true', title: 'Yes'}]);
    expect(scope.params.count).to.deep.equal({id: 'count', title: 'Count Date'});
    expect(scope.params.daygroup).to.deep.equal({id: 'all', title: 'All'});
    expect(scope.params.session_filter).to.deep.equal({id: 'false', title: 'No'});
    expect(scope.params.sdate).to.equal(moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD'));
    expect(scope.params.edate).to.equal(moment().add('days', 1).format('YYYY-MM-DD'));
  }));

it(':initialize should assign initiaives to scope', inject(function ($controller) {
  initiativesStub.returns(okResponse());

  TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
    $scope: scope
  });

  scope.$digest();
  expect(scope.inits).to.deep.equal({success: true})
}));

  it(':initialize should dispatch an error if Initiatives.get fails', inject(function ($controller) {
    initiativesStub.returns(errorResponse());

    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });

    scope.$digest();
    expect(scope.inits).to.equal(undefined);
    expect(errorDispatcherStub).to.have.been.calledOnce;
    expect(errorDispatcherStub).to.have.been.calledWith({error:true});
  }));

  it(':submit should assign data to scope and set state to success', inject(function($controller) {
    initiativesStub.returns(okResponse());
    dataStub.returns(dataResponse());

    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });

    scope.submit();
    scope.$digest();

    expect(UIStates.setUIState).to.be.calledWith('success');
    expect(scope.data.success).to.equal(true);
  }));

  it(':submit should dispatch an error if Data.get fails', inject(function($controller) {
    initiativesStub.returns(okResponse());
    dataStub.returns(errorResponse());

    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });

    scope.submit();
    scope.$digest();

    expect(scope.data).to.equal(undefined);
    expect(errorDispatcherStub).to.have.been.calledOnce;
    expect(errorDispatcherStub).to.have.been.calledWith({error:true});
  }));

  it(':scrollTo should set locationHash', inject(function ($controller) {
    initiativesStub.returns(okResponse());
    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });

    scope.scrollTo(12345);
    scope.$digest();

    expect(location.hash(12345).$$hash).to.deep.equal(12345)
  }));

  // it(':updateMetadata should respond to init changes', inject(function ($controller) {
  //   initiativesStub.returns(okResponse());
  //   TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
  //     $scope: scope
  //   });

  //   scope.updateMetadata();
  //   scope.$digest();
  //   expect(scope.processMetadata).to.equal(undefined);


  // }));
});
