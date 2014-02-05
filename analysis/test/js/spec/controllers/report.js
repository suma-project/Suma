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
    scope.params.sdate = '20140101';
    scope.params.edate = '20140104';
    scope.params.stime = '';
    scope.params.etime = '';
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
    }

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
    }

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
});
