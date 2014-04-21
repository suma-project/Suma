'use strict';

describe('Service: Processhourlydata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('processMock'));

  // instantiate service
  var $httpBackend,
      Processhourlydata,
      MockResponse,
      MockHourlyProcessedData;

  beforeEach(inject(function (
    _processHourlyData_,
    _$httpBackend_,
    mockResponse,
    mockHourlyProcessedData) {

    Processhourlydata = _processHourlyData_;
    $httpBackend = _$httpBackend_;
    MockResponse = mockResponse;
    MockHourlyProcessedData = mockHourlyProcessedData;
  }));

  it('should build object of data objects', function (done) {
    Processhourlydata.get(MockResponse)
      .then(function (data) {
        expect(MockHourlyProcessedData).to.deep.equal(data);
        done();
      });

    $httpBackend.flush();
  });
});
