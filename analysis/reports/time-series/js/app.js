/**
 * Central application for chart display.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 *
 * @property {object} filters Instantiated filter module
 * @property {object} chart Instantiated time series chart
 */
(function (ReportFilters, TimeSeries, BarChart) {
    var App = {
        filters: null,
        mainChart: null,
        suppChart: null,
        updateListeners: null,
        counts: null,
        params: null,
        weekdays: {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        },
        hours: {
            0: '12:00 AM',
            1: '01:00 AM',
            2: '02:00 AM',
            3: '03:00 AM',
            4: '04:00 AM',
            5: '05:00 AM',
            6: '06:00 AM',
            7: '07:00 AM',
            8: '08:00 AM',
            9: '09:00 AM',
            10: '10:00 AM',
            11: '11:00 AM',
            12: '12:00 PM',
            13: '01:00 PM',
            14: '02:00 PM',
            15: '03:00 PM',
            16: '04:00 PM',
            17: '05:00 PM',
            18: '06:00 PM',
            19: '07:00 PM',
            20: '08:00 PM',
            21: '09:00 PM',
            22: '10:00 PM',
            23: '11:00 PM'
        },
        /**
         * Initializes app
         *
         * @this {App}
         */
        init: function () {

            // Insert default dates
            this.insertDefaultDates();

            // Insert filter select boxes
            this.insertFilters();

            // Set initiative filter to default (for back button)
            $('#initiatives').val('default');

            // Bind events (AJAX Call)
            this.bindEvents();
        },
        /**
         * Inserts default dates into form
         */
        insertDefaultDates : function () {
            // Create dates for default date display
            var now = moment().format('YYYY-MM-DD'),
                then = moment().subtract('months', 6).format('YYYY-MM-DD');

            // Insert default dates into DOM
            $('#sdate').val(then);
            $('#edate').val(now);
        },
        /**
         * Initializes and inserts secondary filters
         */
        insertFilters: function () {
            // Create options object for filters
            var filterOptions = {
                url: '../../lib/php/reportFilters.php',
                triggerForm: '#initiatives',
                filterForm: '#secondary-filters',
                locationsTemplate: '#locations-template',
                activitiesTemplate: '#activities-template',
                locationsSelect: '#locations',
                activitiesSelect: '#activities'
            };

            // Initialize filters
            if (this.filters === null) {
                this.filters = new ReportFilters(filterOptions);
            }

            this.filters.init();
        },
        /**
         * Binds events for datepicker and data AJAX call.
         */
        bindEvents: function () {
            var self = this;

            // Initialize datepicker
            $('#sdate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});
            $('#edate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});

            // Initialize help popovers
            $('.suma-popover').popover({placement: 'bottom'});

            // Event handler to initialize AJAX call
            $('body').on('submit', '#chartFilters', function (e) {
                var input = $(this).serializeArray();
                // Save params for annotation later
                self.params = input;

                $.when(self.getData(input))
                    .then(function (data) {
                        var counts = self.processData(data);

                        if (counts) {
                            self.drawChart(counts);
                            self.counts = counts;
                            self.drawTable(counts);
                            self.buildCSV(data.csv, counts);
                            $('.post-load-popover').popover();
                        } else {
                            self.noData();
                        }
                    }, function (e) {
                        $('#ajax-error').show();
                    });

                e.preventDefault();
            });

            // Live Filters
            $('#main-chart-avgsum').on('click', function (e) {
                var mainState,
                    locState,
                    avgState;

                mainState = e.target.value;
                locState = $('#supp-chart-locact > .active')[0].value;
                avgState = $('#supp-chart-avgsum > .active')[0].value;

                self.updateMainChart(self.counts, mainState, locState, avgState);
            });

            $('#supp-chart-locact').on('click', function (e) {
                var mainState,
                    locState,
                    avgState;

                mainState = $('#main-chart-avgsum > .active')[0].value;
                locState = e.target.value;
                avgState = $('#supp-chart-avgsum > .active')[0].value;

                self.updateSuppChart(self.counts, mainState, locState, avgState);
            });

            $('#supp-chart-avgsum').on('click', function (e) {
                var mainState,
                    locState,
                    avgState;

                mainState = $('#main-chart-avgsum > .active')[0].value;
                locState = $('#supp-chart-locact > .active')[0].value;
                avgState = e.target.value;

                if (avgState === 'avg') {
                    $('#supp-chart-note').css('visibility', 'visible');
                } else {
                    $('#supp-chart-note').css('visibility', 'hidden');
                }

                self.updateSuppChart(self.counts, mainState, locState, avgState);
            });

            // Image Download (These need to be optimized)
            $('#main-download').on('click', function (e) {
                var linkId = "#" + this.id,
                    tempChart;

                // Grab main chart code
                tempChart = $('#chart1').html();

                // Append chart code into invisible div for additional processing
                $('body').append('<div id="temp-chart" style="display:none">' + tempChart + '</div>');

                // Add inline styling to chart in temp div
                $('#temp-chart .mainGraph path').attr('fill', 'steelblue');
                $('#temp-chart .subGraph path').attr('fill', 'steelblue');
                $('#temp-chart .y .tick').attr('fill', 'none').attr('stroke', '#000').attr('shape-rendering', 'crispEdges');
                $('#temp-chart .y path').attr('fill', 'none').attr('stroke', '#000').attr('shape-rendering', 'crispEdges');
                $('#temp-chart .x .tick').attr('fill', 'none').attr('stroke', '#000').attr('shape-rendering', 'crispEdges');
                $('#temp-chart .x path').attr('fill', 'none').attr('stroke', '#000').attr('shape-rendering', 'crispEdges');

                // Remove brush component
                $('#temp-chart .subGraph').remove();

                // Send dummy chart to conversion method
                self.downloadPNG(linkId, '#temp-chart');

                // Remove temp div
                $('#temp-chart').remove();
            });

            $('#supp-download').on('click', function (e) {
                var linkId = "#" + this.id,
                    chartId = "#" + $(this).attr('data-chart-div');

                self.downloadPNG(linkId, chartId);
            });

        },
         /**
         * Method to convert SVG to downloadable PNG
         * @param  string linkId  CSS ID of the link clicked to call method
         * @param  string chartId Contents of data-property with CSS ID of source SVG wrapper div
         */
        downloadPNG: function (linkId, chartId) {
            var canvas,
                img,
                svg;

            // Get svg markup from chart
            svg = $(chartId).html();

            // Insert invisible canvas
            $('body').append('<canvas id="canvas" style="display:none"></canvas>');

            // Insert chart into invisible canvas
            canvg(document.getElementById('canvas'), svg);

            // Retrieve contents of invisible canvas
            canvas = document.getElementById('canvas');

            // Convert canvas to data
            img = canvas.toDataURL("image/png");

            // Update href to use data:image
            $(linkId).attr('href', img);

            // Remove Canvas
            $('#canvas').remove();
        },
        /**
         * Build chart metadata from params
         */
        buildChartMetadata: function () {
            var actId,
                activities = {},
                context,
                data       = {},
                html,
                initName   = $("#initiatives option:selected").text(),
                locations  = {},
                source,
                template;

            _.each(this.params, function (element, index) {
                data[element.name] = element.value;
            });

            _.each(this.filters.activities, function (element, index) {
                activities[element.id] = element.title;
            });

            _.each(this.filters.locations, function (element, index) {
                locations[element.id] = element.title;
            });

            data.id = initName;

            if (data.locations !== 'all') {
                data.locations = locations[data.locations];
            } else {
                data.locations = data.locations.substr(0, 1).toUpperCase() +
                                 data.locations.substr(1).toLowerCase();
            }

            if (data.activities !== 'all') {
                actId = data.activities.split('-');
                actId = actId[1];
                data.activities = activities[actId];
            } else {
                data.activities = data.activities.substr(0, 1).toUpperCase() +
                                 data.activities.substr(1).toLowerCase();
            }

            if (data.daygroup === 'all') {
                data.daygroup = data.daygroup.substr(0, 1).toUpperCase() +
                                 data.daygroup.substr(1).toLowerCase();
            }

            if (data.sdate === '') {
                data.sdate = 'Beginning of Time';
            }

            if (data.edate === '') {
                data.edate = 'Current';
            }

            if (data.stime === '') {
                data.stime = '00:00';
            }

            if (data.etime === '') {
                data.etime = '24:00';
            }

            source   = $('#main-annotation-template').html();
            template = Handlebars.compile(source);
            context  = data;
            html     = template(context);

            $('#main-annotation').empty();
            $('#main-annotation').append(html);

        },
        /**
         * AJAX call to retrieve data
         *
         * @param  {array} input
         * @return {object} Returns a jQuery promise object
         */
        getData: function (input) {
            return $.ajax({
                url: 'results.php',
                data: input,
                dataType: 'json',
                // These are a hot mess and need to be optimized
                beforeSend: function () {
                    var text = $('#submit').data('loading-text');
                    $('#submit').addClass('disabled').val(text);
                    $('#submit').attr('disabled', 'true');
                    $('svg').remove();
                    $('.alert').hide();
                    $('#loading').show();
                    $('#summary-data').hide();
                    $('#supplemental-charts').hide();
                    $('#main-chart-header').css('visibility', 'hidden');
                },
                success: function () {
                    $('#summary-data').show();
                    $('#supplemental-charts').show();
                    $('#main-chart-header').css('visibility', 'visible');
                },
                complete: function () {
                    var text = $('#submit').data('default-text');
                    $('#submit').removeClass('disabled').val(text);
                    $('#submit').removeAttr('disabled');
                    $('#loading').hide();
                }
            });
        },
        /**
         * Sort ascending according to date, meant to be used with
         * native arr.sort() method.
         *
         * @param  {object} a
         * @param  {object} b
         * @return {integer}
         */
        sortData: function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        },
        sortDays: function (a, b) {
            return a.value - b.value;
        },
        /**
         * Display error message
         */
        noData: function () {
            $('#no-data').show();
            $('#summary-data').hide();
            $('#submit').removeAttr('disabled');
            $('#supplemental-charts').hide();
            $('#main-chart-header').css('visibility', 'hidden');
        },
        /**
         * Process response from AJAX call
         *
         * @param  {object} response
         * @return {array}
         */
        processData: function (response) {
            var self = this,
                counts,
                locations,
                activities,
                testLength;
            console.log('from app.js', response);
            if (!response.locationsSum) {
                return false;
            }


            // Convert response into arrays of objects
            counts = {};

            // Get location/activity data from filters object
            locations = this.filters.locations;
            activities = this.filters.activities;

            // Total Sum
            counts.total = [{
                count : response.total
            }];

            // Locations Sum
            counts.locationsSum = [];
            counts.locationsPct = [];
            _.each(response.locationsSum, function (element, index) {
                var locDict,
                    newObj,
                    pctObj;

                locDict = _.filter(locations, function (ele) {
                    return ele.id === parseInt(index, 10);
                });

                newObj = {
                    id    : index,
                    name  : locDict[0].title,
                    depth : locDict[0].depth,
                    rank  : locDict[0].rank,
                    parent: locDict[0].parent,
                    count : element,
                    percent: (element / response.total * 100).toFixed(2)
                };

                pctObj = {
                    id    : index,
                    name  : locDict[0].title,
                    depth : locDict[0].depth,
                    rank  : locDict[0].rank,
                    parent: locDict[0].parent,
                    count : newObj.percent
                };

                counts.locationsSum.push(newObj);
                counts.locationsPct.push(pctObj);
            });

            // Locations Avg Sum
            counts.locationsAvgSum = [];
            _.each(response.locationsAvgSum, function (element, index) {
                var locDict,
                    newObj;

                locDict = _.filter(locations, function (parent) {
                    return parent.id === parseInt(index, 10);
                });

                newObj = {
                    id    : index,
                    name  : locDict[0].title,
                    depth : locDict[0].depth,
                    rank  : locDict[0].rank,
                    parent: locDict[0].parent,
                    count : element.toFixed(2)
                };
                counts.locationsAvgSum.push(newObj);
            });

            //Locations Avg Avg
            counts.locationsAvgAvg = [];
            delete response.locationsAvgAvg.averages;
            delete response.locationsAvgAvg.days;

            _.each(response.locationsAvgAvg, function (element, index) {
                var locDict,
                    newObj;

                locDict = _.filter(locations, function (parent) {
                    return parent.id === parseInt(index, 10);
                });

                newObj = {
                    id    : index,
                    name  : locDict[0].title,
                    depth : locDict[0].depth,
                    rank  : locDict[0].rank,
                    parent: locDict[0].parent,
                    count : element.toFixed(2)
                };
                counts.locationsAvgAvg.push(newObj);
            });

            // Activities Sum
            counts.activitiesSum = [];
            counts.activitiesPct = [];
            _.each(response.activitiesSum, function (element, index) {
                var actDict,
                    newObj,
                    pctObj;

                actDict = _.filter(activities, function (act, i) {
                    return act.id === parseInt(index, 10) && act.type === 'activity';
                });

                if (actDict.length > 0) {
                    newObj = {
                        id    : index,
                        name  : actDict[0].title,
                        depth : actDict[0].depth,
                        rank  : actDict[0].rank,
                        activityGroup: actDict[0].activityGroup,
                        count : element,
                        percent: (element / response.total * 100).toFixed(2)
                    };

                    pctObj = {
                        id    : index,
                        name  : actDict[0].title,
                        depth : actDict[0].depth,
                        rank  : actDict[0].rank,
                        activityGroup: actDict[0].activityGroup,
                        count : newObj.percent
                    };
                } else {
                    newObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : null,
                        rank  : null,
                        activityGroup: null,
                        count : element,
                        percent: (element / response.total * 100).toFixed(2)
                    };

                    pctObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : null,
                        rank  : null,
                        activityGroup: null,
                        count : newObj.percent
                    };
                }

                counts.activitiesSum.push(newObj);
                counts.activitiesPct.push(pctObj);
            });

            // Activities Avg Sum
            counts.activitiesAvgSum = [];
            _.each(response.activitiesAvgSum, function (element, index) {
                var actDict,
                    newObj;

                actDict = _.filter(activities, function (act, i) {
                    return act.id === parseInt(index, 10) && act.type === 'activity';
                });

                if (actDict.length > 0) {
                    newObj = {
                        id    : index,
                        name  : actDict[0].title,
                        depth : actDict[0].depth,
                        rank  : actDict[0].rank,
                        activityGroup: actDict[0].activityGroup,
                        count : element.toFixed(2)
                    };
                } else {
                    newObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : null,
                        rank  : null,
                        activityGroup: null,
                        count : element.toFixed(2)
                    };
                }
                counts.activitiesAvgSum.push(newObj);
            });

            // Activities Avg Avg
            counts.activitiesAvgAvg = [];
            delete response.activitiesAvgAvg.averages;
            delete response.activitiesAvgAvg.days;

            _.each(response.activitiesAvgAvg, function (element, index) {
                var actDict,
                    newObj;

                actDict = _.filter(activities, function (act, i) {
                    return act.id === parseInt(index, 10) && act.type === 'activity';
                });

                if (actDict.length > 0) {
                    newObj = {
                        id    : index,
                        name  : actDict[0].title,
                        depth : actDict[0].depth,
                        rank  : actDict[0].rank,
                        activityGroup: actDict[0].activityGroup,
                        count : element.toFixed(2)
                    };
                } else {
                    newObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : null,
                        rank  : null,
                        activityGroup: null,
                        count : element.toFixed(2)
                    };
                }
                counts.activitiesAvgAvg.push(newObj);
            });

            // Period Sum
            counts.periodSum = [];
            _.each(response.periodSum, function (element, index) {
                var newObj = {
                    date: index,
                    count: element.count
                };

                counts.periodSum.push(newObj);
            });

            // Period Avg
            counts.periodAvg = [];
            _.each(response.periodAvg, function (element, index) {
                var newObj = {
                    date: index,
                    count: element.count
                };

                counts.periodAvg.push(newObj);
            });

            // Hourly Summary
            counts.hourSummary = [];
            _.each(response.hourSummary, function (element, index) {
                var newObj = {
                    name: index,
                    count: element,
                    percent: (element / response.total * 100).toFixed(2)
                };

                counts.hourSummary.push(newObj);
            });

            // Day of Week Summary
            counts.dayOfWeekSummary = [];
            _.each(response.dayOfWeekSummary, function (element, index) {
                var newObj = {
                    value: self.weekdays[index],
                    name: index,
                    count: element,
                    percent: (element / response.total * 100).toFixed(2)
                };

                counts.dayOfWeekSummary.push(newObj);
            });

            // Month Summary
            counts.monthSummary = [];
            _.each(response.monthSummary, function (months, year) {
                _.each(months, function (count, month) {
                    var newObj = {
                        date: month + ' ' + '1' + ', ' + year,
                        name: month + ' ' + year,
                        count: count,
                        percent: (count / response.total * 100).toFixed(2)
                    };

                    counts.monthSummary.push(newObj);
                });
            });

            // Year Summary
            counts.yearSummary = [];
            _.each(response.yearSummary, function (element, index) {
                var newObj = {
                    date: index + '-01-01',
                    name: index,
                    count: element,
                    percent: (element / response.total * 100).toFixed(2)
                };

                counts.yearSummary.push(newObj);
            });

            // Check if counts is large enough to display meaningfully
            // testLength = _.unique(_.pluck(_.values(counts.periodSum), 'count'));

            // if (testLength.length === 1) {
            //     return false;
            // }

            // Sort period arrays by date
            counts.periodSum.sort(self.sortData);
            counts.periodAvg.sort(self.sortData);
            counts.yearSummary.sort(self.sortData);
            counts.monthSummary.sort(self.sortData);
            counts.dayOfWeekSummary.sort(self.sortDays);

            console.log('counts', counts);
            return counts;
        },
        /**
         * Draw chart
         *
         * @param  {array} counts
         */
        drawChart: function (counts) {
            var self = this,
                avgState,
                locState,
                mainState;

            if (!this.mainChart) {
                this.mainChart = new TimeSeries();
            }

            if (!this.suppChart) {
                this.suppChart = new BarChart();
            }

            // Get states from DOM
            mainState = $('#main-chart-avgsum > .active')[0].value;
            locState = $('#supp-chart-locact > .active')[0].value;
            avgState = $('#supp-chart-avgsum > .active')[0].value;

            self.updateMainChart(counts, mainState, locState, avgState);

        },
        /**
         * Update primary chart
         * @param  {array} counts
         * @param  {string} mainState
         * @param  {string} locState
         * @param  {string} avgState
         */
        updateMainChart: function (counts, mainState, locState, avgState) {
            var self = this,
                data;

            // Select Data Source
            if (mainState === 'sum') {
                data = counts.periodSum;
            } else {
                data = counts.periodAvg;
            }

            // Update Main Chairt
            $('#chart1 > svg').remove();
            d3.select("#chart1")
                .datum(data)
                .call(this.mainChart);

            // Update Supplemental Chart
            self.updateSuppChart(counts, mainState, locState, avgState);

            // Update metadata on UI
            self.buildChartMetadata();
        },
        /**
         * Update secondary chart
         * @param  {array} counts
         * @param  {string} mainState
         * @param  {string} locState
         * @param  {string} avgState
         */
        updateSuppChart: function (counts, mainState, locState, avgState) {
            var data,
                actAvg,
                actPct,
                actSum,
                locAvg,
                locPct,
                locSum;

            // Set sum data
            locSum = counts.locationsSum;
            actSum = counts.activitiesSum;

            // Set pct data
            locPct = counts.locationsPct;
            actPct = counts.activitiesPct;

            // Set avg data
            if (mainState === 'sum') {
                locAvg = counts.locationsAvgSum;
                actAvg = counts.activitiesAvgSum;
            } else {
                locAvg = counts.locationsAvgAvg;
                actAvg = counts.activitiesAvgAvg;
            }

            // Set data to send to chart based on state of main and supplement charts
            if ((locState === 'locations') && (avgState === 'sum')) {
                data = locSum;
            } else if ((locState === 'locations') && (avgState === 'avg')) {
                data = locAvg;
            } else if ((locState === 'locations') && (avgState === 'pct')) {
                data = locPct;
            } else if ((locState === 'activities') && (avgState === 'sum')) {
                data = actSum;
            } else if ((locState === 'activities') && (avgState === 'avg')) {
                data = actAvg;
            } else if ((locState === 'activities') && (avgState === 'pct')) {
                data = actPct;
            }

            d3.select("#chart2")
                .datum(data)
                .call(this.suppChart);
        },
        drawTable: function (counts) {
            this.buildTemplate(counts.total, '#total-sum-table', '#total-data');
            this.buildTemplate(counts.locationsSum, '#locations-sum-table', '#locations-data');
            this.buildTemplate(counts.activitiesSum, '#activities-sum-table', '#activities-data');
            this.buildTemplate(counts.yearSummary, '#year-table', '#year-data');
            this.buildTemplate(counts.monthSummary, '#month-table', '#month-data');
            this.buildTemplate(counts.dayOfWeekSummary, '#weekday-table', '#weekday-data');
            this.buildTemplate(counts.hourSummary, '#hour-table', '#hour-data');
        },
        locHeader: null,
        actHeader: null,
        sortCSV: function (a, b) {
            return a.name - b.name;
        },
        sortCSVItems: function (items) {
            var self = this,
                arr;

            arr = [];
            _.each(items, function (count, name) {
                if (name) {
                    var obj = {
                        name: name,
                        count: count || '' // empty string for null counts
                    };
                    arr.push(obj);
                }
            });

            arr.sort(self.sortCSV);
            return arr;
        },
        sortCSVLines: function (a, b) {
            // Strip dashes from dates
            return a[0].replace(/-/g, "") - b[0].replace(/-/g, "");
        },
        /**
         * Method to convert preformed CSV object to CSV download
         * @param  array csv
         * @return
         */
        buildCSV: function (csv, counts) {
            var self = this,
                base,
                content,
                csvLines,
                finalContent,
                formattedLines,
                header,
                href,
                lines,
                summaryHash;

            lines = [];
            csvLines = [];
            header = ['Date', 'Total'];

            self.locHeader = null;
            self.actHeader = null;

            _.each(csv, function (day, date) {
                var actHeader,
                    activities,
                    line,
                    locations,
                    locHeader;

                line = [];
                line.push(day.date);
                line.push(day.total);

                // Build Header on first pass
                if (!self.locHeader) {
                    locHeader = self.sortCSVItems(day.locations);
                    locHeader = _.pluck(locHeader, 'name');
                    self.locHeader = locHeader;
                }

                if (!self.actHeader) {
                    actHeader = self.sortCSVItems(day.activities);
                    actHeader = _.pluck(actHeader, 'name');
                    self.actHeader = actHeader;
                }

                // Convert locations to array and sort, add to line
                locations = self.sortCSVItems(day.locations);
                _.each(locations, function (loc, locName) {
                    line.push(loc.count);
                });

                // Convert activities to array and sort, add to line
                activities = self.sortCSVItems(day.activities);
                _.each(activities, function (act, actName) {
                    line.push(act.count);
                });
                lines.push(line);
            });

            // Add location names to header
            _.each(self.locHeader, function (locName) {
                header.push(locName);
            });

            // Add activity names to header
            _.each(self.actHeader, function (actname) {
                header.push(actname);
            });

            // Sort lines by date
            lines.sort(self.sortCSVLines);

            // Build hash of summary data
            summaryHash = {
                locations: counts.locationsSum,
                activities: counts.activitiesSum,
                hourly: counts.hourSummary,
                daily: counts.dayOfWeekSummary,
                monthly: counts.monthSummary,
                yearly: counts.yearSummary
            };

            // Add summary data to csv lines array
            _.each(summaryHash, function (e, i) {
                var header = [
                    i,
                    'count',
                    'percent'
                ];

                lines.push(header);

                _.each(e, function (l) {
                    var line = [];

                    line.push(l.name);
                    line.push(l.count);
                    line.push(l.percent);

                    lines.push(line);
                });
            });

            // Format arrays into strings
            formattedLines = d3.csv.format(lines);

            // Merge header and lines
            header = header + '\n';
            finalContent = header + formattedLines;

            // Build download URL
            base = 'data:application/csv;charset=utf-8,';
            href = encodeURI(base + finalContent);

            $('#csv').attr('href', href);
        },
        /**
         * Generic Method to add template to DOM
         * @param  array items
         * @param  string templateId
         * @param  string elementId
         */
        buildTemplate: function (items, templateId, elementId) {
            var html,
                json,
                self = this,
                template;

            // Insert list into object for template iteration
            json = {items: items};

            // Retrieve template from index.php (in script tag)
            html = $(templateId).html();

            // Compile template
            template = Handlebars.compile(html);

            Handlebars.registerHelper('countFormat', function (count) {
                var formatCount = d3.format(','),
                    formattedCount = formatCount(count);

                return formattedCount;
            });

            Handlebars.registerHelper('hourFormat', function (hour) {
                return self.hours[hour];
            });

            // Populate template with data and insert into DOM
            $(elementId).empty();
            $(elementId).append(template(json));
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(ReportFilters, TimeSeries, BarChart));