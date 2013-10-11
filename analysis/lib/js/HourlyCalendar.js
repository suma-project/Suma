(function (window) {
    var HourlyCalendar = function () {
        function hourlyCalendarChart(selection) {
            var margin = { top: 50, right: 0, bottom: 100, left: 30 },
                width = 960 - margin.left - margin.right,
                height = 360 - margin.top - margin.bottom,
                gridSize = Math.floor(width / 24),
                color,
                data,
                days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                daysTitle = {'1': 'Su', '2': 'Mo', '3': 'Tu', '4': 'We', '5': 'Th', '6': 'Fr', '7': 'Sa'},
                times = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12a', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
                timesTitle = {'1': '12a', '2': '1a', '3': '2a', '4': '3a', '5': '4a', '6': '5a', '7': '6a', '8': '7a', '9': '8a', '10': '9a', '11': '10a', '12': '11a', '13': '12a', '14': '1p', '15': '2p', '16': '3p', '17': '4p', '18': '5p', '19': '6p', '20': '7p', '21': '8p', '22': '9p', '23': '10p', '24': '11p'};

            function setColor(d) {

                if (d === undefined || d === null) {
                    return '#eee';
                }

                return color(d);
            }

            function setTitle(d) {
                var count;

                if (d.value === undefined || d.value === null) {
                    count = 'No Data Found';
                } else {
                    count = d.value.toFixed(2);
                }

                return daysTitle[d.day] + ' : ' + timesTitle[d.hour] + ' : ' + count;
            }

            selection.each(function (counts) {
                var heatMap,
                    gRect,
                    svg,
                    svgEnter;

                data = counts;

                // Color Scale
                color = d3.scale.quantile()
                    .domain(_.compact(_.pluck(data, 'value')))
                    .range(['#d6e685', '#8cc665', '#44a340', '#1e6823']);

                // Select SVG container and join data
                svg = d3.select(this).selectAll('svg').data([data]);

                // Append containers
                svgEnter = svg.enter().append('svg')
                            .append('g')
                            .attr('class', 'gRect');

                // Apply transforms to containers and save selection for future use
                gRect = svg.select('.gRect')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // Set width and height of chart
                svg.attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom);

                // Append day labels
                svgEnter.selectAll('.dayLabel')
                    .data(days)
                    .enter().append('text')
                    .text(function (d) { return d; })
                    .attr('x', 0)
                    .attr('y', function (d, i) { return i * gridSize; })
                    .style('text-anchor', 'end')
                    .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')');

                // Append hour labels
                svgEnter.selectAll('.timeLabel')
                    .data(times)
                    .enter().append('text')
                    .text(function (d) { return d; })
                    .attr('x', function (d, i) { return i * gridSize; })
                    .attr('y', 0)
                    .style('text-anchor', 'middle')
                    .attr('transform', 'translate(' + gridSize / 2 + ', -6)');

                // Append rects
                heatMap = gRect.selectAll('.hour').data(data);

                // ENTER
                heatMap.enter()
                    .append('rect')
                    .attr('x', function (d) { return (d.hour - 1) * gridSize; })
                    .attr('y', function (d) { return (d.day - 1) * gridSize; })
                    .attr('class', 'hour bordered')
                    .attr('stroke', '#fff')
                    .attr('stroke-width', '2px')
                    .attr('width', gridSize)
                    .attr('height', gridSize)
                    .style('fill', '#eee');

                // UPDATE
                heatMap.attr('data-toggle', 'tooltip')
                    .attr('title', function (d) { return setTitle(d); })
                    .transition().duration(750)
                    .style('fill', function (d) { return setColor(d.value); });

                // Initialize Tooltips
                $('.hour').tooltip('destroy');
                $('.hour').tooltip({
                    container: 'body',
                    html: true,
                    placement: 'auto'
                });
            });
        }

        return hourlyCalendarChart;
    };

    window.HourlyCalendar = HourlyCalendar;
}(window));
