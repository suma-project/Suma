'use strict';

describe('Service: Processcalendardata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('processMock'));

  // instantiate service
  var $httpBackend,
      Processcalendardata,
      MockLocations,
      MockActivities,
      MockResponse,
      MockCalendarProcessedData;

  beforeEach(inject(function (
    _processCalendarData_,
    _$httpBackend_,
    mockLocations,
    mockActivities,
    mockResponse,
    mockCalendarProcessedData) {

    Processcalendardata = _processCalendarData_;
    $httpBackend = _$httpBackend_;
    MockLocations = mockLocations;
    MockActivities = mockActivities;
    MockResponse = mockResponse;
    MockCalendarProcessedData = mockCalendarProcessedData;
  }));

  it('should build object of data objects', function (done) {
    Processcalendardata.get(MockResponse, MockActivities, MockLocations).then(function (data) {
      expect(MockCalendarProcessedData).to.deep.equal(data);
      done();
    });

    $httpBackend.flush();
  });

  it('should reject if locationsSum is not present', function (done) {
    var locations = [],
        activities = [],
        response = {},
        mock = {};

    Processcalendardata.get(response, activities, locations).then(function (data) {

    }, function (response) {
      expect(response).to.deep.equal({statusText: 'no data, periodSum not found'});
      done();
    });

    $httpBackend.flush();
  });

  it('should reject if not enough data', function (done) {
    var locations = [],
        activities = [],
        response = {periodSum:{}},
        mock = {};

    Processcalendardata.get(response, activities, locations).then(function (data) {

    }, function (response) {
      expect(response).to.deep.equal({statusText: 'not enough data'});
      done();
    });

    $httpBackend.flush();
  });

});
