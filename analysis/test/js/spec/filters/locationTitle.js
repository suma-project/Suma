'use strict';

describe('Filter: locationTitle', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var locationTitle,
      allLocs;

  allLocs = [
    {id: 1, title: 'One'},
    {id: 2, title: 'Two'},
    {id: 3, title: 'Uno'},
    {id: 4, title: 'Dos'}
  ];

  beforeEach(inject(function ($filter) {
    locationTitle = $filter('locationTitle');
  }));

  it('should format location titles', function () {
    var locs,
        expected;

    locs = [1, 2];
    expected = 'One, Two';

    // Assertions
    expect(locationTitle(locs, allLocs)).to.equal(expected);
  });

  it('should format return none if no locations in exclude array', function () {
    var locs,
        expected;

    locs = [''];
    expected = 'None';

    // Assertions
    expect(locationTitle(locs, allLocs)).to.equal(expected);
  });
});
