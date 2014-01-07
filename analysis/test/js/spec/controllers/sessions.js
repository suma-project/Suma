'use strict';

describe('Controller: SessionsCtrl', function () {

  // load the controller's module
  beforeEach(module('sumaAnalysis'));

  var SessionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
