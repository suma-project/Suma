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

  it(':initialize should not set UI state to initial if urlParams exist', function () {
    var locationSearchStub = sinon.stub(location, 'search');
    locationSearchStub.returns({id: 4});

    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    expect(UIStates.setUIState).to.not.be.called;

    locationSearchStub.restore();
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

  it(':initialize should assign initiatives to scope', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.$digest();
    expect(scope.inits).to.deep.equal({success: true});
  });

  it(':getInitiatives should call setScope and getData if urlParams exist', function () {
    var locationSearchStub,
        getDataStub,
        setScopeStub;

    locationSearchStub = sinon.stub(location, 'search');
    locationSearchStub.returns({id: 4});

    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    setScopeStub = sinon.stub(scope, 'setScope');
    setScopeStub.returns(true);

    getDataStub = sinon.stub(scope, 'getData');
    getDataStub.returns(true);

    scope.$digest();
    expect(scope.inits).to.deep.equal({success: true});
    expect(setScopeStub).to.be.calledOnce;
    expect(getDataStub).to.be.calledOnce;

    locationSearchStub.restore();
    setScopeStub.restore();
    getDataStub.restore();
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

  it(':getData should assign data and set success', function() {
    initiativesStub.returns(okResponse());
    dataStub.returns(dataResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.getData();
    scope.$digest();

    expect(UIStates.setUIState).to.be.calledWith('success');
    expect(scope.data.success).to.equal(true);
  });

  it(':getData should assign data and set success', function() {
    initiativesStub.returns(okResponse());
    dataStub.returns(dataResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig2
    });

    scope.getData();
    scope.$digest();

    expect(UIStates.setUIState).to.be.calledWith('success');
    expect(scope.data.success).to.equal(true);
  });

  it(':getData should dispatch an error if Data.get fails', function () {
    initiativesStub.returns(okResponse());
    dataStub.returns(errorResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.getData();
    scope.$digest();

    expect(scope.data).to.equal(undefined);
    expect(scope.errorMessage).to.equal('Error');
    expect(scope.errorCode).to.equal(500);
  });

  it(':error should fail silently if data.timeout property is true', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    scope.state = 'not error';
    scope.error({promiseTimeout: true});

    expect(scope.state).to.equal('not error');
    expect(scope.errorMessage).to.equal(undefined);
    expect(scope.errorCode).to.equal(undefined);
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

  // it(':submit should call locationSearch with params', function () {
  //   var locationSearchStub = sinon.stub(location, 'search');
  //   locationSearchStub.returns({});

  //   initiativesStub.returns(okResponse());
  //   dataStub.returns(dataResponse());

  //   ReportCtrl = Controller('ReportCtrl', {
  //     $scope: scope,
  //     sumaConfig: SumaConfig
  //   });

  //   expect(locationSearchStub).to.be.calledOnce;

  //   scope.params = {};
  //   scope.params.init = {id: 4};
  //   scope.params.sdate = '20140101';
  //   scope.params.edate = '20140104';
  //   scope.submit();

  //   expect(locationSearchStub).to.be.calledTwice;
  //   expect(locationSearchStub).to.be.calledWith({
  //     id: 4,
  //     sdate: '20140101',
  //     edate: '20140104',
  //     stime: '',
  //     etime: '',
  //     count: null,
  //     session_filter: null,
  //     activity: null,
  //     location: null,
  //     daygroup: null
  //   });

  //   scope.params.stime = '0800';
  //   scope.params.etime = '1000';
  //   scope.params.count = {id: 4};
  //   scope.params.session_filter = {id: 4};
  //   scope.params.activity = {id: 4};
  //   scope.params.location = {id: 4};
  //   scope.params.daygroup = {id: 4};

  //   scope.submit();

  //   expect(locationSearchStub).to.be.calledThrice;
  //   expect(locationSearchStub).to.be.calledWith({
  //     id: 4,
  //     sdate: '20140101',
  //     edate: '20140104',
  //     stime: '0800',
  //     etime: '1000',
  //     count: 4,
  //     session_filter: 4,
  //     activity: 4,
  //     location: 4,
  //     daygroup: 4
  //   });

  //   locationSearchStub.restore();
  // });

  it(':setScope should set scope.params based on URL', function () {
    initiativesStub.returns(okResponse());

    ReportCtrl = Controller('ReportCtrl', {
      $scope: scope,
      sumaConfig: SumaConfig
    });

    var getMetadataStub = sinon.stub(scope, 'getMetadata');
    getMetadataStub.returns(true);

    scope.inits = [{id: 6}, {id: 7}, {id: 8}];

    var params = {
      id: 8,
      sdate: '2013-06-31',
      edate: '2014-01-01',
      stime: '0800',
      etime: '1000',
      count: 'count',
      session_filter: false,
      activity: 'all',
      location: 'all',
      daygroup: 'all'
    };

    scope.setScope(params);

    expect(scope.params.init.id).to.deep.equal(8);
    expect(scope.params.sdate).to.equal('2013-06-31');
    expect(scope.params.edate).to.equal('2014-01-01');
    expect(scope.params.stime).to.equal('0800');
    expect(scope.params.etime).to.equal('1000');
    expect(scope.params.count.id).to.deep.equal('count');

    getMetadataStub.restore();
  });

  // it(':routeUpdate should resolve promises and call methods based on empty urlParams', function () {
  //   var locationSearchStub = sinon.stub(location, 'search');
  //   locationSearchStub.returns({});


  //   initiativesStub.returns(okResponse());
  //   dataStub.returns(dataResponse());

  //   ReportCtrl = Controller('ReportCtrl', {
  //     $scope: scope,
  //     sumaConfig: SumaConfig
  //   });

  //   var setDefaultsStub = sinon.stub(scope, 'setDefaults');
  //   var setScopeStub = sinon.stub(scope, 'setScope');
  //   var submitStub = sinon.stub(scope, 'submit');
  //   var getInitiativesStub = sinon.stub(scope, 'getInitiatives');

  //   expect(locationSearchStub).to.be.calledOnce;

  //   scope.routeUpdate();
  //   expect(statesStub).to.be.calledTwice;
  //   expect(setDefaultsStub).to.be.calledOnce;
  //   expect(getInitiativesStub).to.not.be.called;
  //   expect(setDefaultsStub).to.not.be.called;


  //   locationSearchStub.restore();
  //   setDefaultsStub.restore();
  //   setScopeStub.restore();
  //   submitStub.restore();
  //   getInitiativesStub.restore();
  // });
});
