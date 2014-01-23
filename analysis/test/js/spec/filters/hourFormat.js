'use strict';

describe('Filter: hourFormat', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  beforeEach(module('hourFormatMock'));

  // initialize a new instance of the filter before each test
  var hourFormat,
      hours;

  beforeEach(inject(function ($filter, hours) {
    hourFormat = $filter('hourFormat');
    hours = hours;
  }));

  it('should return a human readable hour format', function () {
    _.each(hours, function (e, i) {
      expect(hourFormat(i)).to.equal(hours[i]);
    });
  });
});
