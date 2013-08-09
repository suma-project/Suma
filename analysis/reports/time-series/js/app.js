/**
 * Central application for chart display.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 *
 * @property {object} filters Instantiated filter module
 * @property {object} chart Instantiated time series chart
 */
(function (ReportFilters, Errors, TimeSeries, BarChart) {
    var App = {
        cfg: {
            alert:         '.alert',
            avgState:      '#supp-chart-avgsum > .active',
            chart1:        '#chart1',
            chart1svg:     '#chart1 > svg',
            chart2:        '#chart2',
            csv:           '#csv',
            eDate:         '#edate',
            errorTarget:   '#chart',
            errorTemplate: '#error',
            filter:        '#initiatives',
            form:          '#chartFilters',
            initiatives:   '#initiatives option:selected',
            loading:       '#loading',
            locState:      '#supp-chart-locact > .active',
            mainAnnotate:  '#main-annotation',
            mainAnnotateTemplate: '#main-annotation-template',
            mainAvgSum:    '#main-chart-avgsum',
            mainChart:     '#main-chart-header',
            mainDownload:  '#main-download',
            mainState:     '#main-chart-avgsum > .active',
            popover:       '.suma-popover',
            sDate:         '#sdate',
            submit:        '#submit',
            summaryData:   '#summary-data',
            suppAvgSum:    '#supp-chart-avgsum',
            suppChart:     '#supplemental-charts',
            suppDownload:  '#supp-download',
            suppLoc:       '#supp-chart-locact',
            suppNote:      '#supp-chart-note',
            filterOptions: {
                activitiesSelect:   '#activities',
                activitiesTemplate: '#activities-template',
                filterForm:         '#secondary-filters',
                locationsSelect:    '#locations',
                locationsTemplate:  '#locations-template',
                triggerForm:        '#initiatives',
                url:                '../../lib/php/reportFilters.php'
            },
            tables: {
                actSumTgt:   '#activities-data',
                actSumTmp:   '#activities-sum-table',
                hourTgt:     '#hour-data',
                hourTmp:     '#hour-table',
                locSumTgt:   '#locations-data',
                locSumTmp:   '#locations-sum-table',
                monthTgt:    '#month-data',
                monthTmp:    '#month-table',
                totalSumTgt: '#total-data',
                totalSumTmp: '#total-sum-table',
                weekdayTgt:  '#weekday-data',
                weekdayTmp:  '#weekday-table',
                yearTgt:     '#year-data',
                yearTmp:     '#year-table'
            }
        },
        locHeader: null,
        actHeader: null,
        filters: null,
        mainChart: null,
        suppChart: null,
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
            $(this.cfg.filter).val('default');

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
            $(this.cfg.sDate).val(then);
            $(this.cfg.eDate).val(now);
        },
        /**
         * Initializes and inserts secondary filters
         */
        insertFilters: function () {
            // Create options object for filters
            var filters,
                self = this;

            // Initialize filters
            if (this.filters === null) {
                this.filters = new ReportFilters(this.cfg.filterOptions);
            }

            filters = this.filters.init();

            filters.fail(function (e) {
                self.error(e);
            });
        },
        /**
         * Binds events for datepicker and data AJAX call.
         */
        bindEvents: function () {
            var self = this;

            // Initialize datepicker
            $(self.cfg.sDate).datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});
            $(self.cfg.eDate).datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});

            // Initialize help popovers
            $(self.cfg.popover).popover({placement: 'bottom'});

            // Event handler to initialize AJAX call
            $('body').on('submit', self.cfg.form, function (e) {
                var input = $(this).serializeArray();
                // Save params for annotation later
                self.params = input;

                $.when(self.getData(input))
                    .then(self.processData.bind(self))
                    .then(function (counts) {
                        self.drawChart(counts);
                        self.counts = counts;
                        self.drawTable(counts, self.cfg.tables);
                        self.buildCSV(_.cloneDeep(self.counts));
                    }, function (e) {
                        self.error(e);
                    });

                e.preventDefault();
            });

            // Live Filters
            $(self.cfg.mainAvgSum).on('click', function (e) {
                var mainState,
                    locState,
                    avgState;

                mainState = e.target.value;
                locState = $(self.cfg.locState)[0].value;
                avgState = $(self.cfg.avgState)[0].value;

                self.updateMainChart(self.counts, mainState, locState, avgState);
            });

            $(self.cfg.suppLoc).on('click', function (e) {
                var mainState,
                    locState,
                    avgState;

                mainState = $(self.cfg.mainState)[0].value;
                locState = e.target.value;
                avgState = $(self.cfg.avgState)[0].value;

                self.updateSuppChart(self.counts, mainState, locState, avgState);
            });

            $(self.cfg.suppAvgSum).on('click', function (e) {
                var mainState,
                    locState,
                    avgState;

                mainState = $(self.cfg.mainState)[0].value;
                locState = $(self.cfg.locState)[0].value;
                avgState = e.target.value;

                if (avgState === 'avg') {
                    $(self.cfg.suppNote).css('visibility', 'visible');
                } else {
                    $(self.cfg.suppNote).css('visibility', 'hidden');
                }

                self.updateSuppChart(self.counts, mainState, locState, avgState);
            });

            // Main Chart Download
            $(self.cfg.mainDownload).on('click', function () {
                var linkId = "#" + this.id,
                    chartId = "#" + $(this).attr('data-chart-div');

                self.downloadPNG(linkId, chartId, '.subGraph');
            });

            // Supplemental Chart Download
            $(self.cfg.suppDownload).on('click', function () {
                var linkId = "#" + this.id,
                    chartId = "#" + $(this).attr('data-chart-div');

                self.downloadPNG(linkId, chartId);
            });
        },
        /**
         * Method to filter a single element from SVG
         * @param  {string} chartId Contents of data-property with CSS ID
         * @param  {string} filter  Class or ID of element to be removed
         * @return {string}         Filtered SVG content
         */
        filterSvg: function (chartId, filter) {
            var svg = $(chartId).clone();

            svg.find(filter).remove();

            return svg.html();
        },
         /**
         * Method to convert SVG to downloadable PNG
         *
         * @param  {string} linkId  CSS ID of the link clicked to call method
         * @param  {string} chartId Contents of data-property with CSS ID of source SVG wrapper div
         */
        downloadPNG: function (linkId, chartId, filter) {
            var canvas,
                img,
                svg;

            // Get svg markup from chart
            if (filter) {
                svg = this.filterSvg(chartId, filter);
            } else {
                svg = $(chartId).html();
            }

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
                initName   = $(this.cfg.initiatives).text(),
                locations  = {},
                source,
                template;

            _.each(this.params, function (element) {
                data[element.name] = element.value;
            });

            _.each(this.filters.activities, function (element) {
                activities[element.id] = element.title;
            });

            _.each(this.filters.locations, function (element) {
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

            source   = $(this.cfg.mainAnnotateTemplate).html();
            template = Handlebars.compile(source);
            context  = data;
            html     = template(context);

            $(this.cfg.mainAnnotate).empty();
            $(this.cfg.mainAnnotate).append(html);
        },
        toggleSubmit: function (loading) {
            var loadingText = $(this.cfg.submit).data('loading-text'),
                defaultText = $(this.cfg.submit).data('default-text');

            if (loading) {
                $(this.cfg.submit).addClass('disabled').val(loadingText);
                $(this.cfg.submit).attr('disabled', 'true');
            } else {
                $(this.cfg.submit).removeClass('disabled').val(defaultText);
                $(this.cfg.submit).removeAttr('disabled');
            }
        },
        /**
         * AJAX call to retrieve data
         *
         * @param  {array} input
         * @return {object} Returns a jQuery promise object
         */
        getData: function (input) {
            var self = this;

            return $.ajax({
                url: 'results.php',
                data: input,
                dataType: 'json',
                // These are a hot mess and need to be optimized
                beforeSend: function () {
                    self.toggleSubmit(true);
                    $('svg').remove();
                    $(self.cfg.alert).hide();
                    $(self.cfg.loading).show();
                    $(self.cfg.summaryData).hide();
                    $(self.cfg.suppChart).hide();
                    $(self.cfg.mainChart).css('visibility', 'hidden');
                },
                success: function () {
                    $(self.cfg.summaryData).show();
                    $(self.cfg.suppChart).show();
                    $(self.cfg.mainChart).css('visibility', 'visible');
                },
                complete: function () {
                    self.toggleSubmit();
                    $(self.cfg.loading).hide();
                },
                timeout: 180000 // 3 mins
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
        calcCount: function (loc, coll, prop) {
            var hasChildren,
                self = this;

            hasChildren = _.filter(coll, function (item, index) {
                return loc.id === item[prop];
            });

            if (hasChildren.length < 1) {
                return loc.count;
            }

            return _.reduce(_.map(hasChildren, function (l) {
                return self.calcCount(l, coll, prop);
            }), function (sum, num) {
                return sum + num;
            });
        },
        insertNoActs: function (source, total, mode) {
            var obj = {},
                noActs;

            noActs = _.find(source, function (item, key) {
                return key === "_No Activity";
            });

            if (noActs) {
                obj.name = "No Activity";
                obj.depth = 0;

                obj.percent = (noActs / total * 100).toFixed(2);

                if (mode === 'pct') {
                    obj.count = (noActs / total * 100).toFixed(2);
                }

                if (mode === 'sum') {
                    obj.count = noActs;
                }

                if (mode === 'avg') {
                    obj.count = noActs.toFixed(2);
                }

                return obj;
            }

            return false;
        },
        buildArray: function (source, response, total, trunc, pct) {
            return _.filter(_.map(_.cloneDeep(source), function (o) {
                o.name = o.title;

                if (trunc) {
                    o.count = response[o.id] ? response[o.id].toFixed(2) : null;
                } else {
                    o.count = response[o.id] || null;
                }

                if (o.count !== null) {
                    o.percent = (o.count / total * 100).toFixed(2);
                } else {
                    o.percent = null;
                }

                if (pct) {
                    o.count = o.percent;
                }

                return o;
            }), function (obj) {
                return obj.count !== null;
            });
        },
        buildTableArray: function (source, response, total, flag) {
            var counts,
                self = this;

            counts = _.map(_.cloneDeep(source), function (loc, index) {
                loc.name = loc.title;
                loc.count = response[loc.id] || null;

                return loc;
            });

            // Calculate counts for children
            return _.map(counts, function (loc, index, coll) {
                loc.count = self.calcCount(loc, coll, flag);
                loc.percent = (loc.count / total * 100).toFixed(2);

                return loc;
            });
        },
        /**
         * Process response from AJAX call
         *
         * @param  {object} response
         * @return {array}
         */
        processData: function (response) {
            var dataTest,
                dfd = $.Deferred(),
                noActsSum,
                noActsAvgSum,
                noActsAvgAvg,
                self = this,
                counts,
                locations,
                activities;

            // Reject if no locations
            if (!response.locationsSum) {
                dfd.reject({statusText: 'no data'});
            }

            // Convert response into arrays of objects
            counts = {};

            // Get location/activity data from filters object
            locations = this.filters.locations;
            activities = this.filters.activities;

            // CSV
            counts.csv = response.csv;

            // Total Sum
            counts.total = [{
                count : response.total
            }];

            // Locations related data
            counts.locationsTable = self.buildTableArray(locations, response.locationsSum, response.total, 'parent');
            counts.locationsSum = self.buildArray(locations, response.locationsSum, response.total);
            counts.locationsAvgSum = self.buildArray(locations, response.locationsAvgSum, response.total, true);
            counts.locationsAvgAvg = self.buildArray(locations, response.locationsAvgAvg, response.total, true);
            counts.locationsPct = self.buildArray(locations, response.locationsSum, response.total, false, true);

            // Activities related data
            counts.activitiesTable = self.buildTableArray(activities, response.activitiesSum, response.total, 'activityGroup');
            counts.activitiesSum = self.buildArray(activities, response.activitiesSum, response.total);
            counts.activitiesAvgSum = self.buildArray(activities, response.activitiesAvgSum, response.total, true);
            counts.activitiesAvgAvg = self.buildArray(activities, response.activitiesAvgAvg, response.total, true);
            counts.activitiesPct = self.buildArray(activities, response.activitiesSum, response.total, false, true);

            // Handle insertion of no activity values
            noActsSum = self.insertNoActs(response.activitiesSum, response.total, 'sum');
            if (noActsSum) {
                counts.activitiesSum.push(noActsSum);
                counts.activitiesTable.push(noActsSum);
                counts.activitiesPct.push(self.insertNoActs(response.activitiesSum, response.total, 'pct'));
            }

            noActsAvgSum = self.insertNoActs(response.activitiesAvgSum, response.total, 'avg');
            if (noActsAvgSum) {
                counts.activitiesAvgSum.push(noActsAvgSum);
            }

            noActsAvgAvg = self.insertNoActs(response.activitiesAvgAvg, response.total, 'avg');
            if (noActsAvgAvg) {
                counts.activitiesAvgAvg.push(noActsAvgAvg);
            }

            // Period Sum
            counts.periodSum = _.map(response.periodSum, function (element, index) {
                return {
                    date: index,
                    count: element.count
                };
            });

            // Period Avg
            counts.periodAvg = _.map(response.periodAvg, function (element, index) {
                return {
                    date: index,
                    count: element.count
                };
            });

            // Hourly Summary
            counts.hourlySummary = _.map(response.hourSummary, function (element, index) {
                return {
                    name: index,
                    count: element,
                    percent: (element / response.total * 100).toFixed(2)
                };
            });

            // Day of Week Summary
            counts.dayOfWeekSummary = _.map(response.dayOfWeekSummary, function (element, index) {
                return {
                    value: self.weekdays[index],
                    name: index,
                    count: element,
                    percent: (element / response.total * 100).toFixed(2)
                };
            });

            // Month Summary
            counts.monthSummary = _.flatten(_.map(response.monthSummary, function (months, year) {
                return _.map(months, function (count, month) {
                    return {
                        date: month + ' ' + '1' + ', ' + year,
                        name: month + ' ' + year,
                        count: count,
                        percent: (count / response.total * 100).toFixed(2)
                    };
                });
            }));

            // Year Summary
            counts.yearSummary = _.map(response.yearSummary, function (element, index) {
                return {
                    date: index + '-01-01',
                    name: index,
                    count: element,
                    percent: (element / response.total * 100).toFixed(2)
                };
            });

            // Check data for display
            dataTest = _.reduce(_.pluck(counts.periodSum, 'count'), function (sum, num) {
                return sum + num;
            });

            if (dataTest === 0) {
                dfd.reject({statusText: 'no data'});
            }

            // Sort period arrays by date
            counts.periodSum.sort(self.sortData);
            counts.periodAvg.sort(self.sortData);
            counts.yearSummary.sort(self.sortData);
            counts.monthSummary.sort(self.sortData);
            counts.dayOfWeekSummary.sort(self.sortDays);

            dfd.resolve(counts);

            return dfd.promise();
        },
        /**
         * Draw chart
         *
         * @param  {array} counts
         */
        drawChart: function (counts) {
            var avgState,
                locState,
                mainState;

            if (!this.mainChart) {
                this.mainChart = new TimeSeries();
            }

            if (!this.suppChart) {
                this.suppChart = new BarChart();
            }

            // Get states from DOM
            mainState = $(this.cfg.mainState)[0].value;
            locState = $(this.cfg.locState)[0].value;
            avgState = $(this.cfg.avgState)[0].value;

            this.updateMainChart(counts, mainState, locState, avgState);

        },
        /**
         * Update primary chart
         * @param  {array} counts
         * @param  {string} mainState
         * @param  {string} locState
         * @param  {string} avgState
         */
        updateMainChart: function (counts, mainState, locState, avgState) {
            var data;

            // Select Data Source
            if (mainState === 'sum') {
                data = counts.periodSum;
            } else {
                data = counts.periodAvg;
            }

            // Update Main Chairt
            $(this.cfg.chart1svg).remove();
            d3.select(this.cfg.chart1)
                .datum(data)
                .call(this.mainChart);

            // Update Supplemental Chart
            this.updateSuppChart(counts, mainState, locState, avgState);

            // Update metadata on UI
            this.buildChartMetadata();
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

            d3.select(this.cfg.chart2)
                .datum(data)
                .call(this.suppChart);
        },
        drawTable: function (counts) {
            this.buildTemplate(counts.total, this.cfg.tables.totalSumTmp, this.cfg.tables.totalSumTgt, true);
            this.buildTemplate(counts.locationsTable, this.cfg.tables.locSumTmp, this.cfg.tables.locSumTgt, true);
            this.buildTemplate(counts.activitiesTable, this.cfg.tables.actSumTmp, this.cfg.tables.actSumTgt, true);
            this.buildTemplate(counts.yearSummary, this.cfg.tables.yearTmp, this.cfg.tables.yearTgt, true);
            this.buildTemplate(counts.monthSummary, this.cfg.tables.monthTmp, this.cfg.tables.monthTgt, true);
            this.buildTemplate(counts.dayOfWeekSummary, this.cfg.tables.weekdayTmp, this.cfg.tables.weekdayTgt, true);
            this.buildTemplate(counts.hourlySummary, this.cfg.tables.hourTmp, this.cfg.tables.hourTgt, true);
        },
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
        addCSVIndent: function (item) {
            var indent = '';

            while (item.depth > 0) {
                item.depth -= 1;
                indent += '     '; // 5 spaces
            }

            return indent + item.name;
        },
        /**
         * Method to convert preformed CSV object to CSV download
         * @param  array csv
         * @return
         */
        buildCSV: function (counts) {
            var self = this,
                base,
                finalContent,
                formattedLines,
                header,
                href,
                lines,
                summaryHash;

            lines = [];
            header = ['Date', 'Total'];

            self.locHeader = null;
            self.actHeader = null;

            _.each(counts.csv, function (day) {
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
                _.each(locations, function (loc) {
                    line.push(loc.count);
                });

                // Convert activities to array and sort, add to line
                activities = self.sortCSVItems(day.activities);
                _.each(activities, function (act) {
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

            // Add indents as necessary
            _.each(counts.locationsTable, function (ele) {
                ele.name = self.addCSVIndent(ele);
            });

            _.each(counts.activitiesTable, function (ele) {
                ele.name = self.addCSVIndent(ele);
            });

            // Build hash of summary data
            summaryHash = {
                locations: counts.locationsTable,
                activities: counts.activitiesTable,
                hourly: counts.hourSummary,
                daily: counts.dayOfWeekSummary,
                monthly: counts.monthSummary,
                yearly: counts.yearSummary
            };

            // Add summary data to csv lines array
            _.each(summaryHash, function (e, i) {
                var sumHeader = [
                    i,
                    'count',
                    'percent'
                ];

                lines.push(sumHeader);

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

            $(self.cfg.csv).attr('href', href);
        },
        /**
         * Generic Method to add template to DOM
         * @param  array items
         * @param  string templateId
         * @param  string elementId
         */
        buildTemplate: function (items, templateId, targetId, empty) {
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
            if (empty) {
                $(targetId).empty();
            }

            $(targetId).append(template(json));
        },
        /**
         * Generic Error Handler
         * @param  {object} e system or custom error object
         */
        error: function (e) {
            this.toggleSubmit();
            $(this.cfg.welcome).hide();
            $(this.cfg.summaryData).hide();
            $(this.cfg.suppChart).hide();
            $(this.cfg.mainChart).css('visibility', 'hidden');

            // Log errors for debugging
            console.log('error object', e);

            // Insert template into DOM
            this.buildTemplate([{msg: Errors.getMsg(e.statusText)}], this.cfg.errorTemplate, this.cfg.errorTarget);
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(ReportFilters, Errors, TimeSeries, BarChart));