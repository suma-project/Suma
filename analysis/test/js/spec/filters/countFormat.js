'use strict';

describe('Filter: countFormat', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var countFormat;
  beforeEach(inject(function ($filter) {
    countFormat = $filter('countFormat');
  }));

  it('should format numbers with thousands separator:"', function () {
    var numbers = {
      1000: '1,000',
      10000: '10,000',
      100000: '100,000',
      1000000: '1,000,000',
      10000000: '10,000,000',
      100000000: '100,000,000'
    };

    for (var num in numbers) {
      expect(countFormat(num)).to.equal(numbers[num])
    }
  });
});
