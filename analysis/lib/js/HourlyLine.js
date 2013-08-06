var HourlyLine = function () {
    function hourlyLineChart(selection) {

        var displayFormat = d3.time.format('%a %I %p');

        function calcDate(day, hour) {
            var d,
                h;

            d = 4 + (day - 1);
            h = hour - 1;

            return new Date(2013, 7, d, h);
        }

        function setTitle(date, value) {
            var text;

            if (value === null) {
                text = 'No Data Found';
            } else {
                text = value.toFixed(2);
            }
            return displayFormat(date) + " : " + text;
        }

        function setColor(value) {
            if (value === null) {
                return 'darkred';
            }

            return 'steelblue';
        }

        selection.each(function (counts) {
            var w,
                h,
                dateMap,
                padding,
                xScale,
                yScale,
                xAxis,
                yAxis,
                area,
                svg,
                gRect,
                x,
                y,
                areaChart,
                circles,
                legend,
                circle,
                text,
                interaction;

            w = 960;
            h = 300;
            padding = 50;

            _.each(counts, function (obj) {
                obj.date = calcDate(obj.day, obj.hour);
            });

            dateMap = counts.map(function (d) {return d.date; });

            //Create scale functions
            xScale = d3.time.scale()
                    .domain(d3.extent(counts.map(function (d) {return d.date; })))
                    .range([padding, w - padding]);


            yScale = d3.scale.linear()
                                 .domain([0, d3.max(counts, function (d) { return d.value || 0; })])
                                 .range([h - padding, padding]);

            //Define X axis
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(5)
                .tickFormat(d3.time.format('%a %I %p'));

            //Define Y axis
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(5);

            // // Define area
            area = d3.svg.area()
                .interpolate('linear')
                .x(function (d) {return xScale(d.date); })
                .y0(h - padding)
                .y1(function (d) {return yScale(d.value); });



            //Create SVG element
            svg = d3.select('#chart2').selectAll('svg').data([counts]);

            svg.enter().append('svg')
                .append('g')
                .attr('class', 'gRect');

            svg.attr('width', w)
                .attr('height', h);

            gRect = svg.select('.gRect');

            // Create x-axis
            x = gRect.selectAll('.xAxis').data([counts]);

            // ENTER
            x.enter()
                .append('g')
                .attr('class', 'xAxis');

            // UPDATE
            x.attr('transform', 'translate(0,' + (h - padding) + ')')
                .call(xAxis);

            // Create y-axis
            y = gRect.selectAll('.yAxis').data([counts]);

            // ENTER
            y.enter()
                .append('g')
                .attr('class', 'yAxis');

            // UPDATE
            y.attr('transform', 'translate(' + padding + ',0)')
                .transition().duration(750)
                .call(yAxis);

            // Apply axis styling
            d3.selectAll('.xAxis path, .yAxis path')
                .attr('fill', 'none')
                .attr('stroke', '#000');

            // Create area
            areaChart = gRect.selectAll('.mainGraph').data([counts]);

            // ENTER
            areaChart.enter()
                .append('path')
                .attr('clip-path', 'url(#clip)')
                .attr('fill', 'steelblue')
                .attr('class', 'mainGraph');

            // UPDATE
            areaChart.transition().duration(750)
                .attr('d', area);

            // Create points
            circles = gRect.selectAll('.dot').data(counts);

            // ENTER
            circles.enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('r', 5)
                .attr('fill', function (d) {return setColor(d.value); })
                .attr('stroke', '#f7f7f7')
                .attr('stroke-width', 2)
                .attr('opacity', 0);

            // UPDATE
            circles.attr('cx', function (d, i) {return xScale(d.date); })
                .attr('cy', function (d) {return yScale(d.value); });

            // Create interaction layer
            interaction = gRect.selectAll('#interaction').data([counts]);

            // ENTER
            interaction.enter()
                .append('g')
                .attr('id', 'interaction')
                .append('rect')
                .attr('opacity', 0)
                .attr('x', padding)
                .attr('y', padding)
                .attr('height', h - (padding * 2))
                .attr('width', w - (padding * 2));

            // UPDATE
            interaction.on('mousemove', function (d) {
                var xCoord      = d3.mouse(this)[0],  // X coordinate of mouse over primary graph
                    xInvert     = xScale.invert(xCoord), // Convert xCoord to date value using x scale
                    cut         = d3.bisectLeft(dateMap, xInvert), // Return index to right of xInvert
                    cut2        = (cut > 0) ? cut - 1 : 0, // Return index to left of xInvert
                    leftPoint   = counts[cut2].date, // Convert cut2 to date (milliseconds from Epoch)
                    rightPoint  = counts[cut].date, // Convert cut to date (milliseconds from Epoch)
                    midpoint    = (leftPoint.getTime() + rightPoint.getTime()) / 2; // Calculate midpoint

                // Is current postion less than the midpoint?
                if (xInvert.getTime() < midpoint) {
                    cut -= 1;
                }

                // Display closest dot
                d3.selectAll('.dot')
                    .attr('opacity', 0)
                    .filter(function (d) {return d.date === counts[cut].date; })
                    .attr('opacity', 1);

                //Display legend
                d3.select('#tsLegend')
                    .attr('opacity', 1);

                // Update legend text
                d3.select('#legendText')
                    .text(function (d) {
                        return setTitle(counts[cut].date, counts[cut].value);
                    });

                // Update circle color
                d3.select('#legendCircle')
                    .attr('fill', function (d) {return setColor(counts[cut].value); });
            }).on('mouseout', function (d) {
                d3.selectAll('.dot')
                    .attr('opacity', 0);

                d3.select('#tsLegend')
                    .attr('opacity', 0);
            });

            // Create legend wrapper
            legend = gRect.selectAll('#tsLegend').data([counts]);

            // ENTER
            legend.enter()
                .append('g')
                .attr('id', 'tsLegend')
                .attr('opacity', 0);

            // Create circle in legend
            circle = legend.selectAll('#legendCircle').data([counts]);

            // ENTER
            circle.enter()
                .append('circle')
                .attr('id', 'legendCircle')
                .attr('cx', 60)
                .attr('cy', 10)
                .attr('r', 5)
                .attr('stroke', '#f7f7f7')
                .attr('stroke-width', 2);

            // Create text in legend
            text = legend.selectAll('#legendText').data([counts]);

            // ENTER
            text.enter()
                .append('text')
                .attr('id', 'legendText')
                .attr('x', 70)
                .attr('y', 13);
        });
    }

    return hourlyLineChart;
};
