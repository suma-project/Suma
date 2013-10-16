(function (window) {
    var HourlyCalendar = function () {
        function hourlyCalendarChart(selection) {
            var margin = { top: 50, right: 0, bottom: 100, left: 30 },
                width = 960 - margin.left - margin.right,
                height = 360 - margin.top - margin.bottom,
                gridSize = Math.floor(width / 24),
                color,
                colorRange = ['#d6e685', '#8cc665', '#44a340', '#1e6823'],
                data,
                key,
                keySet,
                outlierKey,
                outlierKeyset,
                quantiles,
                iqr,
                upperOutlier,
                lowerOutlier,
                days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                daysTitle = {'1': 'Su', '2': 'Mo', '3': 'Tu', '4': 'We', '5': 'Th', '6': 'Fr', '7': 'Sa'},
                times = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12a', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
                timesTitle = {'1': '12a', '2': '1a', '3': '2a', '4': '3a', '5': '4a', '6': '5a', '7': '6a', '8': '7a', '9': '8a', '10': '9a', '11': '10a', '12': '11a', '13': '12a', '14': '1p', '15': '2p', '16': '3p', '17': '4p', '18': '5p', '19': '6p', '20': '7p', '21': '8p', '22': '9p', '23': '10p', '24': '11p'};

            function setColor(d) {

                if (d === undefined || d === null) {
                    return '#eee';
                }

                if (d >= upperOutlier) {
                    return '#ff0000';
                }

                if (d <= lowerOutlier) {
                    return '#808080';
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
                   return 'Greater than ' + (quantiles[2] - 1).toFixed(2);
                }

                if (i === 1) {
                   return 'Less than ' + quantiles[0].toFixed(2);
                }

                if (i === 2) {
                   return quantiles[0].toFixed(2) + ' to ' + (quantiles[1] - 1).toFixed(2);
                }

                if (i === 3) {
                   return quantiles[1].toFixed(2) + ' to ' + (quantiles[2] - 1).toFixed(2);
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
                var heatMap,
                    gRect,
                    svg,
                    svgEnter;

                data = counts;

                // Color Scale
                color = d3.scale.quantile()
                    .domain(_.compact(_.pluck(data, 'value')))
                    .range(colorRange);

                // Stats
                quantiles = color.quantiles();
                iqr = quantiles[2] - quantiles[0];
                upperOutlier = quantiles[2] + (1.5 * iqr);
                lowerOutlier = quantiles[0] - (1.5 * iqr);

                // Select SVG container and join data
                svg = d3.select(this).selectAll('svg').data([data]);

                // Append containers
                svgEnter = svg.enter().append('svg')
                            .attr('id', 'calendar')
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

                // Key
                d3.select('.gKey').remove();
                keySet = [1, 2, 3, 4, 5];
                key = d3.select('#calendar')
                    .append('g')
                    .attr('class', 'gKey')
                    .attr('transform', 'translate(765, 335)');

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
                    .text(function () { return 'More (' + (quantiles[2] - 1).toFixed(2) + '+)'; })
                    .attr('fill', '#000')
                    .attr('alignment', 'baseline');

                // Outliers Key
                d3.select('.gOutlier').remove();
                outlierKeyset = [1, 2];
                outlierKey = d3.select('#calendar')
                    .append('g')
                    .attr('class', 'gOutlier')
                    .attr('transform', 'translate(615, 335)');

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

                // Initialize Tooltips
                $('.hour').tooltip('destroy');
                $('.hour').tooltip({
                    container: 'body',
                    html: true,
                    placement: 'auto'
                });

                $('.rKey').tooltip('destroy');
                $('.rKey').tooltip({
                    container: 'body',
                    html: true,
                    placement: 'auto'
                });

                $('.rOutlier').tooltip('destroy');
                $('.rOutlier').tooltip({
                    container: 'body',
                    html: true,
                    placement: 'auto'
                });

                // Update Summary Table
                $('#quartile').text('(' + quantiles[0].toFixed(2) + ', ' + quantiles[1].toFixed(2) + ', ' + quantiles[2].toFixed(2) + ')');
                $('#iqr').text(iqr.toFixed(2));
                $('#lot').text((lowerOutlier.toFixed(2) > 0) ? lowerOutlier.toFixed(2) : 'No Threshold');
                $('#uot').text(upperOutlier.toFixed(2));
                $('#median').text(quantiles[1].toFixed(2));
            });
        }

        return hourlyCalendarChart;
    };

    window.HourlyCalendar = HourlyCalendar;
}(window));
