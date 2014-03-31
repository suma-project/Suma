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
    var states = Uistates.setUIState('initial');
    expect(states.initial).to.equal(true);
    expect(states.loading).to.equal(false);
    expect(states.success).to.equal(false);
    expect(states.error).to.equal(false);
  });

  it('should update loading to true', function () {
    var states = Uistates.setUIState('loading');
    expect(states.initial).to.equal(false);
    expect(states.loading).to.equal(true);
    expect(states.success).to.equal(false);
    expect(states.error).to.equal(false);
  });

  it('should update success to true', function () {
    var states = Uistates.setUIState('success');
    expect(states.initial).to.equal(false);
    expect(states.loading).to.equal(false);
    expect(states.success).to.equal(true);
    expect(states.error).to.equal(false);
  });

  it('should update error to true', function () {
    var states = Uistates.setUIState('error');
    expect(states.initial).to.equal(false);
    expect(states.loading).to.equal(false);
    expect(states.success).to.equal(false);
    expect(states.error).to.equal(true);
  });

});
