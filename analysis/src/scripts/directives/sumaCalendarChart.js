'use strict';

angular.module('sumaAnalysis')
  .directive('sumaCalendarChart', function () {
    var iqr,
        quantiles,
        upperOutlier,
        lowerOutlier,
        min,
        max;

    var Calendar = function () {
      var width = 960,
          height = 136,
          totalHeight;

      function chart(selection) {
        var monthCount = 0,
            cellSize = 16,
            day = d3.time.format('%w'),
            week = d3.time.format('%U'),
            format = d3.time.format('%Y-%m-%d'),
            month_name = d3.time.format('%b'),
            days = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
            data,
            color,
            colorRange = ['#d6e685', '#8cc665', '#44a340', '#1e6823'],
            key,
            keySet,
            outlierKey,
            outlierKeyset;

        function setDayVisibility(i) {
          if (i === 0 || i === 2 || i === 4 || i === 6) {
            return 0;
          }

          return 1;
        }

        function setMonthLabelPos (d) {
          if (d.getDay() !== 0 && monthCount > 0) {
            return (week(d)  * cellSize) + cellSize;
          }

          monthCount += 1;

          return week(d) * cellSize;
        }

        function setColor (d) {
          if (data[d] === undefined || data[d] === null) {
            return '#eee';
          }

          if (data[d] >= upperOutlier) {
            return '#ff0000';
          }

          if (data[d] <= lowerOutlier) {
            return '#808080';
          }

          return color(data[d]);
        }

        function setTitle (d) {
          var count,
          date = moment(d, 'YYYY-MM-DD').format('dd');

          if (data[d] === undefined || data[d] === null) {
            count = 'No Data Found';
          } else {
            count = data[d].toFixed(2);
          }

          return date + ' : ' + d + ' : ' + count;
        }

        function setKeyColor (d, i) {
          if (i === 0) {
            return '#eee';
          }

          return colorRange[i-1];
        }

        function setKeyTitle (d, i) {
          if (i === 0) {
            return 'No Data Found';
          }

          if (i === 4) {
            return quantiles[2].toFixed(2) + '+';
          }

          if (i === 1) {
            return 'Less than ' + quantiles[0].toFixed(2);
          }

          if (i === 2) {
            return quantiles[0].toFixed(2) + ' to ' + (quantiles[1] - 0.01).toFixed(2);
          }

          if (i === 3) {
            return quantiles[1].toFixed(2) + ' to ' + (quantiles[2] - 0.01).toFixed(2);
          }
        }

        function setOutlierColor (d, i) {
          if (i === 0) {
            return '#808080';
          }

          return '#ff0000';
        }

        function setOutlierTitle (d, i) {
          if (i === 0) {
            if (lowerOutlier > 0) {
              return 'Less than ' + lowerOutlier.toFixed(2);
            }

            return 'No Threshold';
          }

          return 'Greater than ' + upperOutlier.toFixed(2);
        }

        selection.each(function (counts) {
          var domain,
          svg,
          range,
          gWrap,
          gWrapEnter,
          rect;

          // Actual display data
          data = d3.nest()
            .key(function (d) { return d.date; })
            .rollup(function (d) { return d[0].count; })
            .map(counts);

          // Data range
          range = d3.range(
            parseInt(_.first(counts).date.split('-')[0], 10),
            parseInt(_.last(counts).date.split('-')[0], 10) + 1
          ).reverse();

          // Color scale domain
          domain = d3.values(data);

          // Color scale
          color = d3.scale.quantile()
            .domain(domain)
            .range(colorRange);

          // Stats
          quantiles = color.quantiles();
          iqr = quantiles[2] - quantiles[0];
          upperOutlier = quantiles[2] + (1.5 * iqr);
          lowerOutlier = quantiles[0] - (1.5 * iqr);
          min = d3.min(domain);
          max = d3.max(domain);

          // Define svg wrapper
          svg = d3.select(this).selectAll('svg').data([data]);

          // Append gWrap g element
          svg.enter().append('svg')
            .append('g')
            .attr('class', 'gWrap');

          svg.attr('font-size', '10px');

          // Select gWrap
          gWrap = svg.select('.gWrap').selectAll('g').data(range);

          // Append inner g elements
          gWrapEnter = gWrap.enter()
            .append('g')
            .attr('class', 'gInner')
            .attr('transform', function (d, i) {
              var rowHeight;

              if (i > 0) {
                rowHeight = ((height - cellSize * 7 - 1) + (height * i + (30 * i)));
                totalHeight += 166;
              } else {
                rowHeight = (height - cellSize * 7 - 1);
                totalHeight = 166;
              }

              return 'translate(' + 60 + ',' + rowHeight + ')';
            });

          // Key
          d3.select('.gKey').remove();

          // Only show key if iqr is valid
          if (!_.isNaN(iqr)) {
            keySet = [1, 2, 3, 4, 5];
            key = d3.select('.gWrap')
              .append('g')
              .attr('class', 'gKey')
              .attr('transform', function () {
                return 'translate(' + (width - 230) + ',' + (totalHeight - 15) + ')';
              });

            key.append('text')
              .attr('x', '0')
              .attr('y', '9px')
              .text('Less')
              .attr('fill', '#000')
              .attr('alignment', 'baseline');

            key.selectAll('.rKey')
              .data(keySet)
              .enter().append('rect')
              .attr('class', 'rKey')
              .attr('width', '10px')
              .attr('height', '10px')
              .attr('x', function (d, i) { return (15 * i) + 30; })
              .attr('y', function () { return 0; })
              .style('fill', function (d, i) { return setKeyColor(d, i); })
              .attr('title', function (d, i) { return setKeyTitle(d, i); })
              .attr('data-toggle', 'tooltip');

            key.append('text')
              .attr('x', '110px')
              .attr('y', '9px')
              .text(function () { return 'More (' + quantiles[2].toFixed(2) + '+)'; })
              .attr('fill', '#000')
              .attr('alignment', 'baseline');
          }

          // Outliers Key
          d3.select('.gOutlier').remove();

          // Only show outliers if iqr is valid
          if (!_.isNaN(iqr)) {
            outlierKeyset = [1, 2];
            outlierKey = d3.select('.gWrap')
              .append('g')
              .attr('class', 'gOutlier')
              .attr('transform', function () {
                return 'translate(' + (width - 375) + ',' + (totalHeight - 15) + ')';
              });

            outlierKey.append('text')
              .attr('x', '0')
              .attr('y', '9px')
              .text('Potential Outliers')
              .attr('fill', '#000')
              .attr('alignment', 'baseline');

            outlierKey.selectAll('.rOutlier')
              .data(outlierKeyset)
              .enter().append('rect')
              .attr('class', 'rOutlier')
              .attr('width', '10px')
              .attr('height', '10px')
              .attr('x', function (d, i) { return (15 * i) + 85; })
              .attr('y', function () { return 0; })
              .style('fill', function (d, i) { return setOutlierColor(d, i); })
              .attr('title', function (d, i) { return setOutlierTitle(d, i); })
              .attr('data-toggle', 'tooltip');
          }

          // Create day rects
          rect = gWrap.selectAll('.day')
            .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); });

          // ENTER
          rect.enter().append('rect')
            .attr('class', 'day')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('x', function (d) { return week(d) * cellSize; })
            .attr('y', function (d) { return day(d) * cellSize; })
            .attr('stroke', '#fff')
            .attr('stroke-width', '2px')
            .style('fill', '#eee');

          // UPDATE
          rect
            .attr('data-original-title', function (d) { return setTitle(format(d)); })
            .transition().duration(750)
            .style('fill', function (d) { return setColor(format(d)); });

          // Year label
          gWrapEnter.append('text')
            .attr('transform', 'translate(-40,' + cellSize * 3.5 + ')rotate(-90)')
            .style('text-anchor', 'middle')
            .text(function (d) { return d; });

          // Month Label
          gWrapEnter.selectAll('monthName')
            .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter()
            .append('text')
            .attr('x', function (d) { return setMonthLabelPos(d); })
            .attr('y', -10)
            .text(month_name);

          // Day of the Week Label
          gWrapEnter.selectAll('dayOfWeek')
            .data(days)
            .enter().append('text')
            .attr('x', -20)
            .attr('opacity', function (d, i) { return setDayVisibility(i); })
            .attr('y', function (d, i) { return (cellSize * i) + 12; })
            .text(function (d) { return d; });

          //Initialize Tooltips
          $('.day, .rKey, .rOutlier').tooltip({
            container: 'body',
            html: true,
            placement: 'auto'
          });

          // Set svg dimensions
          svg.attr('width', width)
            .attr('height', totalHeight);
        });
      }

        // Accessor method to customize width
      chart.width = function (value) {
        if (!arguments.length) {
          return width;
        }

        width = value;
        return chart;
      };

      return chart;
    };
    return {
      restrict: 'A',
      scope: {data: '=', stats: '='},
      link: function postLink(scope, element, attrs) {
        var chart = new Calendar();

        // Hide visible tooltips when navigating away from page
        scope.$on('$locationChangeSuccess', function (e) {
          $('.day, .rKey, .rOutlier').tooltip('hide');
        });

        scope.render = function (data) {
          d3.select(element[0]).select('svg, div').remove();
          d3.select(element[0])
            .datum(data.data)
            .call(chart);
        };

        scope.updateStats = function () {
          scope.stats = null;

          // Only set stats if iqr is valid
          if (!_.isNaN(iqr)) {
            scope.stats = {};
            scope.stats.quartiles = '(' + quantiles[0].toFixed(2) + ', ' + quantiles[1].toFixed(2) + ', ' + quantiles[2].toFixed(2) + ')';
            scope.stats.iqr = iqr.toFixed(2);
            scope.stats.upperOutlier = upperOutlier.toFixed(2);
            scope.stats.lowerOutlier = (lowerOutlier.toFixed(2) > 0) ? lowerOutlier.toFixed(2) : 'No Threshold';
            scope.stats.median = quantiles[1].toFixed(2);
            scope.stats.min = min;
            scope.stats.max = max;
          }
        };

        scope.$watch('data', function (newData) {
          if (!newData) {
            return;
          }

          scope.render(newData);
          scope.updateStats();
        });
      }
    };
  });
