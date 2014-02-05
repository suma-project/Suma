'use strict';

describe('Service: Processhourlydata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('processMock'));

  // instantiate service
  var $httpBackend,
      Processhourlydata,
      MockLocations,
      MockActivities,
      MockResponse,
      MockHourlyProcessedData;

  beforeEach(inject(function (
    _processHourlyData_,
    _$httpBackend_,
    mockLocations,
    mockActivities,
    mockResponse,
    mockHourlyProcessedData) {

    Processhourlydata = _processHourlyData_;
    $httpBackend = _$httpBackend_;
    MockLocations = mockLocations;
    MockActivities = mockActivities;
    MockResponse = mockResponse;
    MockHourlyProcessedData = mockHourlyProcessedData;
  }));

  it('should build object of data objects', function (done) {
    Processhourlydata.get(MockResponse, MockActivities, MockLocations)
      .then(function (data) {
        expect(MockHourlyProcessedData).to.deep.equal(data);
        done();
      });

    $httpBackend.flush();
  });

  it('should reject with a statusText error if no data', function (done) {
    var locs = [],
        acts = [],
        response = [];

    Processhourlydata.get(response, acts, locs).then(function (data) {

    }, function (data) {
      expect(data).to.deep.equal({statusText: 'no data'});
      done();
    });

    $httpBackend.flush();

  });

});
