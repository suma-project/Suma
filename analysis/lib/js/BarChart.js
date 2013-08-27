(function (window) {
    var BarChart = function () {
        var width = 550,
            height;

        function chart(selection) {
            selection.each(function (data) {
                var ann,
                    gBar,
                    gEnter,
                    gRule,
                    line,
                    rects,
                    rule,
                    svg,
                    text,
                    x;

                height = 20 + (25 * data.length);

                // Define scales
                x = d3.scale.linear()
                            .domain([0, d3.max(data.map(function (d) { return +d.count; }))])
                            .range([0, 380]);

                // Select svg container and join data
                svg = d3.select(this).selectAll('svg').data([data]);

                // Append containers for draw order
                gEnter = svg.enter().append('svg')
                            .append('g')
                            .attr('class', 'gBar')
                            .append('g')
                            .attr('class', 'gRule');

                // Set width and height of chart
                svg.attr('width', width)
                    .attr('height', height);

                // Apply transforms to containers
                gBar = svg.select('.gBar')
                                .attr('transform', 'translate(150,15)');

                gRule = svg.select('.gRule')
                                .attr('transorm', 'translate(150,15(');

                //Append lines for scale
                line = gRule.selectAll('line').data(x.ticks(6));

                // ENTER
                line.enter()
                    .append('line')
                    .attr('class', 'line')
                    .style('stroke', '#ccc');

                // UPDATE
                line.style('opacity', 0.000001)
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y1', 0)
                    .attr('y2', function () {return 25 * data.length - 5; })
                    .transition().delay(750).duration(500)
                    .style('opacity', 1);

                // EXIT
                line.exit()
                    .style('opacity', 0.000001)
                    .remove();

                // Append line labels
                rule = gBar.selectAll('.rule').data(x.ticks(6));

                // ENTER
                rule.enter().append('text')
                    .attr('class', 'rule')
                    .style('font-size', '12px')
                    .style('font-family', 'Verdana');

                // UPDATE
                rule.style('opacity', 0.000001)
                    .attr('x', x)
                    .attr('y', 0)
                    .attr('dy', -3)
                    .attr('text-anchor', 'middle')
                    .text(String)
                    .transition().delay(750).duration(500)
                    .style('opacity', 1);

                // EXIT
                rule.exit()
                    .style('opacity', 0.000001)
                    .remove();

                // Append bar rectangles
                rects = gBar.selectAll('rect').data(data);

                // ENTER
                rects.enter()
                    .append('rect')
                    .attr('class', 'rect')
                    .style('fill', 'steelblue');

                // UPDATE
                rects.transition().duration(500)
                    .attr('width', 0)
                    .attr('y', function (d, i) {return 25 * i; })
                    .attr('height', '20')
                    .attr('data', function (d) {return d.count; })
                    .transition().delay(750).duration(500)
                    .attr('width', function (d) {
                        var width;
                        // Give really small counts a minimum width
                        if (x(d.count) < 5 && x(d.count) > 0) {
                            width = 5 + x(d.count);
                        } else {
                            width = x(d.count);
                        }

                        return width;
                    });

                // EXIT
                rects.exit()
                    .transition().duration(500)
                    .attr('width', 0)
                    .remove();

                // Append bar labels
                text = svg.selectAll('.barLabel').data(data);

                // ENTER
                text.enter()
                    .append('text')
                    .attr('class', 'barLabel')
                    .style('font-size', '11px')
                    .style('font-family', 'Verdana');

                // UPDATE
                text.style('opacity', 0.000001)
                    .attr('x', 10)
                    .attr('y', function (d, i) {return 25 * i + 30; })
                    .attr('dy', -3)
                    //.attr('text-anchor', 'left')
                    .text(function (d) {return S(d.name).unescapeHTML().truncate(20); })
                    .transition().delay(750).duration(1000)
                    .style('opacity', 1);

                // EXIT
                text.exit()
                    .style('opacity', 0.000001)
                    .remove();

                // Append bar annotation
                ann = gBar.selectAll('.ann').data(data);

                // ENTER
                ann.enter()
                    .append('text')
                    .attr('class', 'ann')
                    .style('font-size', '9px')
                    .style('font-family', 'Verdana');

                // UPDATE
                ann.style('opacity', 0.000001)
                    .attr('x', function (d) {
                        if (x(d.count) > 40) {
                            return x(d.count) - 10;
                        }
                        return x(d.count) + 15;
                    })
                    .style('fill', function (d) {
                        if (x(d.count) > '40') {
                            return 'white';
                        }
                        return 'black';
                    })
                    .attr('text-anchor', function (d) {
                        if (x(d.count) > '40') {
                            return 'end';
                        }
                        return 'start';
                    })
                    .attr('y', function (d, i) {
                        return 25 * i + 12;
                    })
                    .text(function (d) {
                        return d.count;
                    })
                    .transition().delay(750).duration(1000)
                    .style('opacity', '1');

                // EXIT
                ann.exit()
                    .style('opacity', 0.000001)
                    .remove();
            });
        }

        return chart;
    };

    window.BarChart = BarChart;
}(window));
