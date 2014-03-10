'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('reportMock'));

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
    SetScope,
    okResponse,
    errorResponse,
    dataResponse,
    setScopeResponse,
    setScopeResponseError,
    SumaConfig,
    SumaConfig2,
    Defaults;

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
    setScope,
    sumaConfig,
    sumaConfig2,
    defaults) {

    Controller = $controller;
    scope = $rootScope.$new();
    Q = $q;
    Timeout = $timeout;
    location = $location;
    ActsLocs = actsLocs;
    Data = data;
    Initiatives = initiatives;
    UIStates = uiStates;
    SetScope = setScope;

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

  it(':initialize should set defaults', function () {
    var initiativesStub,
        getInitsStub,
        setDefaultsStub,
        statesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Assertions
    expect(scope.countOptions).to.deep.equal(Defaults.countOptions);
    expect(scope.dayOptions).to.deep.equal(Defaults.dayOptions);
    expect(scope.sessionOptions).to.deep.equal(Defaults.sessionOptions);
    expect(scope.params.classifyCounts).to.deep.equal(Defaults.classifyCounts);
    expect(scope.params.daygroup).to.deep.equal(Defaults.daygroup);
    expect(scope.params.wholeSession).to.deep.equal(Defaults.wholeSession);
    expect(scope.params.sdate).to.equal(Defaults.sDate);
    expect(scope.params.edate).to.equal(Defaults.eDate);

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });

  it(':initialize should set state to initial on empty URL', function () {
    var initiativesStub,
        getInitsStub,
        setDefaultsStub,
        statesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Stub scope.getInits
    getInitsStub = sinon.stub(scope, 'getInitiatives');
    getInitsStub.returns(okResponse());

    // Stub scope.setDefaults
    setDefaultsStub = sinon.stub(scope, 'setDefaults');

    // Call initialize again to utlize stubs
    scope.initialize();
    scope.$digest();

    // Assertions
    expect(UIStates.setUIState).to.be.calledWith('initial');
    expect(UIStates.setUIState).to.be.calledTwice;

    // Restore stubs
    initiativesStub.restore();
    getInitsStub.restore();
    setDefaultsStub.restore();
    statesStub.restore();
  });

  it(':initialize should should setScope and getData if URL params present', function () {
    var initiativesStub,
        getInitsStub,
        setDefaultsStub,
        setScopeStub,
        statesStub,
        getDataStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Stub scope.getInits
    getInitsStub = sinon.stub(scope, 'getInitiatives');
    getInitsStub.returns(okResponse());

    // Stub scope.setDefaults, scope.setScope, scope.getData
    setDefaultsStub = sinon.stub(scope, 'setDefaults');
    setScopeStub = sinon.stub(scope, 'setScope');
    setScopeStub.returns(okResponse());
    getDataStub = sinon.stub(scope, 'getData');

    // Add parameter to URL
    location.search({id: 4});

    // Call initialize again to utlize stubs
    scope.initialize();
    scope.$digest();

    // Assertions
    expect(setDefaultsStub).to.be.calledOnce;
    expect(setScopeStub).to.be.calledOnce;
    expect(getDataStub).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    getInitsStub.restore();
    setDefaultsStub.restore();
    statesStub.restore();
  });

  it(':getInitiatives should assign inits to scope', function () {
    var initiativesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Digest to flush promises
    scope.$digest();

    // Assertions
    expect(scope.inits).to.deep.equal({success: true});

    // Restore stubs
    initiativesStub.restore();
  });


  it(':scrollTo should set locationHash', function () {
    var initiativesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });


    scope.scrollTo(12345);
    scope.$digest();

    // Assertions
    expect(location.hash(12345).$$hash).to.deep.equal(12345);

    // Restore stubs
    initiativesStub.restore();
  });

  it(':updateMetadata should respond to init changes', function () {
    var actsLocsStub,
        initiativesStub,
        response;

    // Mock response object
    response = {
      activities: ['first', 'second'],
      locations: ['third', 'fourth']
    };

    // Stub actsLocs service
    actsLocsStub = sinon.stub(ActsLocs, 'get');
    actsLocsStub.returns(response);

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
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

    // Assertions
    expect(scope.processMetadata).to.equal(true);
    expect(scope.activities).to.equal(response.activities);
    expect(scope.locations).to.equal(response.locations);
    expect(scope.params.activity).to.equal(response.activities[0]);
    expect(scope.params.location).to.equal(response.locations[0]);

    // Flush timeout to test state
    Timeout.flush();

    // Assertions
    expect(scope.processMetadata).to.equal(false);

    // Restore stubs
    actsLocsStub.restore();
    initiativesStub.restore();
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
      etime: ''
    });

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Stub data
    getDataStub = sinon.stub(scope, 'getData');

    // Populate Scope
    scope.params = {};
    scope.params.init = {id: '4'};
    scope.params.sdate = '20140101';
    scope.params.edate = '20140104';
    scope.params.stime = '';
    scope.params.etime = '';
    scope.params.classifyCounts = null;
    scope.params.wholeSession = null;
    scope.params.activity = null;
    scope.params.location = null;
    scope.params.daygroup = null;

    // Call submit method
    scope.submit();

    // Assertions
    expect(getDataStub).to.be.calledOnce;

    // Restore stubs
    getDataStub.restore();
    locationSearchStub.restore();
  });

  it(':submit should call getData if currentScope equals currentUrl (activity with type)', function () {
    var getDataStub,
        locationSearchStub;

    // Stub location.search
    locationSearchStub = sinon.stub(location, 'search');
    locationSearchStub.returns({
      id: '4',
      sdate: '',
      edate: '',
      stime: '',
      etime: '',
      activity: 'activity-47'
    });

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Stub data
    getDataStub = sinon.stub(scope, 'getData');

    // Populate Scope
    scope.params = {};
    scope.params.init = {id: '4'};
    scope.params.sdate = '';
    scope.params.edate = '';
    scope.params.stime = '';
    scope.params.etime = '';
    scope.params.classifyCounts = null;
    scope.params.wholeSession = null;
    scope.params.activity = {id: 47, type: 'activity'};
    scope.params.location = null;
    scope.params.daygroup = null;

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
      $scope: scope,
      sumaConfig: SumaConfig
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
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Call success method
    scope.success(dataMock);
    scope.$digest();

    // Assertions
    expect(scope.state).to.equal(true);
    expect(scope.data).to.equal(dataMock);

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });

  it(':success should set scope.state and scope.data', function () {
    var statesStub;

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');
    statesStub.returns(true);

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig2
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
      $scope: scope,
      sumaConfig: SumaConfig
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
      $scope: scope,
      sumaConfig: SumaConfig
    });

    setScopeStub = sinon.stub(SetScope, 'set');
    setScopeStub.returns(setScopeResponse());

    errorStub = sinon.stub(scope, 'error');

    // Call setScope method
    scope.setScope(urlParams).then(function () {
      // Assertions
      expect(expectedScope.activities).to.deep.equal(scope.activities);
      expect(expectedScope.locations).to.deep.equal(scope.locations);
      expect(expectedScope.actsLocs).to.deep.equal(scope.actsLocs);
      expect(expectedScope.params).to.deep.equal(scope.params);
    });

    scope.$digest();

    // Restore stubs
    initiativesStub.restore();
    setScopeStub.restore();
    errorStub.restore();
  });

  it(':setScope should call scope.error if setScope.set fails', function () {
    var initiativesStub,
        urlParams,
        setScopeStub,
        errorStub;

    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    setScopeStub = sinon.stub(SetScope, 'set');
    setScopeStub.returns(errorResponse());

    errorStub = sinon.stub(scope, 'error');

    // Call setScope method
    scope.setScope(urlParams).then(scope.success, scope.error);

    scope.$digest();

    // Assertions
    expect(errorStub).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    setScopeStub.restore();
    errorStub.restore();
  });

  it(':setScope should set scope values and reject if setScope.set returns errorMessage', function () {
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
      $scope: scope,
      sumaConfig: SumaConfig
    });

    setScopeStub = sinon.stub(SetScope, 'set');
    setScopeStub.returns(setScopeResponseError());

    errorStub = sinon.stub(scope, 'error');

    // Call setScope method
    scope.setScope(urlParams).then(function () {
      // Assertions
      expect(expectedScope.activities).to.deep.equal(scope.activities);
      expect(expectedScope.locations).to.deep.equal(scope.locations);
      expect(expectedScope.actsLocs).to.deep.equal(scope.actsLocs);
      expect(expectedScope.params).to.deep.equal(scope.params);
    }, scope.error);

    scope.$digest();

    expect(errorStub).to.be.calledOnce;

    // Restore stubs
    initiativesStub.restore();
    setScopeStub.restore();
    errorStub.restore();
  });

  it(':routeUpdate should resolve active promiseTimeouts, set state, and setDefaults', function () {
    var initiativesStub,
        statesStub,
        dataTimeoutStub,
        initTimeoutStub,
        setDefaultsStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Define/redefine timeouts
    scope.dataTimeoutPromise = Q.defer();
    scope.initTimeoutPromise = undefined;
    scope.initTimeoutPromise = Q.defer();

    // Stub scope.setDefaults
    setDefaultsStub = sinon.stub(scope, 'setDefaults');

    // Call routeUpdate()
    scope.routeUpdate();

    // Assertions
    scope.dataTimeoutPromise.promise.then(function (message) {
      expect(message).to.equal('resolved');
    });

    scope.initTimeoutPromise.promise.finally(function (message) {
      expect(message).to.equal('resolved');
    });

    expect(statesStub).to.be.calledWith('initial');
    expect(setDefaultsStub).to.be.calledOnce;

    scope.$digest();

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
    setDefaultsStub.restore();
  });

  it(':routeUpdate should setScope and getData when params and scope.params.init present', function () {
    var initiativesStub,
        locationStub,
        setScopeStub,
        getDataStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    locationStub = sinon.stub(location, 'search');
    locationStub.returns({id: 4});

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Define/redefine timeouts
    scope.initTimeoutPromise = undefined;

    // Define scope.params.init
    scope.params.init = {id: 4};

    // Define scope.setScope
    setScopeStub = sinon.stub(scope, 'setScope');
    setScopeStub.returns(okResponse());

    // Define scope.getData
    getDataStub = sinon.stub(scope, 'getData');

    // Call routeUpdate()
    scope.routeUpdate();

    // Assertions
    expect(setScopeStub).to.be.calledOnce;

    setScopeStub().then(function () {
      expect(getDataStub).to.be.calledOnce;
    });

    scope.$digest();

    // Restore stubs
    initiativesStub.restore();
    locationStub.restore();
    setScopeStub.restore();
    getDataStub.restore();
  });

  it(':routeUpdate should call getInitiatives when urlParams are present but scope.params.init is not', function () {
    var initiativesStub,
        locationStub,
        getInitiativesStub,
        setScopeStub,
        getDataStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    locationStub = sinon.stub(location, 'search');
    locationStub.returns({id: 4});

    // Instantiate controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Define/redefine timeouts
    scope.initTimeoutPromise = undefined;

    // Define scope.getInitiatives
    getInitiativesStub = sinon.stub(scope, 'getInitiatives');
    getInitiativesStub.returns(okResponse());

    // Define scope.setScope
    setScopeStub = sinon.stub(scope, 'setScope');
    setScopeStub.returns(okResponse());

    // Define scope.getData
    getDataStub = sinon.stub(scope, 'getData');

    // Call routeUpdate()
    scope.routeUpdate();

    // Assertions
    expect(getInitiativesStub).to.be.calledOnce;

    getInitiativesStub().then(function () {
      expect(setScopeStub).to.be.calledOnce;

      setScopeStub().then(function () {
        expect(getDataStub).to.be.calledOnce;
      });
    });

    scope.$digest();

    // Restore stubs
    initiativesStub.restore();
    locationStub.restore();
    setScopeStub.restore();
    getDataStub.restore();
  });


  it(':stringifyDays should return a string of days', function () {
    var initiativesStub,
        getInitsStub,
        setDefaultsStub,
        statesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Assertions
    expect(scope.stringifyDays(['mo', 'tu', 'we'])).to.equal('mo,tu,we');

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });

  it(':stringifyDays should null if array is empty or undefined/null', function () {
    var initiativesStub,
        getInitsStub,
        setDefaultsStub,
        statesStub;

    // Stub initiatives service
    initiativesStub = sinon.stub(Initiatives, 'get');
    initiativesStub.returns(okResponse());

    // Stub state service
    statesStub = sinon.stub(UIStates, 'setUIState');

    // Instantiate Controller
    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    // Assertions
    expect(scope.stringifyDays([])).to.equal(null);
    expect(scope.stringifyDays()).to.equal(null);

    // Restore stubs
    initiativesStub.restore();
    statesStub.restore();
  });
});
