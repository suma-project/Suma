'use strict';

describe('Service: Actslocs', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('actsLocsMock'));

  // instantiate service
  var Actslocs,
      Init,
      ProcessedActsLocs;

  beforeEach(inject(function (_actsLocs_, init, processedActsLocs) {
    Actslocs = _actsLocs_;
    Init = init;
    ProcessedActsLocs = processedActsLocs;
  }));

  it('ActsLocs:get should return an object of activities and locations', function () {
    var actsLocs = Actslocs.get(Init);
    expect(actsLocs).to.deep.equal(ProcessedActsLocs);
  });
});
