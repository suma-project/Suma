'use strict';

describe('Service: Validation', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // instantiate service
  var Validation,
      valid,
      invalid;

  valid = [
    {value: '', max: 4},
    {value: '', max: 8},
    {value: '0500', max: 4},
    {value: '05:00', max: 4},
    {value: '3:00', max: 4, pad: true},
    {value: '0', max: 1},
    {value: '20140101', max: 8},
    {value: '2014-01-01', max: 8},
    {value: 1500, max: 4},
    {value: 20140101, max: 8}
  ];

  invalid = [
    {value: '05', max: 4},
    {value: 'AAAA', max: 4},
    {value: 'A-A-A-A', max: 4},
    {value: 'AAAAAAAA', max: 8},
    {value: '0', max: 0},
    {value: '2014-1-1', max: 8},
    {value: '2014-1-11', max: 8},
    {value: '2014----', max: 8}
  ];

  beforeEach(inject(function (_validation_) {
    Validation = _validation_;
  }));

  it(':validateDateTime should return true if string is valid', function () {
    _.each(valid, function (e, i) {
      expect(Validation.validateDateTime(e.value, e.max, e.pad)).to.equal(true);
    });
  });

  it(':validateDateTime should return false if string is invalid', function () {
    _.each(invalid, function (e, i) {
      expect(Validation.validateDateTime(e.value, e.max, e.pad)).to.equal(false);
    });
  });
});
