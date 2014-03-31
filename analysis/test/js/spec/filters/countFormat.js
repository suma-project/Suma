'use strict';

describe('Filter: countFormat', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('countFormatMock'));

  // initialize a new instance of the filter before each test
  var countFormat,
      Numbers;

  beforeEach(inject(function ($filter, numbers) {
    countFormat = $filter('countFormat');
    Numbers = numbers;
  }));

  it('should format numbers with thousands separator:"', function () {
    for (var num in Numbers) {
      expect(countFormat(num)).to.equal(Numbers[num]);
    }
  });
});
