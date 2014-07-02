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
      MockResponseZeros,
      MockProcessedData,
      MockProcessedZeros;

  beforeEach(inject(function (
    _processTimeSeriesData_,
    _$httpBackend_,
    mockLocations,
    mockActivities,
    mockResponse,
    mockResponseZeros,
    mockTimeSeriesProcessedData,
    mockTimeSeriesProcessedZeros) {

    Processtimeseriesdata = _processTimeSeriesData_;
    $httpBackend = _$httpBackend_;
    MockLocations = mockLocations;
    MockActivities = mockActivities;
    MockResponse = mockResponse;
    MockResponseZeros = mockResponseZeros;
    MockProcessedData = mockTimeSeriesProcessedData;
    MockProcessedZeros = mockTimeSeriesProcessedZeros;
  }));

  it('should build an object of data objects', function (done) {
    Processtimeseriesdata.get(MockResponse, MockActivities, MockLocations, {zeroCounts: {id: 'no'}})
      .then(function (data) {
        expect(JSON.stringify(MockProcessedData)).to.deep.equal(JSON.stringify(data));
        done();
      });

    $httpBackend.flush();
  });

  it('should take else branch if _No Activity does not exist', function (done) {
    var locs = [],
        acts = [],
        resp = {};

    Processtimeseriesdata.get(resp, acts, locs, {zeroCounts: {id: 'yes'}})
      .then(function (data) {
        expect(data).to.be.an('object');
        done();
      });

    $httpBackend.flush();
  });

  it('should handle zero/NaN conditions', function (done) {
    Processtimeseriesdata.get(MockResponseZeros, MockActivities, MockLocations, {zeroCounts: {id: 'no'}})
      .then(function (data) {
        expect(JSON.stringify(MockProcessedZeros)).to.deep.equal(JSON.stringify(data));
        done();
      });

    $httpBackend.flush();
  });
});
