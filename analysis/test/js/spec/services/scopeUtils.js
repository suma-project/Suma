'use strict';

describe('Service: ScopeUtils', function () {

  // load the service's module
  beforeEach(module('sumaAnalysis'));

  // load report mock for config objects
  beforeEach(module('reportMock'));

  // instantiate service
  var ScopeUtils,
      Q,
      ActsLocs,
      Validation,
      SumaConfig,
      SumaConfig2,
      SumaConfig3,
      scope;

  beforeEach(inject(function (_$rootScope_, _scopeUtils_, _$q_, _actsLocs_, _validation_, sumaConfig, sumaConfig2, sumaConfig3) {
    ScopeUtils = _scopeUtils_;
    Q = _$q_;
    ActsLocs = _actsLocs_;
    Validation = _validation_;
    SumaConfig = sumaConfig;
    SumaConfig2 = sumaConfig2;
    SumaConfig3 = sumaConfig3;
    scope = _$rootScope_.$new();

  }));

  it(':stringifyDays should return a string of days', function () {
    // Assertions
    expect(ScopeUtils.stringifyDays(['mo', 'tu', 'we'])).to.equal('mo,tu,we');
  });

  it(':stringifyDays should null if array is empty or undefined/null', function () {
    // Assertions
    expect(ScopeUtils.stringifyDays([])).to.equal(null);
    expect(ScopeUtils.stringifyDays()).to.equal(null);
  });

  it('ScopeUtils:getMetadata should return an object of activities and locations', function () {
    var actsLocsStub;

    // Stub actsLocs.get
    actsLocsStub = sinon.stub(ActsLocs, 'get');
    actsLocsStub.returns({activities: [], locations: []});

    // Assertions
    expect(ScopeUtils.getMetadata()).to.deep.equal({activities: [], locations: []});

    // Restore Stubs
    actsLocsStub.restore();
  });

  it('ScopeUtils:set should return a params object if params are valid', function () {
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
      zeroCounts: 'no',
      sdate: '20131111',
      edate: '20140101',
      stime: '0400',
      etime: '1600',
      excludeLocs: '',
      requireActs: '',
      excludeActs: '',
      requireActGrps: '',
      excludeActGrps: ''
    };

    // expected Scope
    expectedScope = {
      init: {id: 4},
      classifyCounts: {id: 'count', title: 'Count Date'},
      wholeSession: {id: 'no', title: 'No'},
      zeroCounts: {id: 'no', title: 'No'},
      days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
      sdate: '20131111',
      edate: '20140101',
      stime: '0400',
      etime: '1600',
      requireActs: [''],
      excludeLocs: [''],
      excludeActs: [''],
      requireActGrps: [''],
      excludeActGrps: ['']
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub ScopeUtils.getMetadata
    getMetadataStub = sinon.stub(ScopeUtils, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call ScopeUtils.set
    ScopeUtils.set(urlParams, SumaConfig, inits).then(function (response) {
      // Assertions
      expect(response.actsLocs).to.deep.equal({activities: [{id: 'all', filter: 'allow'}], locations: [{id: 'all'}]});
      expect(response.activities).to.deep.equal([{id: 'all', filter: 'allow'}]);
      expect(response.locations).to.deep.equal([{id: 'all'}]);
      expect(response.errorMessage).to.equal(undefined);
    });

    scope.$digest();

    // Restore Stubs
    getMetadataStub.restore();
  });

  it('ScopeUtils:set should fail if init is invalid', function () {
    var getMetadataStub,
        urlParams,
        inits;

    // mock urlParams
    urlParams = {
      id: 3,
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub ScopeUtils.getMetadata
    getMetadataStub = sinon.stub(ScopeUtils, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call ScopeUtils.set
    ScopeUtils.set(urlParams, SumaConfig, inits).then(function (response) {
    }, function (response) {
      expect(response.message).to.equal('Initiative ID Not Found.');
      expect(response.code).to.equal(500);
    });

    scope.$digest();
    // Restore Stubs
    getMetadataStub.restore();
  });

  it('ScopeUtils:set should not set fields that are false in config', function () {
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

    // Stub ScopeUtils.getMetadata
    getMetadataStub = sinon.stub(ScopeUtils, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call ScopeUtils.set
    ScopeUtils.set(urlParams, SumaConfig3, inits).then(function (response) {
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

  it('ScopeUtils:set return error message with invalid fields', function () {
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
      excludeLocs: 'mouse',
      requireActs: 'mouse',
      excludeActs: 'mouse',
      requireActGrps: 'mouse',
      excludeActGrps: 'mouse'
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub ScopeUtils.getMetadata
    getMetadataStub = sinon.stub(ScopeUtils, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call ScopeUtils.set
    ScopeUtils.set(urlParams, SumaConfig, inits).then(function (response) {
      // Assertions
      expect(response.errorMessage).to.equal('Query parameter input error. Invalid value for classifyCounts. Valid values are "count", "start", or "end". Invalid value for wholeSession. Valid values are "yes" or "no". Invalid value for zeroCounts. Valid values are "yes" or "no". At least one calendar day should be selected. Valid values are "mo", "tu", "we", "th", "fr", "sa", "su". Values should be separated by a comma. Invalid value for excludeActs. Invalid value for requireActs. Invalid value for excludeActGrps. Invalid value for requireActGrps. Invalid value for excludeLocs. Invalid value for sdate. Should be numeric and either 0 or 8 characters in length, not counting punctuation. Invalid value for edate. Should be numeric and either 0 or 8 characters in length, not counting punctuation. Invalid value for stime. Should be numeric and either 0 or 4 characters in length, not counting punctuation. Invalid value for etime. Should be numeric and either 0 or 4 characters in length, not counting punctuation. ');
    });

    scope.$digest();

    // Restore Stubs
    getMetadataStub.restore();
  });

  it('ScopeUtils:set return error message with null acts', function () {
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
      excludeLocs: null,
      requireActs: null,
      excludeActs: null,
      requireActGrps: null,
      excludeActGrps: null
    };

    // mock inits
    inits = [{id: 4}, {id: 5}];

    // Stub ScopeUtils.getMetadata
    getMetadataStub = sinon.stub(ScopeUtils, 'getMetadata');
    getMetadataStub.returns({activities: [{id: 'all'}], locations: [{id: 'all'}]});

    // Call ScopeUtils.set
    ScopeUtils.set(urlParams, SumaConfig, inits).then(function (response) {
      // Assertions
      expect(response.errorMessage).to.equal('Query parameter input error. Invalid value for classifyCounts. Valid values are "count", "start", or "end". Invalid value for wholeSession. Valid values are "yes" or "no". Invalid value for zeroCounts. Valid values are "yes" or "no". At least one calendar day should be selected. Valid values are "mo", "tu", "we", "th", "fr", "sa", "su". Values should be separated by a comma. Invalid value for sdate. Should be numeric and either 0 or 8 characters in length, not counting punctuation. Invalid value for edate. Should be numeric and either 0 or 8 characters in length, not counting punctuation. Invalid value for stime. Should be numeric and either 0 or 4 characters in length, not counting punctuation. Invalid value for etime. Should be numeric and either 0 or 4 characters in length, not counting punctuation. ');
    });

    scope.$digest();

    // Restore Stubs
    getMetadataStub.restore();
  });

  it('ScopeUtils:stringifyActs should return a string of acts or act grps', function () {
    var acts,
        actGrps,
        requireActs,
        excludeActGrps;

    acts = [
      {id: 1, filter: 'require', enabled: true, type: 'activity'},
      {id: 2, filter: 'require', enabled: true, type: 'activity'},
      {id: 3, filter: 'exclude', enabled: true, type: 'activityGroup'},
      {id: 4, filter: 'exclude', enabled: true, type: 'activityGroup'},
      {id: 5, filter: 'require', enabled: false, type: 'activity'},
      {id: 6, filter: 'exclude', enabled: false, type: 'activity'}
    ];

    requireActs = ScopeUtils.stringifyActs(acts, 'require');
    excludeActGrps = ScopeUtils.stringifyActs(acts, 'exclude', true);

    // Assertions
    expect(requireActs).to.equal('1,2');
    expect(excludeActGrps).to.equal('3,4');
  });

  it('ScopeUtils:mapActs should return an array of acts', function () {
    var acts,
        newActs,
        expectedNewActs,
        excludeActs,
        excludeActGrps,
        requireActs,
        requireActGrps;

    acts = [
      {id: 1, filter: 'allow', enabled: true, type: 'activity'},
      {id: 2, filter: 'allow', enabled: true, type: 'activity'},
      {id: 3, filter: 'allow', enabled: true, type: 'activity'},
      {id: 4, filter: 'allow', enabled: true, type: 'activityGroup'},
      {id: 5, filter: 'allow', enabled: true, type: 'activityGroup'},
      {id: 6, filter: 'allow', enabled: true, type: 'activityGroup'}
    ];

    expectedNewActs = [
      {'id':1,'filter':'allow','enabled':true,'type':'activity'},
      {'id':2,'filter':'exclude','enabled':true,'type':'activity'},
      {'id':3,'filter':'require','enabled':true,'type':'activity'},
      {'id':4,'filter':'allow','enabled':true,'type':'activityGroup'},
      {'id':5,'filter':'exclude','enabled':true,'type':'activityGroup'},
      {'id':6,'filter':'require','enabled':true,'type':'activityGroup'}
    ];

    excludeActs = ['2'];
    excludeActGrps = ['5'];
    requireActs = ['3'];
    requireActGrps = ['6'];

    newActs = ScopeUtils.mapActs(acts, excludeActGrps, requireActGrps, excludeActs, requireActs);

    // Assertions
    expect(newActs).to.deep.equal(expectedNewActs);
  });

  it('ScopeUtils:success should reject if error message exists', function () {
    ScopeUtils.success('ERROR').then(function (response) {
      expect(response).to.equal({message: 'ERROR', code: 500});
    });
  });

  it('ScopeUtils:mapLocs should set filter to false if loc is in exclude array and enabled to false if ancestors exist', function () {
    var locs,
        excludeLocs,
        expectedLocs;

    locs = [
      {id: 1, filter: true, enabled: true, ancestors: [1, 2, 3]},
      {id: 2, filter: true, enabled: true, ancestors: []},
      {id: 3, filter: true, enabled: true}
    ];

    excludeLocs = ['1', '2'];

    expectedLocs = [
      {id: 1, filter: false, enabled: false, ancestors: [1, 2, 3]},
      {id: 2, filter: false, enabled: true, ancestors: []},
      {id: 3, filter: true, enabled: true}
    ];

    expect(ScopeUtils.mapLocs(locs, excludeLocs)).to.deep.equal(expectedLocs);
  });

  it ('ScopeUtils:stringifyLocs should convert locations with filter:false to string', function () {
    var locs,
        expectedString;

    locs = [
      {id: 1, filter: false, enabled: false, ancestors: [1, 2, 3]},
      {id: 2, filter: false, enabled: true, ancestors: []},
      {id: 3, filter: true, enabled: true}
    ];

    expectedString = '1,2';

    expect(ScopeUtils.stringifyLocs(locs)).to.equal(expectedString);
  });
});
