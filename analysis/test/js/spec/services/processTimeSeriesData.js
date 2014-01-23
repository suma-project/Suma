'use strict';

describe('Service: Processtimeseriesdata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('processMock'));

  // instantiate service
  var Processtimeseriesdata,
      $httpBackend,
      MockLocations,
      MockActivities,
      MockResponse,
      MTSPD1,
      MTSPD2,
      NoActs;

  beforeEach(inject(function (
    _processTimeSeriesData_,
    _$httpBackend_,
    mockLocations,
    mockActivities,
    mockResponse,
    mockTimeSeriesProcessedData,
    mockTimeSeriesNoActsProcessedData,
    mockNoActivities) {

    Processtimeseriesdata = _processTimeSeriesData_;
    $httpBackend = _$httpBackend_;
    MockLocations = mockLocations;
    MockActivities = mockActivities;
    MockResponse = mockResponse;
    MTSPD1 = mockTimeSeriesProcessedData;
    MTSPD2 = mockTimeSeriesNoActsProcessedData;
    NoActs = mockNoActivities;
  }));

  it('should build an object of data objects', function (done) {
    Processtimeseriesdata.get(MockResponse, MockActivities, MockLocations).then(function (data) {
      expect(MTSPD1).to.deep.equal(data);
      done();
    });

    $httpBackend.flush();
  });

  it('should build an object of objects with no activities', function (done) {
    Processtimeseriesdata.get(MockResponse, NoActs, MockLocations).then(function (data) {
      expect(MTSPD2).to.deep.equal(data);
      done();
    });

    $httpBackend.flush();
  });

  it('should reject if locationsSum is not present', function (done) {
    var locations = [],
        activities = [],
        response = {},
        mock = {};

    Processtimeseriesdata.get(response, activities, locations).then(function (data) {

    }, function (response) {
      expect(response).to.deep.equal({statusText: 'no data, locationsSum not found'});
      done();
    });

    $httpBackend.flush();
  });

  it('should reject if no data', function (done) {
    var locations = [],
        activities = [],
        response = {locationsSum:{}},
        mock = {};

    Processtimeseriesdata.get(response, activities, locations).then(function (data) {

    }, function (response) {
      expect(response).to.deep.equal({statusText: 'no data, dataTest failed'});
      done();
    });

    $httpBackend.flush();
  });
});
