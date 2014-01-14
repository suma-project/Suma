'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var $httpBackend,
      $rootScope,
      okResponse,
      params = {init: {id: 1}, count: {}, session_filter: 'false', daygroup: {}, location: {id: 'all'}, activity: {id: 'all'}},
      Processtimeseriesdata,
      Processcalendardata,
      Processhourlydata,
      timeseriesStub,
      calendarStub,
      hourlyStub,
      Data;

  beforeEach(inject(function (_data_, _$rootScope_, _$httpBackend_, _processTimeSeriesData_, _processCalendarData_, _processHourlyData_, $q) {
    Data = _data_;
    Processtimeseriesdata = _processTimeSeriesData_;
    Processcalendardata = _processCalendarData_;
    Processhourlydata = _processHourlyData_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    okResponse = function () {
      var dfd = $q.defer();;
      dfd.resolve({success: true});
      return dfd.promise;
    };
  }));

  it('should make an AJAX call with processTimeSeriesData', function (done) {
    $httpBackend.whenGET('lib/php/dataResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
      .respond([{}, {}]);

    timeseriesStub = sinon.stub(Processtimeseriesdata, 'get');
    timeseriesStub.returns(okResponse());
    Data.get(params, [], [], 'processTimeSeriesData').then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });



    // Data.get(params, [], []).then(function (result) {
    //   console.log('result', result)
    //   expect(result.success).to.equal(false);
    //   done();
    // });

    $httpBackend.flush();
    timeseriesStub.restore();
  });

  it('should make an AJAX call with processCalendarData', function (done) {
    $httpBackend.whenGET('lib/php/dataResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
      .respond([{}, {}]);

    calendarStub = sinon.stub(Processcalendardata, 'get');
    calendarStub.returns(okResponse());

    Data.get(params, [], [], 'processCalendarData').then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    calendarStub.restore();
  });

  it('should make an AJAX call with processHourlyData', function (done) {
    $httpBackend.whenGET('lib/php/dataResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
      .respond([{}, {}]);

    hourlyStub = sinon.stub(Processhourlydata, 'get');
    hourlyStub.returns(okResponse());

    Data.get(params, [], [], 'processHourlyData').then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    hourlyStub.restore();
  });

  it('should return an error if no processor is passed', function (done) {
    $httpBackend.whenGET('lib/php/dataResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
      .respond([{}, {}]);

    Data.get(params, [], []).then(function (result) {

    }, function(result) {
      expect(result).to.deep.equal({message: 'Data processor not found.', code: 'None found.'})
      done();
    });

    $httpBackend.flush();
  });

  it('should return an error if AJAX fails', function (done) {
    $httpBackend.whenGET('lib/php/dataResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
      .respond(500, {message: 'Error'});

    Data.get(params, [], [], 'processTimeSeriesData').then(function (result) {

    }, function(result) {
      expect(result).to.deep.equal({message: 'Error', code: 500})
      done();
    });

    $httpBackend.flush();
  });
});
