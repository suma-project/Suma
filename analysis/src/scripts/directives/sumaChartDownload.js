'use strict';

angular.module('sumaAnalysis')
  .directive('sumaChartDownload', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/chartDownload.html',
      scope: {chart: '@', filter: '@', title: '@', text: '@'},
      controller: ['$scope', function ($scope) {
        $scope.filterSvg = function (chart, filter) {
          var svg = $(chart).clone();

          svg.find(filter).remove();

          return svg.html();
        };

        $scope.download = function (chart, filter) {
          var canvas,
              img,
              svg;

          // Get svg markup from chart
          if (filter) {
            svg = $scope.filterSvg(chart, filter);
          } else {
            svg = $(chart).html();
          }

          // Insert Invisible Canvas
          $('body').append('<canvas id="canvas" style="display:none"></canvas>');

          // Insert chart into invisible canvas
          canvg(document.getElementById('canvas'), svg);

          // Retrieve contents of invisible canvas
          canvas = document.getElementById('canvas');

          // Convert canvas to data
          img = canvas.toDataURL('image/png');

          // Update href to use data:image
          $scope.href = img;

          // Remove Canvas
          $('canvas').remove();
        };
      }]
    };
  });
