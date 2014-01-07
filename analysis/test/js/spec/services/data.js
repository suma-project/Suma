'use strict';

describe('Service: Data', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var $httpBackend,
      $rootScope,
      okResponse,
      params = {init: {id: 1}, count: {}, session_filter: 'false', daygroup: {}, location: {}, activity: {}},
      Processtimeseriesdata,
      stub,
      Data;

  beforeEach(inject(function (_data_, _$rootScope_, _$httpBackend_, _processTimeSeriesData_, $q) {
    Data = _data_;
    Processtimeseriesdata = _processTimeSeriesData_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    stub = sinon.stub(Processtimeseriesdata, 'get');

    okResponse = function () {
      var dfd = $q.defer();;
      dfd.resolve({success: true});
      return dfd.promise;
    };
  }));

  it('should make an AJAX call', function (done) {
    $httpBackend.whenGET('lib/php/dataResults.php?activities=undefined-undefined&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=count&session_filter=false&stime=')
      .respond([{}, {}]);

    stub.returns(okResponse());
    Data.get(params, [], [], 'processTimeSeriesData').then(function (result) {
      expect(result.success).to.equal(true);
      done();
    });

    $httpBackend.flush();
    stub.restore();
  });
});
