'use strict';

angular.module('sumaAnalysis')
  .directive('sumaBarChart', function () {
    var BarChart = function () {
      var width = 500,
      oldHeight,
      height;

      function myTrunc(string, n, useWordBoundary){
        var tooLong = string.length > n,
        s_ = tooLong ? string.substr(0, n - 1) : string;
        s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
        return  tooLong ? s_ + '...' : s_;
      }

      function chart(selection) {
        selection.each(function (data) {
          var ann,
          gBar,
          gEnter,
          gRule,
          line,
          rects,
          rule,
          svg,
          text,
          x;

          // Destroy uneeded tooltips
          $('.barLabel').tooltip('destroy');

          // Define scales
          x = d3.scale.linear()
            .domain([0, d3.max(data.map(function (d) { return +d.count; }))])
            .range([0, 285]);

          // Select svg container and join data
          svg = d3.select(this).selectAll('svg').data([data]);

          // Append containers for draw order
          gEnter = svg.enter().append('svg')
            .append('g')
            .attr('class', 'gBar')
            .append('g')
            .attr('class', 'gRule');

          // Set width and height of chart
          svg.attr('width', width);

          oldHeight = height;
          height = 20 + (25 * data.length);

          if (!oldHeight) {
            svg.attr('height', height);
          } else {
            if (height > oldHeight) {
              svg.transition().duration(500).attr('height', height);
            } else {
              svg.transition().delay(500).duration(500).attr('height', height);
            }
          }

          // Apply transforms to containers
          gBar = svg.select('.gBar')
                  .attr('transform', 'translate(170,15)');

          gRule = svg.select('.gRule')
                    .attr('transorm', 'translate(170,15(');

          //Append lines for scale
          line = gRule.selectAll('line').data(x.ticks(3));

          // ENTER
          line.enter()
            .append('line')
            .attr('class', 'line')
            .style('stroke', '#ccc');

          // UPDATE
          line
            .transition().duration(500)
            .attr('x1', 0)
            .attr('x2', 0)
            .style('opacity', 0.000001)
            .transition().delay(750).duration(500)
            .attr('x1', x)
            .attr('x2', x)
            .attr('y1', 0)
            .attr('y2', function () {return 25 * data.length - 5; })
            .style('opacity', 1);

          // EXIT
          line.exit()
            .transition().duration(500)
            .attr('x1', 0)
            .attr('x2', 0)
            .style('opacity', 0.000001)
            .remove();

          // Append line labels
          rule = gBar.selectAll('.rule').data(x.ticks(3));

          // ENTER
          rule.enter().append('text')
            .attr('class', 'rule')
            .style('font-size', '12px')
            .style('font-family', 'Verdana');

          // UPDATE
          rule
            .transition().duration(500)
            .attr('x', 0)
            .style('opacity', 0.000001)
            .transition().delay(750).duration(500)
            .attr('x', x)
            .attr('y', -3)
            .attr('dy', -3)
            .attr('text-anchor', 'middle')
            .text(String)
            .style('opacity', 1);

          // EXIT
          rule.exit()
            .transition().duration(500)
            .attr('x', 0)
            .style('opacity', 0.000001)
            .remove();

          // Append bar rectangles
          rects = gBar.selectAll('rect').data(data);

          // ENTER
          rects.enter()
            .append('rect')
            .attr('class', 'rect')
            .style('fill', 'steelblue');

          // UPDATE
          rects
            .transition().duration(500)
            .attr('width', 0)
            .attr('y', function (d, i) {return 25 * i; })
            .attr('height', '20')
            .attr('data', function (d) {return d.count; })
            .transition().delay(750).duration(500)
            .attr('width', function (d) {
              var width;
              // Give really small counts a minimum width
              if (x(d.count) < 5 && x(d.count) >= 0) {
                width = 5 + x(d.count);
              } else {
                width = x(d.count);
              }

              return width;
            });

          // EXIT
          rects.exit()
            .transition().duration(500)
            .attr('width', 0)
            .remove();

          // Append bar labels
          text = svg.selectAll('.barLabel').data(data);

          // ENTER
          text.enter()
            .append('text')
            .attr('class', 'barLabel')
            .style('font-size', '11px')
            .style('font-family', 'Verdana')
            .attr('data-toggle', 'tooltip');

          // UPDATE
          text
            .attr('title', function (d, i) {
              return d.tooltipTitle;
            })
            .transition().duration(500)
            .style('opacity', 0.000001)
            .transition().delay(750).duration(500)
            .attr('x', 10)
            .attr('y', function (d, i) {return 25 * i + 30; })
            .attr('dy', -3)
            .text(function (d) {
              var text;

              if (d.altName) {
                text = d.altName;
              } else {
                text = d.name;
              }

              return _.unescape(myTrunc(text, 22, true));
            })
            .style('opacity', 1);

          // EXIT
          text.exit()
            .transition().duration(500)
            .style('opacity', 0.000001)
            .remove();

          // Append bar annotation
          ann = gBar.selectAll('.ann').data(data);

          // ENTER
          ann.enter()
            .append('text')
            .attr('class', 'ann')
            .style('font-size', '9px')
            .style('font-family', 'Verdana');

          // UPDATE
          ann
            .transition().duration(500)
            .attr('x', 0)
            .style('opacity', 0.000001)
            .transition().delay(750).duration(500)
            .attr('x', function (d) {
              if (x(d.count) > 40) {
                return x(d.count) - 10;
              }
              return x(d.count) + 15;
            })
            .attr('y', function (d, i) {
              return 25 * i + 12;
            })
            .style('fill', function (d) {
              if (x(d.count) > '40') {
                return 'white';
              }
              return 'black';
            })
            .attr('text-anchor', function (d) {
              if (x(d.count) > '40') {
                return 'end';
              }
              return 'start';
            })
            .text(function (d) {
              return d.count;
            })
            .style('opacity', 1);

          // EXIT
          ann.exit()
            .transition().duration(500)
            .style('opacity', 0.000001)
            .remove();

          // Initialize Tooltips
          $('.barLabel').tooltip({
            container: 'body',
            html: true,
            placement: 'auto'
          });

        });
      }

      return chart;
    };

    return {
      restrict: 'A',
      scope: {data: '='},
      link: function postLink(scope, element, attrs) {
        var chart = new BarChart();

        scope.$on('$locationChangeSuccess', function (e) {
          $('.barLabel').tooltip('hide');
        });

        scope.$watch('data', function (newData) {
          return scope.render(newData);
        });

        scope.render = function (data) {
          if (!data) {
            return;
          }

          d3.select(element[0])
            .datum(data.data)
            .call(chart);
        };
      }
    };
  });
