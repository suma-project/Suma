'use strict';

describe('Directive: sumaActivityFilter', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  // load the directive's template
  beforeEach(module('views/directives/activityFilter.html'));

  var element,
    isolateScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    // instantiate directive
    element = angular.element(
      '<div suma-activity-filter acts="activities"></div>'
    );

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    isolateScope = element.isolateScope();
  }));

  it('should reset activities when reset button is clicked', function () {
    var expected = [
        {id: 1, type: 'activity', filter: 'allow', activityGroup: 4, title: 'One', enabled: true},
        {id: 2, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Two', enabled: true},
        {id: 3, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Three', enabled: true},
        {id: 4, type: 'activityGroup', filter: 'allow', activityGroup: 4, title: 'Type', enabled: true}
      ];

    scope.$apply(function() {
      scope.activities = [
        {id: 1, type: 'activity', filter: 'require', activityGroup: 4, title: 'One', enabled: false},
        {id: 2, type: 'activity', filter: 'exclude', activityGroup: 4, title: 'Two', enabled: true},
        {id: 3, type: 'activity', filter: 'exclude', activityGroup: 4, title: 'Three', enabled: true},
        {id: 4, type: 'activityGroup', filter: 'require', activityGroup: 4, title: 'Type', enabled: true},
      ];
    });

    var button = element.find('button')[0];
    button.click();

    _.each(scope.activities, function (act) {
      expect(act.filter).to.equal('allow');
      expect(act.enabled).to.equal(true);
    });
  });

  it('should modify activities array when clicked', function () {
    var inputs,
        expectedRequire,
        expectedExclude,
        testRequire,
        testExclude;

    testRequire = [
      {id: 4, type: 'activityGroup', filter: 'require', activityGroup: 4, title: 'Type', enabled: true},
      {id: 1, type: 'activity', filter: 'allow', activityGroup: 4, title: 'One', enabled: false},
      {id: 2, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Two', enabled: false},
      {id: 3, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Three', enabled: false}
    ];

    testExclude = [
      {id: 4, type: 'activityGroup', filter: 'exclude', activityGroup: 4, title: 'Type', enabled: true},
      {id: 1, type: 'activity', filter: 'allow', activityGroup: 4, title: 'One', enabled: true},
      {id: 2, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Two', enabled: true},
      {id: 3, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Three', enabled: true}
    ];

    expectedRequire = [
      {id: 4, type: 'activityGroup', filter: 'require', activityGroup: 4, title: 'Type', enabled: true},
      {id: 1, type: 'activity', filter: 'allow', activityGroup: 4, title: 'One', enabled: true},
      {id: 2, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Two', enabled: true},
      {id: 3, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Three', enabled: true}
    ];

    expectedExclude = [
      {id: 4, type: 'activityGroup', filter: 'exclude', activityGroup: 4, title: 'Type', enabled: true},
      {id: 1, type: 'activity', filter: 'allow', activityGroup: 4, title: 'One', enabled: false},
      {id: 2, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Two', enabled: false},
      {id: 3, type: 'activity', filter: 'allow', activityGroup: 4, title: 'Three', enabled: false}
    ];

    scope.$apply(function () {
      scope.activities = testRequire;
    });

    isolateScope.setStatus();

    // Assertions
    _.each(scope.activities, function (act, i) {
      expect(act.filter).to.equal(expectedRequire[i].filter);
      expect(act.enabled).to.equal(expectedRequire[i].enabled);
    });

    scope.$apply(function () {
      scope.activities = testExclude;
    });

    isolateScope.setStatus();

    // Assertions
    _.each(scope.activities, function (act, i) {
      expect(act.filter).to.equal(expectedExclude[i].filter);
      expect(act.enabled).to.equal(expectedExclude[i].enabled);
    });
  });
});
