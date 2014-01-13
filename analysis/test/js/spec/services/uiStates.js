'use strict';

describe('Service: Uistates', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var Uistates,
      Rootscope;

  beforeEach(inject(function (_uiStates_, _$rootScope_) {
    Uistates = _uiStates_;
    Rootscope = _$rootScope_;
  }));

  it('should update initial to true', function () {
    Uistates.setUIState('initial', Rootscope);
    expect(Rootscope['initial']).to.equal(true);
    expect(Rootscope['loading']).to.equal(false);
    expect(Rootscope['success']).to.equal(false);
    expect(Rootscope['error']).to.equal(false);
  });

  it('should update loading to true', function () {
    Uistates.setUIState('loading', Rootscope);
    expect(Rootscope['initial']).to.equal(false);
    expect(Rootscope['loading']).to.equal(true);
    expect(Rootscope['success']).to.equal(false);
    expect(Rootscope['error']).to.equal(false);
  });

  it('should update success to true', function () {
    Uistates.setUIState('success', Rootscope);
    expect(Rootscope['initial']).to.equal(false);
    expect(Rootscope['loading']).to.equal(false);
    expect(Rootscope['success']).to.equal(true);
    expect(Rootscope['error']).to.equal(false);
  });

  it('should update error to true', function () {
    Uistates.setUIState('error', Rootscope);
    expect(Rootscope['initial']).to.equal(false);
    expect(Rootscope['loading']).to.equal(false);
    expect(Rootscope['success']).to.equal(false);
    expect(Rootscope['error']).to.equal(true);
  });

});
