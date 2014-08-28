'use strict';

describe('Service: Processsessionsdata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('processMock'));

  // instantiate service
  var $httpBackend,
      Processsessionsdata,
      MockSessionsData,
      MockSessionsProcessedData;

  beforeEach(inject(function (
    _processSessionsData_,
    _$httpBackend_,
    mockSessionsData,
    mockSessionsProcessedData) {

    Processsessionsdata = _processSessionsData_;
    $httpBackend = _$httpBackend_;
    MockSessionsData = mockSessionsData;
    MockSessionsProcessedData = mockSessionsProcessedData;
  }));

  it('should build object of data objects', function (done) {
    Processsessionsdata.get(MockSessionsData).then(function (data) {
      expect(MockSessionsProcessedData).to.deep.equal(data);
      done();
    });

    $httpBackend.flush();
  });
});
