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
    var text = '10000';
    expect(countFormat(text)).to.equal('10,000');
  });

});
