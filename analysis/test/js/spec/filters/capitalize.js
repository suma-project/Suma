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

  it('should do nothing with null value', function () {
    var input = null;
    expect(capitalize(input)).to.equal(null);
  });

  it('should do nothing with undefined value', function () {
    var input;
    expect(capitalize(input)).to.equal(undefined);
  });

  it('should capitalize strings', function () {
    for (var str in Strings) {
      expect(capitalize(str)).to.equal(Strings[str]);
    }
  });
});
