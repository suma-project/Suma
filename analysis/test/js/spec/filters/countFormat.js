'use strict';

describe('Filter: countFormat', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('countFormatMock'));

  // initialize a new instance of the filter before each test
  var countFormat,
      numbers;

  beforeEach(inject(function ($filter, numbers) {
    countFormat = $filter('countFormat');
    numbers = numbers;
  }));

  it('should format numbers with thousands separator:"', function () {
    for (var num in numbers) {
      expect(countFormat(num)).to.equal(numbers[num]);
    }
  });
});
