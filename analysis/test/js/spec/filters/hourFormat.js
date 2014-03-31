'use strict';

describe('Filter: hourFormat', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('hourFormatMock'));

  // initialize a new instance of the filter before each test
  var hourFormat,
      Hours;

  beforeEach(inject(function ($filter, hours) {
    hourFormat = $filter('hourFormat');
    Hours = hours;
  }));

  it('should return a human readable hour format', function () {
    _.each(Hours, function (e, i) {
      expect(hourFormat(i)).to.equal(Hours[i]);
    });
  });
});
