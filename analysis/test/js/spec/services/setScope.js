'use strict';

describe('Service: SetScope', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // load report mock for config objects
  beforeEach(module('reportMock'));

  // instantiate service
  var SetScope,
      Q,
      ActsLocs,
      Validation,
      SumaConfig,
      SumaConfig2,
      SumaConfig3,
      scope;

  beforeEach(inject(function (_$rootScope_, _setScope_, _$q_, _actsLocs_, _validation_, sumaConfig, sumaConfig2, sumaConfig3) {
    SetScope = _setScope_;
    Q = _$q_;
    ActsLocs = _actsLocs_;
    Validation = _validation_;
    SumaConfig = sumaConfig;
    SumaConfig2 = sumaConfig2;
    SumaConfig3 = sumaConfig3;
    scope = _$rootScope_.$new();

  }));

  it('SetScope:getMetadata should return an object of activities and locations', function () {
    var actsLocsStub;

    // Stub actsLocs.get
    actsLocsStub = sinon.stub(ActsLocs, 'get');
    actsLocsStub.returns({activities: [], locations: []});

    // Assertions
    expect(SetScope.getMetadata()).to.deep.equal({activities: [], locations: []});

    // Restore Stubs
    actsLocsStub.restore();
  });

  it('SetScope:set should return a params object if params are valid', function () {
    var expectedScope,
        getMetadataStub,
        urlParams,
        inits;

    // mock urlParams
    urlParams = {
      id: 4,
      classifyCounts: 'count',
      days: 'mo,tu,we,th,fr,sa,su',
      wholeSession: 'no',
      sdate: '20131111',
      edate: '20140101',
      stime: '0400',
      etime: '1600',
      activity: 'all',
      location: 'all'
    };

    // expected Scope
    expectedScope = {
      init: {id: 4},
      classifyCounts: {id: 'count', title: 'Count Date'},
      wholeSession: {id: 'no', title: 'No'},
      days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
      activity: {id: 'all'},
      location: {id: 'all'},
      sdate: '20131111',
      edate: '20140101',
      stime: '0400',
      etime: '1600'
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub SetScope.getMetadata
    getMetadataStub = sinon.stub(SetScope, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call SetScope.set
    SetScope.set(urlParams, SumaConfig, inits).then(function (response) {
      // Assertions
      expect(response.actsLocs).to.deep.equal({activities: [{id: 'all'}], locations: [{id: 'all'}]});
      expect(response.activities).to.deep.equal([{id: 'all'}]);
      expect(response.locations).to.deep.equal([{id: 'all'}]);
      expect(response.errorMessage).to.equal(undefined);
      expect(response.params).to.deep.equal(expectedScope);
    });

    scope.$digest();

    // Restore Stubs
    getMetadataStub.restore();
  });

  it('SetScope:set should return a params object if params are valid', function () {
    var expectedScope,
        getMetadataStub,
        urlParams,
        inits;

    // mock urlParams
    urlParams = {
      id: 4,
      classifyCounts: 'count',
      days: 'mo,tu,we,th,fr,sa,su',
      wholeSession: 'no',
      sdate: '20131111',
      edate: '20140101',
      stime: '0400',
      etime: '1600',
      activity: 'activity-4',
      location: 'all'
    };

    // expected Scope
    expectedScope = {
      init: {id: 4},
      classifyCounts: {id: 'count', title: 'Count Date'},
      wholeSession: {id: 'no', title: 'No'},
      days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
      activity: {id: '4', type: 'activity'},
      location: {id: 'all'},
      sdate: '20131111',
      edate: '20140101',
      stime: '0400',
      etime: '1600'
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub SetScope.getMetadata
    getMetadataStub = sinon.stub(SetScope, 'getMetadata');
    getMetadataStub.returns({activities: [{id: '4', type: 'activity'}], locations: [{id: 'all'}]});

    // Call SetScope.set
    SetScope.set(urlParams, SumaConfig, inits).then(function (response) {
      // Assertions
      expect(response.actsLocs).to.deep.equal({activities: [{id: '4', type: 'activity'}], locations: [{id: 'all'}]});
      expect(response.activities).to.deep.equal([{id: '4', type: 'activity'}]);
      expect(response.locations).to.deep.equal([{id: 'all'}]);
      expect(response.errorMessage).to.equal(undefined);
      expect(response.params).to.deep.equal(expectedScope);
    });

    scope.$digest();

    // Restore Stubs
    getMetadataStub.restore();
  });

  it('SetScope:set should fail if init is invalid', function () {
    var getMetadataStub,
        urlParams,
        inits;

    // mock urlParams
    urlParams = {
      id: 3,
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub SetScope.getMetadata
    getMetadataStub = sinon.stub(SetScope, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call SetScope.set
    SetScope.set(urlParams, SumaConfig, inits).then(function (response) {
    }, function (response) {
      expect(response.message).to.equal('Initiative ID Not Found.');
      expect(response.code).to.equal(500);
    });

    scope.$digest();
    // Restore Stubs
    getMetadataStub.restore();
  });

  it('SetScope:set should not set fields that are false in config', function () {
    var expectedScope,
        getMetadataStub,
        urlParams,
        inits;

    // mock urlParams
    urlParams = {
      id: 4,
    };

    expectedScope = {
      init: {id: 4}
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub SetScope.getMetadata
    getMetadataStub = sinon.stub(SetScope, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call SetScope.set
    SetScope.set(urlParams, SumaConfig3, inits).then(function (response) {
      // Assertions
      expect(response.actsLocs).to.deep.equal(undefined);
      expect(response.activities).to.deep.equal(undefined);
      expect(response.locations).to.deep.equal(undefined);
      expect(response.errorMessage).to.equal(undefined);
      expect(response.params).to.deep.equal(expectedScope);
    });

    scope.$digest();
    // Restore Stubs
    getMetadataStub.restore();
  });

  it('SetScope:set return error message with invalid fields', function () {
    var expectedScope,
        getMetadataStub,
        urlParams,
        inits;

    // mock urlParams
    urlParams = {
      id: 4,
      classifyCounts: 'mouse',
      daygroup: 'mouse',
      wholeSession: 'mouse',
      sdate: 'mouse',
      edate: 'mouse',
      stime: 'mouse',
      etime: 'mouse',
      activity: 'mouse',
      location: 'mouse'
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub SetScope.getMetadata
    getMetadataStub = sinon.stub(SetScope, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call SetScope.set
    SetScope.set(urlParams, SumaConfig, inits).then(function (response) {
      // Assertions
      expect(response.errorMessage).to.equal('Query parameter input error. Invalid value for classifyCounts. Valid values are "count", "start", or "end". Invalid value for wholeSession. Valid values are "yes" or "no". Invalid value for days. Valid values are "mo", "tu", "we", "th", "fr", "sa", "su". Values should be separated by a comma. Invalid value for activity. Invalid value for location. Invalid value for sdate. Should be numeric and either 0 or 8 characters in length, not counting punctuation. Invalid value for edate. Should be numeric and either 0 or 8 characters in length, not counting punctuation. Invalid value for stime. Should be numeric and either 0 or 4 characters in length, not counting punctuation. Invalid value for etime. Should be numeric and either 0 or 4 characters in length, not counting punctuation. ');
    });

    scope.$digest();

    // Restore Stubs
    getMetadataStub.restore();
  });
});
