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

  it('should update state', function () {
    Uistates.setUIState('initial', Rootscope);
    expect(Rootscope.state).to.equal(undefined);
  });

});
