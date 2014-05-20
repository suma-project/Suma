'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('dataMock'));

  // // instantiate service
  // var $httpBackend,
  //   $rootScope,
  //   okResponse,
  //   errorResponse,
  //   Params1,
  //   Params2,
  //   Params3,
  //   Params4,
  //   MockUrl1,
  //   MockUrl2,
  //   MockUrl3,
  //   MockUrl4,
  //   MockUrl5,
  //   Processtimeseriesdata,
  //   Processcalendardata,
  //   Processhourlydata,
  //   timeseriesStub,
  //   calendarStub,
  //   hourlyStub,
  //   tPromise,
  //   Data,
  //   Timeout;

  // beforeEach(inject(function (
  //   _data_,
  //   _$rootScope_,
  //   _$httpBackend_,
  //   _processTimeSeriesData_,
  //   _processCalendarData_,
  //   _processHourlyData_,
  //   $q,
  //   $timeout,
  //   mockParams1,
  //   mockParams2,
  //   mockParams3,
  //   mockParams4,
  //   mockUrl1,
  //   mockUrl2,
  //   mockUrl3,
  //   mockUrl4,
  //   mockUrl5) {

  //   Data = _data_;
  //   Processtimeseriesdata = _processTimeSeriesData_;
  //   Processcalendardata = _processCalendarData_;
  //   Processhourlydata = _processHourlyData_;
  //   $rootScope = _$rootScope_;
  //   $httpBackend = _$httpBackend_;
  //   Params1 = mockParams1;
  //   Params2 = mockParams2;
  //   Params3 = mockParams3;
  //   Params4 = mockParams4;
  //   MockUrl1 = mockUrl1;
  //   MockUrl2 = mockUrl2;
  //   MockUrl3 = mockUrl3;
  //   MockUrl4 = mockUrl4;
  //   MockUrl5 = mockUrl5;
  //   Timeout = $timeout;

  //   tPromise = $q.defer();

  //   okResponse = function () {
  //     var dfd = $q.defer();
  //     dfd.resolve({success: true});
  //     return dfd.promise;
  //   };

  //   errorResponse = function () {
  //     var dfd = $q.defer();
  //     dfd.reject({message: 'Error', code: 500});
  //     return dfd.promise;
  //   };
  // }));

  // it(':getData should make an AJAX call with processTimeSeriesData', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //     .respond([{}, {}]);

  //   timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
  //   timeseriesStub.returns(okResponse());

  //   Data.getData(cfg).then(function (result) {
  //     expect(result.success).to.equal(true);
  //     done();
  //   });

  //   $httpBackend.flush();
  //   timeseriesStub.restore();
  // });

  // it(':getData should make an AJAX call with processCalendarData', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processCalendarData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //     .respond([{}, {}]);

  //   calendarStub = sinon.stub(Processcalendardata, 'get');
  //   calendarStub.returns(okResponse());

  //   Data.getData(cfg).then(function (result) {
  //     expect(result.success).to.equal(true);
  //     done();
  //   });

  //   $httpBackend.flush();
  //   calendarStub.restore();
  // });

  // it(':getData should make an AJAX call with processHourlyData', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processHourlyData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //     .respond([{}, {}]);

  //   hourlyStub = sinon.stub(Processhourlydata, 'get');
  //   hourlyStub.returns(okResponse());

  //   Data.getData(cfg).then(function (result) {
  //     expect(result.success).to.equal(true);
  //     done();
  //   });

  //   $httpBackend.flush();
  //   hourlyStub.restore();
  // });

  // it(':getData should return an error if no processor is passed', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: '',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //     .respond([{}, {}]);

  //   Data.getData(cfg).then(function (result) {

  //   }, function(result) {
  //     expect(result).to.deep.equal({message: 'Data processor not found.', code: 'None found.'});
  //     done();
  //   });

  //   $httpBackend.flush();
  // });

  // it(':getData should return an error if processor fails', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //     .respond([{}, {}]);

  //   timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
  //   timeseriesStub.returns(errorResponse());
  //   Data.getData(cfg).then(function (result) {

  //   }, function (result) {
  //     expect(result).to.deep.equal({message: 'Error', code: 500});
  //     done();
  //   });

  //   $httpBackend.flush();
  //   timeseriesStub.restore();
  // });

  // it(':getData should format activityType and activityId into string', function (done) {
  //   // Note use of Params2
  //   var cfg = {
  //     params: Params2,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl2)
  //     .respond([{}, {}]);

  //   timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
  //   timeseriesStub.returns(okResponse());

  //   Data.getData(cfg).then(function (result) {
  //     expect(result.success).to.equal(true);
  //     done();
  //   });

  //   $httpBackend.flush();
  //   timeseriesStub.restore();
  // });

  // it(':getData should fall back if params are missing', function (done) {
  //   // Note use of Params3
  //   var cfg = {
  //     params: Params3,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl4)
  //     .respond([{}, {}]);

  //   timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
  //   timeseriesStub.returns(okResponse());

  //   Data.getData(cfg).then(function (result) {
  //     expect(result.success).to.equal(true);
  //     done();
  //   });

  //   $httpBackend.flush();
  //   timeseriesStub.restore();
  // });

  // it(':getData should return an error if AJAX fails', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //     .respond(500, {message: 'Error'});

  //   Data.getData(cfg).then(function (result) {

  //   }, function(result) {
  //     expect(result).to.deep.equal({
  //       message: 'Error',
  //       code: 500
  //     });

  //     done();
  //   });

  //   $httpBackend.flush();
  // });

  // it(':getData should return error with promiseTimeout true on aborted http request', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   // simulate aborted request
  //   $httpBackend.whenGET(MockUrl1)
  //     .respond(0, {message: 'Error'});

  //   Data.getData(cfg).then(function (result) {

  //   }, function(result) {
  //     expect(result).to.deep.equal({
  //       message: 'Data.getData Timeout',
  //       code: 0,
  //       promiseTimeout: true
  //     });

  //     done();
  //   });

  //   $httpBackend.flush();
  // });

  // it('should return error without promiseTimeout on http timeout', function (done) {
  //   var cfg = {
  //     params: Params1,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl1)
  //         .respond([{}, {}]);

  //   Data.getData(cfg).then(function (result) {

  //   }, function (result) {
  //     expect(result).to.deep.equal({
  //       message: 'Data.getData Timeout',
  //       code: 0
  //     });

  //     done();
  //   });

  //   Timeout.flush();
  // });

  // it(':getSessionsData should make an AJAX call', function (done) {
  //   var cfg = {
  //     params: Params4,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: '',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl5)
  //     .respond([{}, {}]);

  //   Data.getSessionsData(cfg).then(function (result) {
  //     expect(result.length).to.equal(2);
  //     done();
  //   });

  //   $httpBackend.flush();
  // });

  // it(':getSessionsData should return an error if AJAX fails', function (done) {
  //   var cfg = {
  //     params: Params4,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: '',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl5)
  //     .respond(500, {message: 'Error'});

  //   Data.getSessionsData(cfg).then(function (result) {

  //   }, function (result) {
  //     expect(result).to.deep.equal({
  //       message: 'Error',
  //       code: 500
  //     });

  //     done();
  //   });

  //   $httpBackend.flush();
  // });

  // it(':getSessionsData should return error with promiseTimeout true on aborted http request', function (done) {
  //   var cfg = {
  //     params: Params4,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   // simulate aborted request
  //   $httpBackend.whenGET(MockUrl5)
  //     .respond(0, {message: 'Error'});

  //   Data.getSessionsData(cfg).then(function (result) {

  //   }, function(result) {
  //     expect(result).to.deep.equal({
  //       message: 'Data.getSessionsData Timeout',
  //       code: 0,
  //       promiseTimeout: true
  //     });

  //     done();
  //   });

  //   $httpBackend.flush();
  // });

  // it(':getSessionsData should return error without promiseTimeout on http timeout', function (done) {
  //   var cfg = {
  //     params: Params4,
  //     acts: [],
  //     locs: [],
  //     dataProcessor: 'processTimeSeriesData',
  //     timeoutPromise: tPromise,
  //     timeout: 180000
  //   };

  //   $httpBackend.whenGET(MockUrl5)
  //         .respond([{}, {}]);

  //   Data.getSessionsData(cfg).then(function (result) {

  //   }, function (result) {
  //     expect(result).to.deep.equal({
  //       message: 'Data.getSessionsData Timeout',
  //       code: 0
  //     });

  //     done();
  //   });

  //   Timeout.flush();
  // });
});
