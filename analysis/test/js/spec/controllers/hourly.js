'use strict';

describe('Controller: HourlyCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var HourlyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HourlyCtrl = $controller('HourlyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
