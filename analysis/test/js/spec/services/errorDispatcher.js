'use strict';

describe('Service: Errordispatcher', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var Errordispatcher;
  beforeEach(inject(function (_errorDispatcher_) {
    Errordispatcher = _errorDispatcher_;
  }));

  it('should do something', function () {
    expect(!!Errordispatcher).to.be(true);
  });

});
