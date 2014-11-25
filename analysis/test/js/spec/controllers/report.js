'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  // beforeEach(module('reportMock'));

  var ReportCtrl,
    Controller,
    scope,
    Q,
    Timeout,
    location,
    Initiatives,
    Data,
    ActsLocs,
    UIStates,
    ScopeUtils,
    okResponse,
    errorResponse,
    dataResponse,
    setScopeResponse,
    setScopeResponseError,
    SumaConfig,
    locationStub;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (
    $controller,
    $rootScope,
    $q,
    $timeout,
    $location,
    actsLocs,
    data,
    initiatives,
    uiStates,
    scopeUtils,
    sumaConfig) {

    Controller = $controller;
    scope = $rootScope.$new();
    Q = $q;
    Timeout = $timeout;
    location = $location;
    ActsLocs = actsLocs;
    Data = data;
    Initiatives = initiatives;
    UIStates = uiStates;
    ScopeUtils = scopeUtils;
    SumaConfig = sumaConfig;

    // Locations stub
    locationStub = sinon.stub(location, 'path');
    locationStub.returns('/timeseries');

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

    setScopeResponse = function () {
      var dfd = $q.defer();
      dfd.resolve({
        activities: [],
        locations: [],
        actLocs: {acts: [], locs: []},
        params: {}
      });
      return dfd.promise;
    };

    setScopeResponseError = function () {
      var dfd = $q.defer();
      dfd.resolve({
        activities: [],
        locations: [],
        actLocs: {acts: [], locs: []},
        params: {},
        errorMessage: 'Error'
      });
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
  }));

  afterEach(inject(function () {
    locationStub.restore();
  }));

  it(':initialize should set defaults', function () {
    var initiativesStub,
        getInitsStub,
        statesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    expect(initiativesStub).to.be.calledOnce;

    scope.$digest();

    expect(statesStub).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });

  it(':initialize should resolve DATA_TIMEOUT_PROMISE', function () {
    var initiativesStub,
        getInitsStub,
        statesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    ReportCtrl.params = {
      init:4
    };
    ReportCtrl.activities = [];
    ReportCtrl.locations = [];

    ReportCtrl.getData();
    ReportCtrl.initialize();

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });

  it(':initialize should getInitiatives, setScope and getData if URL params present but no $scope.params.init', function () {
    var initiativesStub,
        getInitsStub,
        setScopeStub,
        getDataStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Stub scope.getInits
    getInitsStub = sinon.stub(ReportCtrl, 'getInitiatives');
    getInitsStub.returns(okResponse());

    // Stub scope.setDefaults, scope.setScope, scope.getData
    setScopeStub = sinon.stub(ReportCtrl, 'setScope');
    setScopeStub.returns(okResponse());
    getDataStub = sinon.stub(ReportCtrl, 'getData');
    getDataStub.returns(dataResponse());

    // Add parameter to URL
    location.search({id: 4});

    // Call initialize again to utlize stubs
    ReportCtrl.initialize();
    scope.$digest();

    // Assertions
    expect(setScopeStub).to.be.calledOnce;
    expect(getDataStub).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    getInitsStub.restore();
  });

  it(':initialize should setScope and getData if URL params and $scope.params.init present', function () {
    var initiativesStub,
        getInitsStub,
        setScopeStub,
        getDataStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Stub scope.getInits
    getInitsStub = sinon.stub(ReportCtrl, 'getInitiatives');
    getInitsStub.returns(okResponse());

    // Stub scope.setDefaults, scope.setScope, scope.getData
    setScopeStub = sinon.stub(ReportCtrl, 'setScope');
    setScopeStub.returns(okResponse());
    getDataStub = sinon.stub(ReportCtrl, 'getData');
    getDataStub.returns(dataResponse());

    // Add parameter to URL
    location.search({id: 4});

    ReportCtrl.params = {
      init: 4
    };

    // Call initialize again to utlize stubs
    ReportCtrl.initialize();
    scope.$digest();

    // Assertions
    expect(setScopeStub).to.be.calledOnce;
    expect(getDataStub).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    getInitsStub.restore();
  });

  it(':scrollTo should set locationHash', function () {
    var initiativesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    ReportCtrl.scrollTo('12345');
    scope.$digest();

    // Assertions
    expect(location.hash('12345').$$hash).to.deep.equal('12345');

    // Restore stubs
    initiativesStub.restore();
  });

  it(':getMetadata should set metadata on scope', function () {
    var actsLocsStub,
        initiativesStub,
        mock;

    mock = {
      activities: [{}, {}],
      locations: [{}, {}]
    };

    // Stub actsLocs service
    actsLocsStub = sinon.stub(ActsLocs, 'get');
    actsLocsStub.returns(mock);

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    ReportCtrl.params = {
      init: 4
    };

    // Assertions
    expect(ReportCtrl.actsLocs).to.equal(undefined);
    expect(ReportCtrl.activities).to.equal(undefined);
    expect(ReportCtrl.locations).to.equal(undefined);

    // Call getMetadata
    ReportCtrl.getMetadata();

    // Assertions
    expect(ReportCtrl.activities).to.equal(mock.activities);
    expect(ReportCtrl.locations).to.equal(mock.locations);

    // Restore stubs
    initiativesStub.restore();
    actsLocsStub.restore();
  });

  it(':updateMetadata should respond to init changes', function () {
    var getMetadataStub,
        initiativesStub,
        response;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Stub getMetadata()
    getMetadataStub = sinon.stub(ReportCtrl, 'getMetadata');
    getMetadataStub.returns(true);

    ReportCtrl.params = {};

    //Check branch if params.init is undefined
    ReportCtrl.updateMetadata();
    scope.$digest();
    expect(ReportCtrl.processMetadata).to.equal(undefined);

    // Check branch if params.init is defined
    ReportCtrl.params = {};
    ReportCtrl.params.init = {};
    ReportCtrl.updateMetadata();
    scope.$digest();

    // Assertions
    expect(ReportCtrl.processMetadata).to.equal(true);

    // Flush timeout to test state
    Timeout.flush();

    // Assertions
    expect(ReportCtrl.processMetadata).to.equal(false);

    // Restore stubs
    initiativesStub.restore();
    getMetadataStub.restore();
  });

  it(':submit should call getData if currentScope equals currentUrl', function () {
    var getDataStub,
        locationSearchStub;

    // Stub location.search
    locationSearchStub = sinon.stub(location, 'search');
    locationSearchStub.returns({
      id: '4',
      sdate: '20140101',
      edate: '20140104',
      stime: '',
      etime: '',
      excludeLocs: '',
      excludeActs: '',
      requireActs: '',
      excludeActGrps: '',
      requireActGrps: ''
    });

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Stub data
    getDataStub = sinon.stub(ReportCtrl, 'getData');
    getDataStub.returns(okResponse());

    // Populate Scope
    ReportCtrl.params = {};
    ReportCtrl.params.init = {id: '4'};
    ReportCtrl.params.sdate = '20140101';
    ReportCtrl.params.edate = '20140104';
    ReportCtrl.params.stime = '';
    ReportCtrl.params.etime = '';
    ReportCtrl.params.classifyCounts = null;
    ReportCtrl.params.wholeSession = null;
    ReportCtrl.params.daygroup = null;
    ReportCtrl.params.zeroCounts = true;
    ReportCtrl.params.excludeLocs = '';
    ReportCtrl.params.excludeActs = '';
    ReportCtrl.params.requireActs = '';
    ReportCtrl.params.excludeActGrps = '';
    ReportCtrl.params.requireActGrps = '';

    // Call submit method
    ReportCtrl.submit();

    // Assertions
    expect(getDataStub).to.be.calledOnce;

    // Restore stubs
    getDataStub.restore();
    locationSearchStub.restore();
  });

  it(':submit should setUrl if  currentScope does not equal currentUrl', function () {
    var locationSearchStub;

    // Stub location.search
    locationSearchStub = sinon.stub(location, 'search');
    locationSearchStub.returns({
      id: '4',
      sdate: '20140101',
      edate: '20140104',
      stime: '',
      etime: '',
      classifyCounts: null,
      wholeSession: null,
      activity: null,
      daygroup: null
    });

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Populate Scope
    ReportCtrl.params = {};
    ReportCtrl.params.init = {id: '4'};
    ReportCtrl.params.sdate = null;
    ReportCtrl.params.edate = null;
    ReportCtrl.params.stime = null;
    ReportCtrl.params.etime = null;
    ReportCtrl.params.classifyCounts = 'count';
    ReportCtrl.params.wholeSession = 'no';
    ReportCtrl.params.activity = 'mouse';
    ReportCtrl.params.daygroup = 'mouse';

    // Call submit method
    ReportCtrl.submit();

    // Assertions
    expect(locationSearchStub).to.be.calledThrice;

    // Restore stubs
    locationSearchStub.restore();
  });

  it(':getData should call data.getData', function() {
    var dataStub,
        initiativesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub data service
    dataStub = sinon.stub(Data, 'getData');
    dataStub.returns(dataResponse());

    // Initialize controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Call getData
    ReportCtrl.getData();
    scope.$digest();

    // Assertions
    expect(Data.getData).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    dataStub.restore();
  });

  it(':success should set scope.state and scope.data', function () {
    var initiativesStub,
        statesStub,
        dataMock;

    dataMock = {
      actsLocsData: {
        items: [{title: 'title'}]
      },
      barChartData: {
        title: 'title'
      }
    };

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Call success method
    ReportCtrl.success(dataMock);
    scope.$digest();

    // Assertions
    expect(ReportCtrl.state).to.equal(true);
    expect(ReportCtrl.data).to.equal(dataMock);

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });

  it(':success should set scope.state and scope.data', function () {
    var statesStub;

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    // Use hourly route
    locationStub.returns('/hourly');

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Call success method
    ReportCtrl.success('test data');

    // Assertions
    expect(ReportCtrl.state).to.equal(true);
    expect(ReportCtrl.data).to.equal('test data');

    // Restore stubs
    statesStub.restore();
  });

  it(':error should set state, errorMessage and errorCode', function () {
    var mockData,
        statesStub;

    mockData = {
      message: 'Error',
      code: 500
    };

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Call error method
    ReportCtrl.error(mockData);

    // Assertions
    expect(ReportCtrl.state).to.equal(true);
    expect(ReportCtrl.errorMessage).to.equal('Error');
    expect(ReportCtrl.errorCode).to.equal(500);

    // Restore stubs
    statesStub.restore();
  });

  it(':error should fail silently if data.promiseTimeout is false', function () {
    var mockData,
        statesStub;

    mockData = {
      message: 'Error',
      code: 500,
      promiseTimeout: true
    };

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    // Call error method
    ReportCtrl.error(mockData);

    // Assertions
    expect(ReportCtrl.state).to.equal(undefined);
    expect(ReportCtrl.errorMessage).to.equal(undefined);
    expect(ReportCtrl.errorCode).to.equal(undefined);

    // Restore stubs
    statesStub.restore();
  });

  it(':setScope should set scope values', function () {
    var initiativesStub,
        urlParams,
        setScopeStub,
        errorStub,
        expectedScope;

    expectedScope = {
      activities: [],
      locations: [],
      actLocs: {acts: [], locs: []},
      params: {}
    };

    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope
    });

    setScopeStub = sinon.stub(ScopeUtils, 'set');
    setScopeStub.returns(setScopeResponse());

    errorStub = sinon.stub(ReportCtrl, 'error');

    // Call setScope method
    ReportCtrl.setScope(urlParams).then(function () {
      // Assertions
      expect(expectedScope.activities).to.deep.equal(ReportCtrl.activities);
      expect(expectedScope.locations).to.deep.equal(ReportCtrl.locations);
    });

    scope.$digest();

    // Restore stubs
    initiativesStub.restore();
    setScopeStub.restore();
    errorStub.restore();
  });
});
