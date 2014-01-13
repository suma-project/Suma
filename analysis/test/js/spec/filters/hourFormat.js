'use strict';

describe('Filter: hourFormat', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var hourFormat;
  beforeEach(inject(function ($filter) {
    hourFormat = $filter('hourFormat');
  }));

  it('should return a human readable hour format', function () {
    var hours = {
      0: '12:00 AM',
      1: '01:00 AM',
      2: '02:00 AM',
      3: '03:00 AM',
      4: '04:00 AM',
      5: '05:00 AM',
      6: '06:00 AM',
      7: '07:00 AM',
      8: '08:00 AM',
      9: '09:00 AM',
      10: '10:00 AM',
      11: '11:00 AM',
      12: '12:00 PM',
      13: '01:00 PM',
      14: '02:00 PM',
      15: '03:00 PM',
      16: '04:00 PM',
      17: '05:00 PM',
      18: '06:00 PM',
      19: '07:00 PM',
      20: '08:00 PM',
      21: '09:00 PM',
      22: '10:00 PM',
      23: '11:00 PM'
    };

    _.each(hours, function (e, i) {
      expect(hourFormat(i)).to.equal(hours[i]);
    });

  });

});
