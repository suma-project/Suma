'use strict';

describe('Service: Errordispatcher', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var Errordispatcher,
      Rootscope,
      Uistates,
      data,
      stub;

  beforeEach(inject(function (_errorDispatcher_, _uiStates_, _$rootScope_) {
    Errordispatcher = _errorDispatcher_;
    Rootscope = _$rootScope_,
    Uistates = _uiStates_;

    data = {message: 'Hello', code: 401};

    stub = sinon.stub(Uistates, 'setUIState');
    stub.returns(true);
  }));

  it('should update state via Uistates', function () {
    Errordispatcher.dispatch(data, Rootscope);

    expect(Uistates.setUIState).to.be.calledOnce();

    stub.restore();
  });

  it('should attach error message and code to scope', function () {
    Errordispatcher.dispatch(data, Rootscope);

    expect(Rootscope.errorMessage).to.equal(data.message);
    expect(Rootscope.errorCode).to.equal(data.code);

    stub.restore();
  });

});
