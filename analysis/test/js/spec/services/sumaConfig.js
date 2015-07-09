'use strict';

describe('Service: SumaConfig', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // load mock config objs
  beforeEach(module('configMock'));

  // instantiate service
  var SumaConfig,
      configMock,
      prmsMock;

  beforeEach(inject(function (_sumaConfig_, cfgMock, paramsMock) {
    SumaConfig = _sumaConfig_;
    configMock = cfgMock;
    prmsMock = paramsMock;
  }));

  it('SumaConfig.getConfig should return a config object', function () {
    var routes = ['/timeseries', '/calendar', '/hourly', '/sessions', '/raw', '/default'];

    _.each(routes, function (route) {
      expect(SumaConfig.getConfig(route)).to.deep.equal(configMock[route]);
    });
  });

  it('SumaConfig.setParams should return a params object', function () {
    expect(SumaConfig.setParams(configMock['/timeseries'])).to.deep.equal(prmsMock);
  });
});
