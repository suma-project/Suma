'use strict';

describe('Filter: capitalize', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('capitalizeMock'));

  // initialize a new instance of the filter before each test
  var capitalize,
      Strings;

  beforeEach(inject(function ($filter, strings) {
    capitalize = $filter('capitalize');
    Strings = strings;
  }));

  it('should capitalize strings', function () {
    for (var str in Strings) {
      expect(capitalize(str)).to.equal(Strings[str]);
    }
  });
});
