var Calendar = function () {
    var width = 960,
        height = 136;

    function calendarChart(selection) {
        var monthCount = 0,
            newCellSize = 14,
            cellSize = 12,
            day = d3.time.format("%w"),
            week = d3.time.format("%U"),
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d"),
            month_name = d3.time.format("%b"),
            day_name = d3.time.format("%w"),
            days = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
            data,
            color,
            svg,
            rect;

        function monthPath(t0) {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                d0 = +day(t0),
                w0 = +week(t0),
                d1 = +day(t1),
                w1 = +week(t1);

            return "M" + (w0 + 1) * newCellSize + "," + d0 * newCellSize
                + "H" + w0 * newCellSize + "V" + 7 * newCellSize
                + "H" + w1 * newCellSize + "V" + (d1 + 1) * newCellSize
                + "H" + (w1 + 1) * newCellSize + "V" + 0
                + "H" + (w0 + 1) * newCellSize + "Z";
        }

        function setDayVisibility(i) {
            var vis;

            if (i === 0 || i === 2 || i === 4 || i === 6) {
                vis = 'hidden';
            } else {
                vis = 'visible';
            }

            return vis;
        }

        function setMonthLabelPos(d) {
            if (d.getDay() !== 0 && monthCount > 0) {
                return (week(d)  * (cellSize + 2)) + 12;
            }

            monthCount += 1;

            return week(d) * (cellSize + 2);
        }

        function setColor(d) {
            var c;

            if (data[d] === undefined) {
                c = '#eee';
            } else {
                c = color(data[d]);
            }
            return c;
        }

        function setTitle(d) {
            var count,
                day = moment(d, 'YYYY-MM-DD').format('ddd');

            if (data[d] === undefined) {
                count = "No Data Found";
            } else {
                count = data[d];
            }
            return day + ": " + d + ": " + count;
        }


        selection.each(function (counts) {
            console.log(counts)
            data = d3.nest()
                .key(function (d) { return d.date; })
                .rollup(function (d) { return d[0].count; })
                .map(counts);

            color = d3.scale.quantile()
                .domain(d3.values(data))
                .range(["#d6e685", "#8cc665", "#44a340", "#1e6823"]);

            svg = d3.select("#chart").selectAll("svg")
                .data(d3.range(
                    parseInt(_.first(counts).date.split("-")[0], 10),
                    parseInt(_.last(counts).date.split("-")[0], 10) + 1
                ).reverse())
                .enter().append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "RdYlGn")
                .append("g")
                .attr("transform", "translate(" + 50 + "," + (height - newCellSize * 7 - 1) + ")");

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
                .attr("x", function (d) { return week(d) * (cellSize + 2); })
                .attr("y", function (d) { return day(d) * (cellSize + 2); })
                .datum(format);

            svg.selectAll(".month")
                .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("path")
                .attr("class", "month")
                .attr("d", monthPath);

            // Day of the Week Label
            svg.selectAll('dayOfWeek')
                .data(days)
                .enter().append('text')
                .attr("x", -20)
                .style('visibility', function (d, i) { return setDayVisibility(i); })
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