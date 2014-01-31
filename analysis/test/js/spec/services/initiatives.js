'use strict';

describe('Service: Initiatives', function () {
  // instantiate service
  var Initiatives,
      Timeout,
      cfg,
      $httpBackend,
      $rootScope,
      tPromise;

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _initiatives_, $q, $timeout) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    Initiatives = _initiatives_;
    tPromise = $q.defer();
    Timeout = $timeout;

    cfg = {
      timeoutPromise: tPromise,
      timeout: 180000
    };
  }));

  it('should make an AJAX call', function (done) {
    $httpBackend.whenGET('lib/php/initiatives.php').respond([{}, {}]);

    Initiatives.get(cfg).then(function (result) {
      expect(result.length).to.equal(2);
      done();
    });

    $httpBackend.flush();
  });

  it('should respond with error message on failure', function (done) {
    $httpBackend.whenGET('lib/php/initiatives.php').respond(500, {message: 'Error'});

    Initiatives.get(cfg).then(function (result) {

    }, function (result) {
      expect(result).to.deep.equal({
        message: 'Error',
        code: 500
      });

      done();
    });

    $httpBackend.flush();
  });

  it('should return error with promiseTimeout true on aborted http request', function (done) {
    // simulate aborted request
    $httpBackend.whenGET('lib/php/initiatives.php').respond(0, {message: 'Error'});

    Initiatives.get(cfg).then(function (result) {

    }, function (result) {
      expect(result).to.deep.equal({
        message: 'Initiatives.get Timeout',
        code: 0,
        promiseTimeout: true
      });

      done();
    });

    $httpBackend.flush();
  });

  it('should return error without promiseTimeout on http timeout', function (done) {
    $httpBackend.whenGET('lib/php/initiatives.php').respond([{}, {}]);

    Initiatives.get(cfg).then(function (result) {

    }, function (result) {
      expect(result).to.deep.equal({
        message: 'Initiatives.get Timeout',
        code: 0
      });

      done();
    });

    Timeout.flush();
  });
});
