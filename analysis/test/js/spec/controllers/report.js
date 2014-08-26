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

    expect(statesStub).to.be.calledOnce

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

    scope.params = {
      init:4
    };
    scope.activities = [];
    scope.locations = [];

    scope.getData();
    scope.initialize();

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
    getInitsStub = sinon.stub(scope, 'getInitiatives');
    getInitsStub.returns(okResponse());

    // Stub scope.setDefaults, scope.setScope, scope.getData
    setScopeStub = sinon.stub(scope, 'setScope');
    setScopeStub.returns(okResponse());
    getDataStub = sinon.stub(scope, 'getData');
    getDataStub.returns(dataResponse());

    // Add parameter to URL
    location.search({id: 4});

    // Call initialize again to utlize stubs
    scope.initialize();
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
    getInitsStub = sinon.stub(scope, 'getInitiatives');
    getInitsStub.returns(okResponse());

    // Stub scope.setDefaults, scope.setScope, scope.getData
    setScopeStub = sinon.stub(scope, 'setScope');
    setScopeStub.returns(okResponse());
    getDataStub = sinon.stub(scope, 'getData');
    getDataStub.returns(dataResponse());

    // Add parameter to URL
    location.search({id: 4});

    scope.params = {
      init: 4
    }

    // Call initialize again to utlize stubs
    scope.initialize();
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

    scope.scrollTo(12345);
    scope.$digest();

    // Assertions
    expect(location.hash(12345).$$hash).to.deep.equal(12345);

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

    scope.params = {
      init: 4
    };

    // Assertions
    expect(scope.actsLocs).to.equal(undefined);
    expect(scope.activities).to.equal(undefined);
    expect(scope.locations).to.equal(undefined);
    expect(scope.params.location).to.equal(undefined);

    // Call getMetadata
    scope.getMetadata();

    // Assertions
    expect(scope.activities).to.equal(mock.activities);
    expect(scope.locations).to.equal(mock.locations);
    expect(scope.params.location).to.equal(mock.locations[0]);

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
    getMetadataStub = sinon.stub(scope, 'getMetadata');
    getMetadataStub.returns(true);

    scope.params = {};

    //Check branch if params.init is undefined
    scope.updateMetadata();
    scope.$digest();
    expect(scope.processMetadata).to.equal(undefined);

    // Check branch if params.init is defined
    scope.params = {};
    scope.params.init = {};
    scope.updateMetadata();
    scope.$digest();

    // Assertions
    expect(scope.processMetadata).to.equal(true);

    // Flush timeout to test state
    Timeout.flush();

    // Assertions
    expect(scope.processMetadata).to.equal(false);

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
    getDataStub = sinon.stub(scope, 'getData');
    getDataStub.returns(okResponse());

    // Populate Scope
    scope.params = {};
    scope.params.init = {id: '4'};
    scope.params.sdate = '20140101';
    scope.params.edate = '20140104';
    scope.params.stime = '';
    scope.params.etime = '';
    scope.params.classifyCounts = null;
    scope.params.wholeSession = null;
    scope.params.location = null;
    scope.params.daygroup = null;
    scope.params.zeroCounts = true;
    scope.params.excludeActs = '';
    scope.params.requireActs = '';
    scope.params.excludeActGrps = '';
    scope.params.requireActGrps = '';

    // Call submit method
    scope.submit();

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
      location: null,
      daygroup: null
    });

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Populate Scope
    scope.params = {};
    scope.params.init = {id: '4'};
    scope.params.sdate = null;
    scope.params.edate = null;
    scope.params.stime = null;
    scope.params.etime = null;
    scope.params.classifyCounts = 'count';
    scope.params.wholeSession = 'no';
    scope.params.activity = 'mouse';
    scope.params.location = 'mouse';
    scope.params.daygroup = 'mouse';

    // Call submit method
    scope.submit();

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
    scope.getData();
    scope.$digest();

    // Assertions
    expect(Data.getData).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    dataStub.restore();
  });

  // it(':success should set scope.state and scope.data', function () {
  //   var initiativesStub,
  //       statesStub,
  //       dataMock;

  //   dataMock = {
  //     actsLocsData: {
  //       items: [{title: 'title'}]
  //     },
  //     barChartData: {
  //       title: 'title'
  //     }
  //   };

  //   // Stub initiatives service
  //   initiativesStub = sinon.stub(Initiatives, 'get');
  //   initiativesStub.returns(okResponse());

  //   // Stub state service
  //   statesStub = sinon.stub(UIStates, 'setUIState');
  //   statesStub.returns(true);

  //   // Instantiate controller
  //   ReportCtrl = Controller('ReportCtrl', {
  //     $scope: scope
  //   });

  //   // Call success method
  //   scope.success(dataMock);
  //   scope.$digest();

  //   // Assertions
  //   expect(scope.state).to.equal(true);
  //   expect(scope.data).to.equal(dataMock);

  //   // Restore stubs
  //   initiativesStub.restore();
  //   statesStub.restore();
  // });

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
    scope.success('test data');

    // Assertions
    expect(scope.state).to.equal(true);
    expect(scope.data).to.equal('test data');

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
    scope.error(mockData);

    // Assertions
    expect(scope.state).to.equal(true);
    expect(scope.errorMessage).to.equal('Error');
    expect(scope.errorCode).to.equal(500);

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
    scope.error(mockData);

    // Assertions
    expect(scope.state).to.equal(undefined);
    expect(scope.errorMessage).to.equal(undefined);
    expect(scope.errorCode).to.equal(undefined);

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

    errorStub = sinon.stub(scope, 'error');

    // Call setScope method
    scope.setScope(urlParams).then(function () {
      // Assertions
      expect(expectedScope.activities).to.deep.equal(scope.activities);
      expect(expectedScope.locations).to.deep.equal(scope.locations);
    });

    scope.$digest();

    // Restore stubs
    initiativesStub.restore();
    setScopeStub.restore();
    errorStub.restore();
  });
});
