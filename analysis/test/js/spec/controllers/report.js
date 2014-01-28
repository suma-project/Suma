'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('reportMock'));

  var ReportCtrl,
    Controller,
    Timeout,
    scope,
    Initiatives,
    Data,
    ActsLocs,
    UIStates,
    statesStub,
    initiativesStub,
    dataStub,
    actsLocsStub,
    okResponse,
    errorResponse,
    dataResponse,
    location,
    SumaConfig,
    SumaConfig2,
    Defaults;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (
    $controller,
    $rootScope,
    initiatives,
    uiStates,
    data,
    $q,
    $location,
    actsLocs,
    $timeout,
    sumaConfig,
    sumaConfig2,
    defaults) {

    scope = $rootScope.$new();
    Controller = $controller;
    Timeout = $timeout;
    Initiatives = initiatives;
    Data = data;
    UIStates = uiStates;
    location = $location;
    ActsLocs = actsLocs;

    SumaConfig = sumaConfig;
    SumaConfig2 = sumaConfig2;
    Defaults = defaults;

    okResponse = function () {
      var dfd = $q.defer();
      dfd.resolve({success: true});
      return dfd.promise;
    };

    errorResponse = function () {
      var dfd = $q.defer();
      dfd.reject({message: 'Error', code: 500});
      return dfd.promise;
    };

    dataResponse = function () {
      var dfd = $q.defer();
      dfd.resolve({
        success: true,
        barChartData: {title:'title'},
        actsLocsData: {items:[
          {title: 'title'},
          {title: 'title'},
          {title: 'title'}
        ]}
      });
      return dfd.promise;
    };

    initiativesStub = sinon.stub(Initiatives, 'get');
    dataStub = sinon.stub(Data, 'getData');

    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);
  }));

  afterEach(function () {
    initiativesStub.restore();
    dataStub.restore();
    statesStub.restore();
  });

  it(':initialize should set UI state to initial', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    expect(UIStates.setUIState).to.be.calledWithExactly('initial');
  });

  it(':initialize should set default values', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    expect(scope.countOptions).to.deep.equal(Defaults.countOptions);
    expect(scope.dayOptions).to.deep.equal(Defaults.dayOptions);
    expect(scope.sessionOptions).to.deep.equal(Defaults.sessionOptions);
    expect(scope.params.count).to.deep.equal(Defaults.count);
    expect(scope.params.daygroup).to.deep.equal(Defaults.daygroup);
    expect(scope.params.session_filter).to.deep.equal(Defaults.sessionFilter);
    expect(scope.params.sdate).to.equal(Defaults.sDate);
    expect(scope.params.edate).to.equal(Defaults.eDate);
  });

  it(':initialize should assign initiaives to scope', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.$digest();
    expect(scope.inits).to.deep.equal({success: true});
  });

  it(':initialize should dispatch an error if Initiatives.get fails', function () {
    initiativesStub.returns(errorResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.$digest();
    expect(scope.inits).to.equal(undefined);
    expect(scope.errorMessage).to.equal('Error');
    expect(scope.errorCode).to.equal(500);
  });

  it(':submit should assign data and set success', function() {
    var setUrlStub;

    initiativesStub.returns(okResponse());
    dataStub.returns(dataResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    setUrlStub = sinon.stub(scope, 'setUrl');
    setUrlStub.returns(true);

    scope.submit();
    scope.$digest();

    expect(UIStates.setUIState).to.be.calledWith('success');
    expect(scope.data.success).to.equal(true);
    expect(setUrlStub).to.be.calledOnce;

    setUrlStub.restore();
  });

  it(':submit should assign data, set success, and assign watch', function() {
    var watchStub = sinon.stub(scope, '$watch'),
        setUrlStub;

    watchStub.returns(true);
    initiativesStub.returns(okResponse());
    dataStub.returns(dataResponse());

    scope.data = {};
    scope.data.actsLocsData = {hello: 'hi'};

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig2
    });

    setUrlStub = sinon.stub(scope, 'setUrl');
    setUrlStub.returns(true);

    scope.submit();
    scope.$digest();

    expect(scope.$watch).to.not.be.called();
    expect(setUrlStub).to.be.calledOnce;

    watchStub.restore();
    setUrlStub.restore();
  });

  it(':submit should dispatch an error if Data.get fails', function() {
    initiativesStub.returns(okResponse());
    dataStub.returns(errorResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.submit();
    scope.$digest();

    expect(scope.data).to.equal(undefined);
    expect(scope.errorMessage).to.equal('Error');
    expect(scope.errorCode).to.equal(500);
  });

  it(':scrollTo should set locationHash', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.scrollTo(12345);
    scope.$digest();

    expect(location.hash(12345).$$hash).to.deep.equal(12345);
  });

  it(':updateMetadata should respond to init changes', function () {
    var actsLocsStub = sinon.stub(ActsLocs, 'get'),
      response = {
        activities: ['first', 'second'],
        locations: ['third', 'fourth']
      };

    actsLocsStub.returns(response);
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Check branch if params.init is undefined
    scope.updateMetadata();
    scope.$digest();
    expect(scope.processMetadata).to.equal(undefined);

    // Check branch if params.init is defined
    scope.params = {};
    scope.params.init = {};
    scope.updateMetadata();
    scope.$digest();

    expect(scope.processMetadata).to.equal(true);
    expect(scope.activities).to.equal(response.activities);
    expect(scope.locations).to.equal(response.locations);
    expect(scope.params.activity).to.equal(response.activities[0]);
    expect(scope.params.location).to.equal(response.locations[0]);

    Timeout.flush();
    expect(scope.processMetadata).to.equal(false);

    actsLocsStub.restore();
  });
});
