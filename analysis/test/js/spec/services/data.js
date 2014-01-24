'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('dataMock'));

  // instantiate service
  var $httpBackend,
    $rootScope,
    okResponse,
    Params1,
    Params2,
    MockUrl1,
    MockUrl2,
    MockUrl3,
    Processtimeseriesdata,
    Processcalendardata,
    Processhourlydata,
    timeseriesStub,
    calendarStub,
    hourlyStub,
    tPromise,
    Data;

  beforeEach(inject(function (
    _data_,
    _$rootScope_,
    _$httpBackend_,
    _processTimeSeriesData_,
    _processCalendarData_,
    _processHourlyData_,
    $q,
    mockParams1,
    mockParams2,
    mockUrl1,
    mockUrl2,
    mockUrl3) {

    Data = _data_;
    Processtimeseriesdata = _processTimeSeriesData_;
    Processcalendardata = _processCalendarData_;
    Processhourlydata = _processHourlyData_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    Params1 = mockParams1;
    Params2 = mockParams2;
    MockUrl1 = mockUrl1;
    MockUrl2 = mockUrl2;
    MockUrl3 = mockUrl3;

    tPromise = $q.defer();

    okResponse = function () {
      var dfd = $q.defer();
      dfd.resolve({success: true});
      return dfd.promise;
    };
  }));

  it(':getData should make an AJAX call with processTimeSeriesData', function (done) {
    $httpBackend.whenGET(MockUrl1)
      .respond([{}, {}]);

    timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
    timeseriesStub.returns(okResponse());
    Data.getData(Params1, [], [], 'processTimeSeriesData', tPromise).then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    timeseriesStub.restore();
  });

  it(':getData should make an AJAX call with processCalendarData', function (done) {
    $httpBackend.whenGET(MockUrl1)
      .respond([{}, {}]);

    calendarStub = sinon.stub(Processcalendardata, 'get');
    calendarStub.returns(okResponse());

    Data.getData(Params1, [], [], 'processCalendarData', tPromise).then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    calendarStub.restore();
  });

  it(':getData should make an AJAX call with processHourlyData', function (done) {
    $httpBackend.whenGET(MockUrl1)
      .respond([{}, {}]);

    hourlyStub = sinon.stub(Processhourlydata, 'get');
    hourlyStub.returns(okResponse());

    Data.getData(Params1, [], [], 'processHourlyData', tPromise).then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    hourlyStub.restore();
  });

  it(':getData should format activityType and activityId into string', function (done) {
    $httpBackend.whenGET(MockUrl2)
      .respond([{}, {}]);

    timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
    timeseriesStub.returns(okResponse());

    // Note use of params2 object
    Data.getData(Params2, [], [], 'processTimeSeriesData', tPromise).then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    timeseriesStub.restore();
  });

  it(':getData should return an error if no processor is passed', function (done) {
    $httpBackend.whenGET(MockUrl1)
      .respond([{}, {}]);

    Data.getData(Params1, [], [], '', tPromise).then(function (result) {

    }, function(result) {
      expect(result).to.deep.equal({message: 'Data processor not found.', code: 'None found.'});
      done();
    });

    $httpBackend.flush();
  });

  it(':getData should return an error if AJAX fails', function (done) {
    $httpBackend.whenGET(MockUrl1)
      .respond(500, {message: 'Error'});

    Data.getData(Params1, [], [], 'processTimeSeriesData', tPromise).then(function (result) {

    }, function(result) {
      expect(result).to.deep.equal({message: 'Error', code: 500});
      done();
    });

    $httpBackend.flush();
  });

  it(':getSessionsData should make an AJAX call', function (done) {
    $httpBackend.whenGET(MockUrl3)
      .respond([{}, {}]);

    Data.getSessionsData(Params1, [], [], '', tPromise).then(function (result) {
      expect(result.length).to.equal(2);
      done();
    });

    $httpBackend.flush();
  });

  it(':getSessionsData should return an error if AJAX fails', function (done) {
    $httpBackend.whenGET(MockUrl3)
      .respond(500, {message: 'Error'});

    Data.getSessionsData(Params1, [], [], '', tPromise).then(function (result) {

    }, function (result) {
      expect(result).to.deep.equal({message: 'Error', code: 500});
      done();
    });

    $httpBackend.flush();
  });
});
