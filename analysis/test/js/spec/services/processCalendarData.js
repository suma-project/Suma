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
});
