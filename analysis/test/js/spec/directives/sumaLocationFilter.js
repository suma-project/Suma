'use strict';

describe('Directive: sumaLocationFilter', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  // load the directive's template
  beforeEach(module('views/directives/locationFilter.html'));

  var element,
    isolateScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    // instantiate directive
    element = angular.element(
      '<div suma-location-filter locs="locations"></div>'
    );

    scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();

    isolateScope = element.isolateScope();
  }));

  it('select all and select none buttons should impact all locs', function () {
    var allFalse,
        allTrue,
        button,
        button2;

    allTrue = [
      {'id':4,'title':'West Wing','parent':1,'description':'','rank':0,'depth':0,'tooltipTitle':'West Wing','ancestors':[],'filter':true,'enabled':true},
      {'id':5,'title':'Quiet Reading Room','parent':4,'description':'','rank':0,'depth':1,'tooltipTitle':'West Wing: Quiet Reading Room','ancestors':[4],'filter':true,'enabled':true},
      {'id':6,'title':'IT Teaching Center','parent':4,'description':'','rank':1,'depth':1,'tooltipTitle':'West Wing: IT Teaching Center','ancestors':[4],'filter':true,'enabled':true},
      {'id':7,'title':'East Wing','parent':1,'description':'','rank':1,'depth':0,'tooltipTitle':'East Wing','ancestors':[],'filter':true,'enabled':true},
      {'id':8,'title':'Media Lab','parent':7,'description':'','rank':0,'depth':1,'tooltipTitle':'East Wing: Media Lab','ancestors':[7],'filter':true,'enabled':true},
      {'id':9,'title':'Learning Commons','parent':7,'description':'','rank':1,'depth':1,'tooltipTitle':'East Wing: Learning Commons','ancestors':[7],'filter':true,'enabled':true},
      {'id':2,'title':'Ground Floor','parent':1,'description':'','rank':2,'depth':0,'tooltipTitle':'Ground Floor','ancestors':[],'filter':true,'enabled':true},
      {'id':3,'title':'Lobby','parent':1,'description':'','rank':3,'depth':0,'tooltipTitle':'Lobby','ancestors':[],'filter':true,'enabled':true}
    ];

    allFalse = [
      {'id':4,'title':'West Wing','parent':1,'description':'','rank':0,'depth':0,'tooltipTitle':'West Wing','ancestors':[],'filter':false,'enabled':true},
      {'id':5,'title':'Quiet Reading Room','parent':4,'description':'','rank':0,'depth':1,'tooltipTitle':'West Wing: Quiet Reading Room','ancestors':[4],'filter':false,'enabled':true},
      {'id':6,'title':'IT Teaching Center','parent':4,'description':'','rank':1,'depth':1,'tooltipTitle':'West Wing: IT Teaching Center','ancestors':[4],'filter':false,'enabled':true},
      {'id':7,'title':'East Wing','parent':1,'description':'','rank':1,'depth':0,'tooltipTitle':'East Wing','ancestors':[],'filter':false,'enabled':true},
      {'id':8,'title':'Media Lab','parent':7,'description':'','rank':0,'depth':1,'tooltipTitle':'East Wing: Media Lab','ancestors':[7],'filter':false,'enabled':true},
      {'id':9,'title':'Learning Commons','parent':7,'description':'','rank':1,'depth':1,'tooltipTitle':'East Wing: Learning Commons','ancestors':[7],'filter':false,'enabled':true},
      {'id':2,'title':'Ground Floor','parent':1,'description':'','rank':2,'depth':0,'tooltipTitle':'Ground Floor','ancestors':[],'filter':false,'enabled':true},
      {'id':3,'title':'Lobby','parent':1,'description':'','rank':3,'depth':0,'tooltipTitle':'Lobby','ancestors':[],'filter':false,'enabled':true}
    ];

    scope.$apply(function () {
      scope.locations = allTrue;
    });

    button = element.find('button')[1];
    button.click();

    _.each(scope.locations, function (loc) {
      expect(loc.filter).to.equal(false);
    });

    button2 = element.find('button')[0];
    button2.click();

    _.each(scope.locations, function (loc) {
      expect(loc.filter).to.equal(true);
    });
  });

  it('should modify locations array when clicked', function () {
    var allTrue,
        input,
        parentChildrenFalse;

    allTrue = [
      {'id':4,'title':'West Wing','parent':1,'description':'','rank':0,'depth':0,'tooltipTitle':'West Wing','ancestors':[],'filter':true,'enabled':true},
      {'id':5,'title':'Quiet Reading Room','parent':4,'description':'','rank':0,'depth':1,'tooltipTitle':'West Wing: Quiet Reading Room','ancestors':[4],'filter':true,'enabled':true},
      {'id':6,'title':'IT Teaching Center','parent':4,'description':'','rank':1,'depth':1,'tooltipTitle':'West Wing: IT Teaching Center','ancestors':[4],'filter':true,'enabled':true},
      {'id':7,'title':'East Wing','parent':1,'description':'','rank':1,'depth':0,'tooltipTitle':'East Wing','ancestors':[],'filter':true,'enabled':true},
      {'id':8,'title':'Media Lab','parent':7,'description':'','rank':0,'depth':1,'tooltipTitle':'East Wing: Media Lab','ancestors':[7],'filter':true,'enabled':true},
      {'id':9,'title':'Learning Commons','parent':7,'description':'','rank':1,'depth':1,'tooltipTitle':'East Wing: Learning Commons','ancestors':[7],'filter':true,'enabled':true},
      {'id':2,'title':'Ground Floor','parent':1,'description':'','rank':2,'depth':0,'tooltipTitle':'Ground Floor','ancestors':[],'filter':true,'enabled':true},
      {'id':3,'title':'Lobby','parent':1,'description':'','rank':3,'depth':0,'tooltipTitle':'Lobby','ancestors':[],'filter':true,'enabled':true}
    ];

    parentChildrenFalse = [
      {'id':4,'title':'West Wing','parent':1,'description':'','rank':0,'depth':0,'tooltipTitle':'West Wing','ancestors':[],'filter':false,'enabled':true},
      {'id':5,'title':'Quiet Reading Room','parent':4,'description':'','rank':0,'depth':1,'tooltipTitle':'West Wing: Quiet Reading Room','ancestors':[4],'filter':false,'enabled':true},
      {'id':6,'title':'IT Teaching Center','parent':4,'description':'','rank':1,'depth':1,'tooltipTitle':'West Wing: IT Teaching Center','ancestors':[4],'filter':false,'enabled':true},
      {'id':7,'title':'East Wing','parent':1,'description':'','rank':1,'depth':0,'tooltipTitle':'East Wing','ancestors':[],'filter':true,'enabled':true},
      {'id':8,'title':'Media Lab','parent':7,'description':'','rank':0,'depth':1,'tooltipTitle':'East Wing: Media Lab','ancestors':[7],'filter':true,'enabled':true},
      {'id':9,'title':'Learning Commons','parent':7,'description':'','rank':1,'depth':1,'tooltipTitle':'East Wing: Learning Commons','ancestors':[7],'filter':true,'enabled':true},
      {'id':2,'title':'Ground Floor','parent':1,'description':'','rank':2,'depth':0,'tooltipTitle':'Ground Floor','ancestors':[],'filter':true,'enabled':true},
      {'id':3,'title':'Lobby','parent':1,'description':'','rank':3,'depth':0,'tooltipTitle':'Lobby','ancestors':[],'filter':true,'enabled':true}
    ];

    scope.$apply(function () {
      scope.locations = allTrue;
    });

    input = element.find('input')[0];
    // Set first loc to false
    input.click();

    // Assertions
    _.each(scope.locations, function (loc, i) {
      expect(loc.filter).to.equal(parentChildrenFalse[i].filter);
    });

    // Set first loc to true
    input.click();

    // Assertions
    _.each(scope.locations, function (loc, i) {
      expect(loc.filter).to.equal(allTrue[i].filter);
    });
  });
});
