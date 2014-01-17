'use strict';

describe('Directive: sumaBarChart', function () {

  // load the directive's module
  beforeEach(module('sumaAnalysis'));

  var element,
      // mockElement,
      scope,
      linkScope,
      stub;

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element('<suma-bar-chart id="chart-2" data="data.barChartData"></suma-bar-chart>'),
    // mockElement = '<suma-bar-chart id="chart-2" data="data.barChartData" class="ng-scope ng-isolate-scope"><svg width="500" height="120"><g class="gBar" transform="translate(160,15)"><g class="gRule" transorm="translate(160,15("><line class="line" x2="0" x1="0" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="40.625" x1="40.625" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="81.25" x1="81.25" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="121.875" x1="121.875" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="162.5" x1="162.5" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="203.125" x1="203.125" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="243.75" x1="243.75" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="284.375" x1="284.375" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line><line class="line" x2="325" x1="325" y2="95" y1="0" style="stroke: #cccccc; opacity: 1;" ></line></g><text class="rule" x="0" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">0</text><text class="rule" x="40.625" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">2</text><text class="rule" x="81.25" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">4</text><text class="rule" x="121.875" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">6</text><text class="rule" x="162.5" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">8</text><text class="rule" x="203.125" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">10</text><text class="rule" x="243.75" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">12</text><text class="rule" x="284.375" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">14</text><text class="rule" x="325" text-anchor="middle" dy="-3" y="0" style="font-size: 12px; font-family: Verdana; opacity: 1;">16</text><rect class="rect" data="16" height="20" y="0" width="325" style="fill: #4682b4;"></rect><rect class="rect" data="12" height="20" y="25" width="243.75" style="fill: #4682b4;"></rect><rect class="rect" data="6" height="20" y="50" width="121.875" style="fill: #4682b4;"></rect><rect class="rect" data="4" height="20" y="75" width="81.25" style="fill: #4682b4;"></rect><text class="ann" x="315" text-anchor="end" y="12" style="font-size: 9px; font-family: Verdana; opacity: 1; fill: #ffffff;">16</text><text class="ann" x="233.75" text-anchor="end" y="37" style="font-size: 9px; font-family: Verdana; opacity: 1; fill: #ffffff;">12</text><text class="ann" x="111.875" text-anchor="end" y="62" style="font-size: 9px; font-family: Verdana; opacity: 1; fill: #ffffff;">6</text><text class="ann" x="71.25" text-anchor="end" y="87" style="font-size: 9px; font-family: Verdana; opacity: 1; fill: #ffffff;">4</text></g><text class="barLabel" dy="-3" y="30" x="10" style="font-size: 11px; font-family: Verdana; opacity: 1;">Ground Floor</text><text class="barLabel" dy="-3" y="55" x="10" style="font-size: 11px; font-family: Verdana; opacity: 1;">Lobby and Mezzanine</text><text class="barLabel" dy="-3" y="80" x="10" style="font-size: 11px; font-family: Verdana; opacity: 1;">ConeZone &amp; Creamery</text><text class="barLabel" dy="-3" y="105" x="10" style="font-size: 11px; font-family: Verdana; opacity: 1;">EW 2nd floor</text></svg></suma-bar-chart>';
    scope = $rootScope.$new();

    element = $compile(element)(scope);
    // mockElement = angular.element(mockElement)
    scope.$digest();

    linkScope = element.isolateScope();
  }));

  it('should respond to data change and call render', inject(function ($compile) {
    stub = sinon.stub(linkScope, 'render');
    stub.returns(true);

    scope.$apply(function() {
      scope.data = {};
      scope.data.barChartData = [1, 2, 3, 4];
    });

    scope.$apply(function() {
      scope.data.barChartData = [5, 6, 7, 8];
    });

    expect(stub).to.be.calledTwice();
    stub.restore();
  }));

  // it('should render a bar chart', function (done) {
  //   var data = {"title":"Sum","data":[{"id":3,"title":"Ground Floor","parent":1,"description":"","rank":1,"depth":0,"name":"Ground Floor","count":16,"percent":"42.11"},{"id":4,"title":"Lobby and Mezzanine","parent":1,"description":"","rank":2,"depth":0,"name":"Lobby and Mezzanine","count":12,"percent":"31.58"},{"id":18,"title":"ConeZone & Creamery","parent":5,"description":"","rank":3,"depth":1,"name":"ConeZone & Creamery","count":6,"percent":"15.79"},{"id":22,"title":"EW 2nd floor","parent":6,"description":"","rank":1,"depth":1,"name":"EW 2nd floor","count":4,"percent":"10.53"}]};

  //   scope.$apply(function() {
  //     scope.data = {};
  //     scope.data.barChartData = data;
  //   });

  //   setTimeout(function () {
  //     expect(element.html()).to.deep.equal(mockElement.html());
  //     done();
  //   }, 1300);

  // });
});
