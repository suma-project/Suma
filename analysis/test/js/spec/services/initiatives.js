'use strict';

describe('Service: Initiatives', function () {
  // instantiate service
  var Initiatives,
      $httpBackend,
      $rootScope;

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _initiatives_) {
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    Initiatives = _initiatives_;
  }));

  it('should make an AJAX call', function (done) {
    $httpBackend.whenGET('lib/php/initiatives.php').respond([{}, {}]);

    Initiatives.get().then(function (result) {
      expect(result.length).to.equal(2);
      done();
    });

    $httpBackend.flush();
  });

  it('should respond with error message on failure', function (done) {
    $httpBackend.whenGET('lib/php/initiatives.php').respond(500, {message: 'Error'});

    Initiatives.get().then(function (result) {

    }, function (result) {
      expect(result).to.deep.equal({message: 'Error', code: 500});
      done();
    });

    $httpBackend.flush();
  });
});
