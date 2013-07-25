(function () {
    var calendar = {
        // Initializes application
        init: function () {
            var input;

            // Handle the display of loading.gif
            $(document).ajaxStart(function () {
                $('#loading').show();
                $('svg').remove();

            }).ajaxStop(function () {
                $('#loading').hide();
            });

            // Event handler to initiate application
            $('body').on('submit', 'form', function (e) {
                input = $(this).serializeArray();
                calendar.getData(input);
                e.preventDefault();
            });
        },

        // AJAX call to query server, accepts form input as parameter
        getData: function (input) {
            $.ajax({
                url: 'results.php',
                data: input,
                success: calendar.processData,
                error: calendar.error,
                dataType: 'json'
            });
        },

        // Sort data according to date
        sortData: function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        },

        // No data
        noData: function () {
            alert('no data found');
        },

        // Process and prepare data for display, accepts response from getData
        processData: function (response) {
            var first,
                last,
                count,
                counts = [];

            // Does response have enough vlues to draw meaningful graph?
            if (Object.keys(response).length < 2) {
                calendar.noData();
            } else {
                for (count in response) {
                    if (response.hasOwnProperty(count)) {
                        // Create array that can be used by d3.js
                        counts.push({
                            date: count,
                            count: response[count]
                        });
                    }
                }

                counts.sort(calendar.sortData);
                calendar.drawChart(counts);
            }

        },

        drawChart: function (counts) {
            var monthCount = 0,
                width = 960,
                height = 136,
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
                .style('visibility', function (d, i) {
                    var vis;

                    if (i === 0 || i === 2 || i === 4 || i === 6) {
                        vis = 'hidden';
                    } else {
                        vis = 'visible';
                    }

                    return vis;
                })
                .attr("y", function (d, i) { return (newCellSize * i) + 10; })
                .text(function (d) { return d; });

            // Month Label
            svg.selectAll("monthName")
                .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("text")
                .attr("x", function (d) {
                    if (d.getDay() !== 0 && monthCount > 0) {
                        return (week(d)  * (cellSize + 2)) + 12;
                    }
                    monthCount += 1;
                    return week(d) * (cellSize + 2);
                })
                .attr("y", -10)
                .text(month_name);

            // Color Days
            rect.filter(function (d) { return d in data; })
                .style('fill', function (d) { return color(data[d]); })
                .attr("title", function (d) {
                    var day = moment(d, 'YYYY-MM-DD').format('ddd');
                    return day + ": " + d + ": " + data[d];
                })
                .attr('rel', 'tooltip');

            // Initialize Tooltips
            $('[rel=tooltip]').tooltip();
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        calendar.init();
    });
}());
