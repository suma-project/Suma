'use strict';

describe('Filter: truncate', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var truncate,
      strings,
      expectedNoBoundary,
      expectedBoundary,
      expectedOmission;

  expectedNoBoundary = [
    'The mou...',
    'The cat...'
  ];

  expectedBoundary = [
    'The...',
    'The cat...'
  ];

  expectedOmission = [
    'The mouse5',
    'The cat i5'
  ];

  strings = [
    'The mouse and the motorcycle',
    'The cat in the hat'
  ];

  beforeEach(inject(function ($filter) {
    truncate = $filter('truncate');
  }));

  it('should truncate strings to default of 30 if no length', function () {
    _.each(strings, function (string, i) {
      expect(truncate(string)).to.equal(strings[i]);
    });
  });

  it('should truncate strings and ignore boundary', function () {
    _.each(strings, function (string, i) {
      expect(truncate(string, 10)).to.equal(expectedNoBoundary[i]);
    });
  });

  it('should truncate strings and honor boundary', function () {
    _.each(strings, function (string, i) {
      expect(truncate(string, 10, ' ')).to.equal(expectedBoundary[i]);
    });
  });

  it('should truncate strings and add expected omission characters', function () {
    _.each(strings, function (string, i) {
      expect(truncate(string, 10, '', 5)).to.equal(expectedOmission[i]);
    });
  });

  it('should return string if shorter than limit', function () {
    expect(truncate('mouse', 20)).to.equal('mouse');
  });
});
