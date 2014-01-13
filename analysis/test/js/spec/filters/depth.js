'use strict';

describe('Filter: depth', function () {

  // load the filter's module
  beforeEach(module('sumaAnalysis'));

  // initialize a new instance of the filter before each test
  var depth;
  beforeEach(inject(function ($filter) {
    depth = $filter('depth');
  }));

  it('should append mdash to title', function () {
    var obj1 = {
      title: 'Title',
      depth: 1
    };

    var obj2 = {
      title: 'Title',
      depth: 2
    };

    expect(depth(obj1)).to.equal('—Title');
    expect(depth(obj2)).to.equal('——Title');
  });

});
