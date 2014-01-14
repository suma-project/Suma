'use strict';

describe('Service: Sessionsdata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var Sessionsdata,
      $rootScope,
      $httpBackend,
      params = {init: {id: 1}, count: {}, session_filter: 'false', daygroup: {}, location: {}, activity: {}};

  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _sessionsData_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    Sessionsdata = _sessionsData_;
  }));

  it('should make an AJAX call', function (done) {
    $httpBackend.whenGET('lib/php/sessionsResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=session&session_filter=true&stime=').respond([{}, {}]);

    Sessionsdata.get(params).then(function (result) {
      expect(result.length).to.equal(2);
      done();
    });

    $httpBackend.flush();
  });

  it('should respond with error message on failure', function (done) {
    $httpBackend.whenGET('lib/php/sessionsResults.php?activities=all&daygroup=all&edate=&etime=&id=1&locations=all&sdate=&session=session&session_filter=true&stime=').respond(500, {message: 'Error'});

    Sessionsdata.get(params).then(function (result) {

    }, function (result) {
      expect(result).to.deep.equal({message: 'Error', code: 500});
      done();
    });

    $httpBackend.flush();
  });

});
