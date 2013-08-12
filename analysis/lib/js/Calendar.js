(function (window) {
    var Calendar = function () {
        var width = 960,
            height = 136,
            totalHeight;

        function calendarChart(selection) {
            var monthCount = 0,
                cellSize = 16,
                day = d3.time.format('%w'),
                week = d3.time.format('%U'),
                format = d3.time.format('%Y-%m-%d'),
                month_name = d3.time.format('%b'),
                days = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
                data,
                color;

            function setDayVisibility(i) {
                if (i === 0 || i === 2 || i === 4 || i === 6) {
                    return 0;
                }

                return 1;
            }

            function setMonthLabelPos(d) {
                if (d.getDay() !== 0 && monthCount > 0) {
                    return (week(d)  * cellSize) + cellSize;
                }

                monthCount += 1;

                return week(d) * cellSize;
            }

            function setColor(d) {
                if (data[d] === undefined || data[d] === null) {
                    return '#eee';
                }

                return color(data[d]);
            }

            function setTitle(d) {
                var count,
                    date = moment(d, 'YYYY-MM-DD').format('ddd');

                if (data[d] === undefined || data[d] === null) {
                    count = 'No Data Found';
                } else {
                    count = data[d].toFixed(2);
                }

                return date + ': ' + d + '<p>' + count + '</p>';
            }

            selection.each(function (counts) {
                var svg,
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

                // Color scale
                color = d3.scale.quantile()
                    .domain(d3.values(data))
                    .range(['#d6e685', '#8cc665', '#44a340', '#1e6823']);

                // Define svg wrapper
                svg = d3.select(this).selectAll('svg').data([data]);

                // Append gWrap g element
                svg.enter().append('svg')
                    .append('g')
                    .attr('class', 'gWrap');

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
                rect.attr('title', function (d) { return setTitle(format(d)); })
                    .attr('rel', 'tooltip')
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

                // Initialize Tooltips
                $('[rel=tooltip]').tooltip('destroy');
                $('[rel=tooltip]').tooltip();

                // Set svg dimensions
                svg.attr('width', width)
                    .attr('height', totalHeight);
            });
        }

        // Accessor method to customize width
        calendarChart.width = function (value) {
            if (!arguments.length) {
                return width;
            }

            width = value;
            return calendarChart;
        };

        return calendarChart;
    };

    window.Calendar = Calendar;
}(window));
