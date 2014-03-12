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
      MockProcessedData;

  beforeEach(inject(function (
    _processTimeSeriesData_,
    _$httpBackend_,
    mockLocations,
    mockActivities,
    mockResponse,
    mockTimeSeriesProcessedData) {

    Processtimeseriesdata = _processTimeSeriesData_;
    $httpBackend = _$httpBackend_;
    MockLocations = mockLocations;
    MockActivities = mockActivities;
    MockResponse = mockResponse;
    MockProcessedData = mockTimeSeriesProcessedData;
  }));

  it('should build an object of data objects', function (done) {
    Processtimeseriesdata.get(MockResponse, MockActivities, MockLocations)
      .then(function (data) {
        expect(MockProcessedData).to.deep.equal(data);
        done();
      });

    $httpBackend.flush();
  });

  it('should take else branch if _No Activity does not exist', function (done) {
    var locs = [],
        acts = [],
        resp = {};

    Processtimeseriesdata.get(resp, acts, locs)
      .then(function (data) {
        expect(data).to.be.an('object');
        done();
      });

    $httpBackend.flush();
  });
});
