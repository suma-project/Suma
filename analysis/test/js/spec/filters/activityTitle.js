'use strict';

describe('Filter: activityTitle', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var activityTitle,
      allActs;

  allActs = [
    {id: 1, type: 'activity', title: 'One', activityGroup: 3},
    {id: 2, type: 'activity', title: 'Two', activityGroup: 4},
    {id: 3, type: 'activityGroup', title: 'Uno'},
    {id: 4, type: 'activityGroup', title: 'Dos'}
  ];

  beforeEach(inject(function ($filter) {
    activityTitle = $filter('activityTitle');
  }));

  it('should format activity titles', function () {
    var acts,
        expected;

    acts = [1, 2];
    expected = 'Uno-One, Dos-Two';

    // Assertions
    expect(activityTitle(acts, allActs, 'activity')).to.equal(expected);
  });

  it('should format activity group titles', function () {
    var acts,
        expected;

    acts = [3, 4];
    expected = 'Uno, Dos';

    // Assertions
    expect(activityTitle(acts, allActs, 'activityGroup')).to.equal(expected);
  });

  it('should format return none if no activity titles', function () {
    var acts,
        expected;

    acts = [''];
    expected = 'None';

    // Assertions
    expect(activityTitle(acts, allActs, 'activity')).to.equal(expected);
  });
});
