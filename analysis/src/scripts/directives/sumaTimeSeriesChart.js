'use strict';

angular.module('sumaAnalysis')
  .directive('sumaTimeSeriesChart', function () {
    var TimeSeries = function () {
      var margin,   // Margin of svg canvas
        margin2,    // Margin of scroll/zoom chart
        width,      // Width of Canvas
        height,     // Height of primary area chart
        height2;    // Height of scroll/zoom chart

      // Set Margins
      margin  = {top: 10, right: 10, bottom: 100, left: 40};
      margin2 = {top: 330, right: 10, bottom: 20, left: 40};
      width   = 940 - margin.left - margin.right;
      height  = 400 - margin.top - margin.bottom;
      height2 = 400 - margin2.top - margin2.bottom;

      function setColor(value) {
        if (value === null || value === undefined) {
          return 'darkred';
        }

        return 'steelblue';
      }

      function chart(selection) {
          var x,          // Scale of x-axis of primary area chart
              x2,         // Scale of x-axis of scroll/zoom chart
              y,          // Scale of y-axis of primary area chart
              y2,         // Scale of y-axis of scroll/zoom chart
              xAxis,      // x-axis of primary area chart
              xAxis2,     // x-axis of scroll/zoom chart
              yAxis,      // y-axis for both charts
              area,       // Area setup for primary chart
              area2,      // Area setup for scroll/zoom chart
              formatDate, // Create date string with specified format
              parseDate,  // Create date object from formatted date string
              daysOfWeek, // Array of weekday names for legend
              debug;
          debug = true;

          // Create scales
          x  = d3.scaleTime().range([0, width]);
          x2 = d3.scaleTime().range([0, width]);
          y  = d3.scaleLinear().range([height, 10]); // Change second value to 10 to add padding at top of chart
          y2 = d3.scaleLinear().range([height2, 0]);

          // Create axes using scales
          xAxis = d3.axisBottom(x);
          xAxis2 = d3.axisBottom(x2);
          yAxis = d3.axisLeft(y);

          // Create primary area path
          area = d3.area()
            .x(function (d) {
              if (debug) {console.log("At area creation: x(", d.fDate, ") = ", x(d.fDate)); }
              return x(d.fDate); 
            })
            .y0(height)
            .y1(function (d) { return y(d.count); });

          // Create scroll/zoom path
          area2 = d3.area()
            .x(function (d) {return x2(d.fDate); })
            .y0(height2)
            .y1(function (d) {return y2(d.count); });

          // Date formatter
          formatDate = d3.timeFormat('%Y-%m-%d'); // date -> string
          parseDate  = d3.timeParse('%Y-%m-%d');  // string -> date

          // Days of the week for display
          daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          selection.each(function (data) {
            var brush,          // Brush, or selector, object for controlling scroll/zoom chart
                context,        // SVG container for scroll/zoom chart
                dateMap,        // Array of sorted date values, used during interaction.on()
                focus,          // SVG container for primary area chart
                interaction,    // SVG container for interaction layer (detects mouse position)
                legend,         // SVG container for chart legend
                svg;            // Principle SVG element for entire chart

            // Path to display handles on brush
            function resizePath(d) {
              var e = +(d === 'e'),
                  x = e ? 1 : -1,
                  y = height2 / 3;

              return 'M' + (0.5 * x) + ',' + y +
                'A6,6 0 0 ' + e + ' ' + (6.5 * x) + ',' + (y + 6) +
                'V' + (2 * y - 6) +
                'A6,6 0 0 ' + e + ' ' + (0.5 * x) + ',' + (2 * y) +
                'Z' +
                'M' + (2.5 * x) + ',' + (y + 8) +
                'V' + (2 * y - 8) +
                'M' + (4.5 * x) + ',' + (y + 8) +
                'V' + (2 * y - 8);
            }

            // Function called by brush event handler
            function chartBrush() {
              x.domain(d3.event.selection==null ? x2.domain() : brush.extent());
              if (debug) { 
                console.log("New domain: ", (d3.event.selection==null ? x2.domain() : brush.extent()) ); 
                console.log("x2.domain(): ", x2.domain());
                console.log("brush.extent(): ", brush.extent());
                console.log("d3.brushSelection(this): ", d3.brushSelection(this));
                console.log("d3.event.selection: ", d3.event.selection);
              }

              focus.select('path').attr('d', area);
              focus.select('.x.axis').call(xAxis);
              focus.selectAll('.dot')
                .attr('cx', function (d) {
                  if (debug) { console.log("At chartBrush: x(", d.fDate, ") = ", x(d.fDate)); }
                  return x(d.fDate); 
                })
                .attr('cy', function (d) { return y(d.count); });
            }

            brush = d3.brushX()
              .on('brush', chartBrush);

/* HERE
            var zoom = d3.zoom()
              .scaleExtent([1, Infinity])
              .translateExtent([[0, 0], [width, height]])
              .extent([[0, 0], [width, height]])
              .on("zoom", zoomed);

            function zoomed() {
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
              var t = d3.event.transform;
              x.domain(t.rescaleX(x2).domain());
              focus.select(".area").attr("d", area);
              focus.select(".axis--x").call(xAxis);
              context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            }

            function brushed() {
              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
              var s = d3.event.selection || x2.range();
              x.domain(s.map(x2.invert, x2));
              focus.select(".area").attr("d", area);
              focus.select(".axis--x").call(xAxis);
              svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                  .scale(width / (s[1] - s[0]))
                  .translate(-s[0], 0));
            }

            var brush = d3.brushX()
              .extent([[0, 0], [width, height2]])
              .on("brush end", brushed);
TO HERE */

            data.forEach(function (d) {
              d.title = d.date;
              d.fDate  = parseDate(d.date);             // parses string d.date into date d.fDate
              d.day   = daysOfWeek[d.fDate.getDay()];   // gets day of week from date d.fDate
              d.count = d.count;
            });

            // Set domains and ranges
            if (debug) { console.log("Original domain: ", d3.extent(data.map(function (d) {return d.fDate; })) ); }
            x.domain(d3.extent(data.map(function (d) {return d.fDate; })));
            y.domain([0, d3.max(data.map(function (d) {return d.count; }))]);
            x2.domain(x.domain());
            y2.domain(y.domain());

            // Create array of date objects using dates in dataset (used during interaction.on())
            dateMap = data.map(function (d) {return d.fDate; });

            svg = d3.select(this).append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom);

            svg.append('defs').append('clipPath')
              .attr('id', 'clip')
              .append('rect')
              .attr('width', width)
              .attr('height', height);

            svg.append('defs').append('clipPath')
              .attr('id', 'dot-clip')
              .append('rect')
              .attr('x', -5)
              .attr('width', width + 10)
              .attr('height', height + 10);

/*HERE
            svg.append("rect")
              .attr("class", "zoom")
              .attr("width", width)
              .attr("height", height)
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .call(zoom);
TO HERE*/

            // Focus is the main graph
            focus = svg.append('g')
              .attr('class', 'main-graph')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            focus.append('path')
              .data([data])
              .attr('clip-path', 'url(#clip)')
              .attr('fill', 'steelblue')
              .attr('d', area);

            focus.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

            focus.append('g')
              .attr('class', 'y axis')
              .call(yAxis);

            focus.append('g')
              .selectAll('.dot')
              .data(data)
              .enter().append('circle')
              .attr('clip-path', 'url(#dot-clip)')
              .attr('class', 'dot')
              .attr('cx', function (d) {return x(d.fDate); })
              .attr('cy', function (d) {return y(d.count); })
              .attr('r', 5)
              .attr('fill', function (d) {return setColor(d.count); })
              .attr('opacity', 0)
              .attr('data-tooltip', function (d) {return d.title + ' : ' + d.count; });

            // Interaction is an overlay layer for mouse position
            interaction = svg.append('g')
              .attr('id', 'interaction')
              .append('rect')
              .attr('opacity', 0)
              .attr('x', margin.left)
              .attr('y', margin.top)
              .attr('height', height)
              .attr('width', width)
              .on('mousemove', function () {
                  var xCoord      = d3.mouse(this)[0] - margin.left,  // X coordinate of mouse over primary graph
                      xInvert     = x.invert(xCoord),                 // Convert xCoord to date value using x scale
                      cut         = d3.bisectLeft(dateMap, xInvert),  // Return index to right of xInvert
                      cut2        = (cut > 0) ? cut - 1 : 0,          // Return index to left of xInvert
                      leftPoint   = data[cut2].fDate,                  // Convert cut2 to date (milliseconds from Epoch)
                      rightPoint  = data[cut].fDate,                   // Convert cut to date (milliseconds from Epoch)
                      midpoint    = (leftPoint.getTime() + rightPoint.getTime()) / 2; // Calculate midpoint

                  // Is current postion less than the midpoint?
                  if (xInvert.getTime() < midpoint) {
                    cut -= 1;
                  }

                  // Display closest dot
                  d3.selectAll('.dot')
                    .attr('opacity', 0)
                    .filter(function (d) {return d.fDate === data[cut].fDate; })
                    .attr('opacity', 1);

                  // Display legend
                  d3.select('#legend')
                    .attr('opacity', 1);

                  // Update legend text
                  d3.select('#legend-text')
                    .text(function () {
                      var val;

                      if (data[cut].count === null) {
                        val = 'No Data Found';
                      } else {
                        val = data[cut].count;
                      }

                      return data[cut].day + ' : ' + data[cut].title + ' : ' + val;
                    });

                  d3.select('#legend-circle')
                    .attr('fill', function () {return setColor(data[cut].count); });
                })
              .on('mouseout', function () {
                d3.selectAll('.dot')
                  .attr('opacity', 0);

                d3.select('#legend')
                  .attr('opacity', 0);
              });

            // Legend display
            legend = svg.append('g')
              .attr('id', 'legend')
              .attr('opacity', 0);

            legend.append('svg:circle')
              .attr('id', 'legend-circle')
              .attr('cx', 60)
              .attr('cy', 10)
              .attr('r', 5);

            legend.append('svg:text')
              .attr('id', 'legend-text')
              .attr('x', 70)
              .attr('y', 13);

            // Context is the 'brush' graph
            context = svg.append('g')
              .attr('class', 'sub-graph')
              .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

            context.append('path')
              .data([data])
              .attr('fill', 'steelblue')
              .attr('d', area2);

            context.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height2 + ')')
              .call(xAxis2);

            context.append('g')
              .attr('class', 'x brush')
              .call(brush)
              .selectAll('rect')
              .attr('y', -6)
              .attr('height', height2 + 7);

            context.selectAll('.resize')
              .append('path')
              .attr('d', resizePath);

            // Axis/Tick Stylings
            d3.selectAll('.axis path')
              .attr('fill', 'none')
              .attr('stroke', '#000');
          });
        }
      // Accessor method to customize width
      chart.width = function (value) {
        if (!arguments.length) {
          return width;
        }

        width = value - margin.left - margin.right;
        return chart;
      };
      // TODO Add additional accessors for other properties

      return chart;
    };

    return {
      restrict: 'A',
      scope: {data: '='},
      link: function postLink(scope, element, attrs) {
        var chart = new TimeSeries();

        scope.render = function (data) {
          if (data.data.length > 1) {
            d3.select(element[0]).select('svg, div').remove();
            d3.select(element[0])
              .datum(data.data)
              .call(chart);
          } else {
            d3.select(element[0]).select('svg, div').remove();
            d3.select(element[0])
              .append('div')
              .attr('class', 'alert alert-warning alert-block')
              .html('<h4>Notice!</h4><p>Limited data is available for this query.</p><p>Message: Not enough data was found to display a time series. However, summary data is shown below.</p>');
          }
        };

        scope.$watch('data', function (newData) {
          if (!newData) {
            return;
          }

          scope.render(newData);
        });
      }
    };
  });
