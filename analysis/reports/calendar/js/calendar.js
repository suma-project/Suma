(function () {
    var calendar = {
        // Initializes application
        init: function () {
            var input;

            // Handle the display of loading.gif
            $('#loading').ajaxStart(function () {
                $(this).show();
                $('svg').remove();

            }).ajaxStop(function () {
                $(this).hide();
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

        // Process and prepare data for display, accepts response from getData
        processData: function (response) {
            var newObj,
                count,
                counts = [];

            // Does response have enough vlues to draw meaningful graph?
            if (Object.keys(response).length < 2) {
                calendar.noData();
            } else {
                for (count in response) {
                    if (response.hasOwnProperty(count)) {
                        newObj = {
                            date: count,
                            count: response[count]
                        };
                        // Create array that can be used by d3.js
                        counts.push(newObj);
                    }
                }

                // Sort by date
                counts.sort(calendar.sortData);
                // Draw chart using dygraph.js
                calendar.drawChart(counts);
            }

        },

        drawChart: function (counts, response) {
            var cellSize,
                color,
                data,
                day,
                format,
                height,
                margin,
                rect,
                svg,
                week,
                width;

            margin   = {top: 19, right: 20, bottom: 20, left: 19};
            width    = 960 - margin.right - margin.left; // width
            height   = 136 - margin.top - margin.bottom; // height
            cellSize = 17; // cell size

            day      = d3.time.format("%w");
            week     = d3.time.format("%U");
            format   = d3.time.format("%Y-%m-%d");

            color    = d3.scale.quantile().range(d3.range(1, 9));

            function monthPath(t0) {
                var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                    d0 = +day(t0),
                    w0 = +week(t0),
                    d1 = +day(t1),
                    w1 = +week(t1);

                return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
                    + "H" + w0 * cellSize + "V" + 7 * cellSize
                    + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
                    + "H" + (w1 + 1) * cellSize + "V" + 0
                    + "H" + (w0 + 1) * cellSize + "Z";
            }

            svg = d3.select("#chart").selectAll("svg")
                .data(d3.range(2011, parseInt(moment().format("YYYY"), 10) + 1).reverse())
                .enter().append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "Greens")
                .append("g")
                .attr("transform", "translate(" + (margin.left + (width - cellSize * 53) / 2)
                    + "," + (margin.top + (height - cellSize * 7) / 2) + ")");

            svg.append("text")
                .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
                .attr("text-anchor", "middle")
                .text(String);

            rect = svg.selectAll("rect.day")
                .data(function (d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("rect")
                .attr("class", "day")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function (d) { return week(d) * cellSize; })
                .attr("y", function (d) { return day(d) * cellSize; })
                .datum(format);

            svg.selectAll("path.month")
                .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter().append("path")
                .attr("class", "month")
                .attr("d", monthPath);

            data = d3.nest()
                .key(function (d) { return d.date; })
                .rollup(function (d) { return d[0].count; })
                .map(counts);

            color.domain(d3.values(data));

            rect.filter(function (d) { return d in data; })
                .attr("class", function (d) { return "day q" + color(data[d]) + "-9"; })
                .attr('title', function (d) {
                    var day = moment(d, 'YYYY-MM-DD').format('ddd');
                    return day + " : " + d + " : " + data[d];
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
