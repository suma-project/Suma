'use strict';

describe('Service: Processrawdata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('processMock'));

  // instantiate service
  var $httpBackend,
      ProcessRawdata,
      MockRawData,
      MockRawProcessedData;

  beforeEach(inject(function (
    _processRawData_,
    _$httpBackend_,
    mockRawData,
    mockRawProcessedData) {

    ProcessRawdata = _processRawData_;
    $httpBackend = _$httpBackend_;
    MockRawData = mockRawData;
    MockRawProcessedData = mockRawProcessedData;
  }));

  it('should build object of data objects', function (done) {
    ProcessRawdata.get(MockRawData).then(function (data) {
      expect(MockRawProcessedData).to.deep.equal(data);
      done();
    });

    $httpBackend.flush();
  });
});
