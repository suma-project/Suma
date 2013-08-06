var Calendar = function () {
    var width = 960,
        height = 136;

    function calendarChart(selection) {
        var monthCount = 0,
            newCellSize = 14,
            cellSize = 14,
            day = d3.time.format("%w"),
            week = d3.time.format("%U"),
            format = d3.time.format("%Y-%m-%d"),
            month_name = d3.time.format("%b"),
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
                return (week(d)  * cellSize) + 14;
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
                count = "No Data Found";
            } else {
                count = data[d];
            }

            return date + ": " + d + ": " + count;
        }

        selection.each(function (counts) {
            var svg,
                rect;

            data = d3.nest()
                .key(function (d) { return d.date; })
                .rollup(function (d) { return d[0].count; })
                .map(counts);

            color = d3.scale.quantile()
                .domain(d3.values(data))
                .range(["#d6e685", "#8cc665", "#44a340", "#1e6823"]);

            svg = selection.selectAll("svg")
                .data(d3.range(
                    parseInt(_.first(counts).date.split("-")[0], 10),
                    parseInt(_.last(counts).date.split("-")[0], 10) + 1
                ).reverse())
                .enter().append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + 60 + "," + (height - newCellSize * 7 - 1) + ")");

            svg.append("text")
                .attr("transform", "translate(-40," + cellSize * 3.5 + ")rotate(-90)")
                .style("text-anchor", "middle")
                .text(function (d) { return d; });

            rect = svg.selectAll(".day")
                .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("rect")
                .attr("class", "day")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function (d) { return week(d) * cellSize; })
                .attr("y", function (d) { return day(d) * cellSize; })
                .attr('stroke', '#fff')
                .attr('stroke-width', '2px')
                .datum(format);

            // Day of the Week Label
            svg.selectAll('dayOfWeek')
                .data(days)
                .enter().append('text')
                .attr("x", -20)
                .attr('opacity', function (d, i) { return setDayVisibility(i); })
                .attr("y", function (d, i) { return (newCellSize * i) + 10; })
                .text(function (d) { return d; });

            // Month Label
            svg.selectAll("monthName")
                .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("text")
                .attr("x", function (d) { return setMonthLabelPos(d); })
                .attr("y", -10)
                .text(month_name);

            // Color days and set tooltip text
            rect.filter(function (d) { return d; })
                .style('fill', function (d) { return setColor(d); })
                .attr("title", function (d) { return setTitle(d); })
                .attr('rel', 'tooltip');

            // Initialize Tooltips
            $('[rel=tooltip]').tooltip('destroy');
            $('[rel=tooltip]').tooltip();
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