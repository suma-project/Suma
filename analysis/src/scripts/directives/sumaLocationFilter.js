'use strict';

angular.module('sumaAnalysis')
  .directive('sumaLocationFilter', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/locationFilter.html',
      scope: {locs: '='},
      controller: ['$scope', function ($scope) {
        $scope.selectAll = function () {
          _.each($scope.locs, function (loc) {
            loc.filter = true;
            loc.enabled = true;
          });
        };

        $scope.selectNone = function () {
          _.each($scope.locs, function (loc) {
            loc.filter = false;
          });
        };

        $scope.isDescendant = function (loc, parentId) {
          if (_.contains(loc.ancestors, parentId)) {
            return true;
          }
          return false;
        };

        $scope.selectChildren = function (parentId) {
          _.each($scope.locs, function (loc) {
            if ($scope.isDescendant(loc, parentId)) {
              loc.filter = true;
              loc.enabled = true;
            }
          });
        };

        $scope.selectAncestors = function (ancestors) {
          _.each($scope.locs, function (loc) {
            if (_.contains(ancestors, loc.id)) {
              loc.filter = true;
            }
          });
        };

        $scope.disableChildren = function (parentId) {
          _.each($scope.locs, function (loc) {
            if ($scope.isDescendant(loc, parentId)) {
              loc.filter = false;
            }
          });
        };

        $scope.updateCollection = function () {
          if (this.loc.filter) {
            $scope.selectChildren(this.loc.id);
            $scope.selectAncestors(this.loc.ancestors);
          } else {
            $scope.disableChildren(this.loc.id);
          }
        };
      }]
    };
  });
