'use strict';

describe('Controller: TimeSeriesCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var TimeSeriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TimeSeriesCtrl = $controller('TimeSeriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(true).to.equal(false);
  });
});
