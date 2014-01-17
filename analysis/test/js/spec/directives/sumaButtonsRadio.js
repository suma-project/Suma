'use strict';

describe('Directive: sumaButtonsRadio', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  // load the directive's template
  beforeEach(module('views/directives/buttonsRadio.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    // instantiate directive
    element = angular.element(
      '<suma-buttons-radio model="data" options="options"></suma-buttons-radio>'
    )

    scope = $rootScope.$new();

    // set scope data
    scope.$apply(function() {
      scope.options = [
        {title: 'Daily Avg', val: 'avg', data: [1, 2, 3, 4]},
        {title: 'Daily Sum', val: 'sum', data: [2, 4, 6, 8]}
      ];
      scope.data = scope.options[1];
    });

    $compile(element)(scope);
    scope.$digest();
  }));

  it('should create a button group', inject(function ($compile, $rootScope) {
    var buttons = element.find('button');
    expect(buttons.length).to.equal(2);
  }));

  it('should change active state when clicked', inject(function ($compile, $rootScope) {
    var buttons = element.find('button');
    expect(buttons.eq(0)).not.to.have.class('active');
    expect(buttons.eq(1)).to.have.class('active');

    // click 1st button
    buttons.eq(0).click();

    expect(buttons.eq(0)).to.have.class('active');
    expect(buttons.eq(1)).not.to.have.class('active');

    //click 2nd button
    buttons.eq(1).click();

    expect(buttons.eq(0)).not.to.have.class('active');
    expect(buttons.eq(1)).to.have.class('active');

    //click 2nd button again
    buttons.eq(1).click();

    expect(buttons.eq(0)).not.to.have.class('active');
    expect(buttons.eq(1)).to.have.class('active');
  }));
});
