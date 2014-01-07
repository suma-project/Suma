'use strict';

describe('Service: Sessionsdata', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var Sessionsdata;
  beforeEach(inject(function (_sessionsData_) {
    Sessionsdata = _sessionsData_;
  }));

  it('should do something', function () {
    expect(!!Sessionsdata).to.equal(true);
  });

});
