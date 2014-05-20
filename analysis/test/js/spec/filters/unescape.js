'use strict';

describe('Filter: unescape', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var unescape,
      escapedStrings,
      unescapedStrings;

  escapedStrings = [
    '&gt; 60 minutes'
  ];

  unescapedStrings = [
    '> 60 minutes'
  ];

  beforeEach(inject(function ($filter) {
    unescape = $filter('unescape');
  }));

  it('should escape HTML entities', function () {
    _.each(escapedStrings, function (string, i) {
      expect(unescape(string)).to.equal(unescapedStrings[i]);
    });
  });
});
