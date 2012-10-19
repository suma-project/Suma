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
        filters: undefined,
        mainChart: undefined,
        suppChart: undefined,
        updateListeners: undefined,
        counts: undefined,
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
            if (this.filters === undefined) {
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

            // Event handler to initialize AJAX call
            $('body').on('submit', '#chartFilters', function (e) {
                var input = $(this).serializeArray();

                $.when(self.getData(input))
                    .then(function (data) {
                        var counts = self.processData(data);

                        if (counts) {
                            self.drawChart(counts);
                            self.counts = counts;
                            self.drawTable(counts);
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

                self.updateSuppChart(self.counts, mainState, locState, avgState);
            });
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
                    $('#supplemental-charts').hide();
                    $('#main-chart-header').css('visibility', 'hidden');
                },
                success: function () {
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
        /**
         * Display error message
         */
        noData: function () {
            $('#no-data').show();
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

            if (!response.locationsSum) {
                return false;
            }

            console.log('from app.js', response);
            // Convert response into arrays of objects
            counts = {};

            // Get location/activity data from filters object
            locations = this.filters.locations;
            activities = this.filters.activities;

            // Total Sum
            counts.total = [{
                total : response.total
            }];

            // Locations Sum
            counts.locationsSum = [];
            _.each(response.locationsSum, function (element, index) {
                var locDict,
                    newObj;

                locDict = _.filter(locations, function (parent) {
                    //console.log('test', element, index, parent)
                    return parent.id === parseInt(index, 10);
                });
                //console.log('locations', locations)
                newObj = {
                    id    : index,
                    name  : locDict[0].title,
                    depth : locDict[0].depth,
                    rank  : locDict[0].rank,
                    parent: locDict[0].parent,
                    count : element,
                    percent: (element / response.total * 100).toFixed(2)
                };
                counts.locationsSum.push(newObj);
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
                    count : element
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
                    count : element
                };
                counts.locationsAvgAvg.push(newObj);
            });

            // Activities Sum
            counts.activitiesSum = [];
            _.each(response.activitiesSum, function (element, index) {
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
                        count : element,
                        percent: (element / response.total * 100).toFixed(2)
                    };
                } else {
                    newObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : undefined,
                        rank  : undefined,
                        activityGroup: undefined,
                        count : element,
                        percent: (element / response.totall * 100).toFixed(2)
                    };
                }

                counts.activitiesSum.push(newObj);
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
                        count : element
                    };
                } else {
                    newObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : undefined,
                        rank  : undefined,
                        activityGroup: undefined,
                        count : element
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
                        count : element
                    };
                } else {
                    newObj = {
                        id    : index,
                        name  : 'No Activity',
                        depth : undefined,
                        rank  : undefined,
                        activityGroup: undefined,
                        count : element
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

            // Day of Week Summary
            counts.dayOfWeekSummary = [];
            _.each(response.dayOfWeekSummary, function (element, index) {
                var newObj = {
                    day: index,
                    count: element
                };

                counts.dayOfWeekSummary.push(newObj);
            });

            // Month Summary
            counts.monthSummary = [];
            _.each(response.monthSummary, function (element, index) {
                var newObj = {
                    day: index,
                    count: element
                };

                counts.monthSummary.push(newObj);
            });

            // Year Summary
            counts.yearSummary = [];
            _.each(response.yearSummary, function (element, index) {
                var newObj = {
                    year: index,
                    count: element
                };

                counts.yearSummary.push(newObj);
            });

            // Check if counts is large enough to display meaningfully
            testLength = _.unique(_.pluck(_.values(counts.periodSum), 'count'));

            if (testLength.length === 1) {
                return false;
            }

            // Sort period arrays by date
            counts.periodSum.sort(self.sortData);
            counts.periodAvg.sort(self.sortData);

            //console.log('counts', counts);
            return counts;
        },
        /**
         * Draw chart
         *
         * @param  {array} counts
         */
        drawChart: function (counts) {
            var self = this,
                mainState,
                locState,
                avgState;

            if (!this.mainChart) {
                this.mainChart = new TimeSeries();
            }

            if (!this.suppChart) {
                this.suppChart = new BarChart();
            }

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
            $('#chart > svg').remove();
            d3.select("#chart")
                .datum(data)
                .call(this.mainChart);

            // Update Supplemental Chart
            self.updateSuppChart(counts, mainState, locState, avgState);
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
                locSum,
                locAvg,
                actSum,
                actAvg;

            locSum = counts.locationsSum;
            actSum = counts.activitiesSum;

            if (mainState === 'sum') {
                locAvg = counts.locationsAvgSum;
                actAvg = counts.activitiesAvgSum;
            } else {
                locAvg = counts.locationsAvgAvg;
                actAvg = counts.activitiesAvgAvg;
            }

            if ((locState === 'locations') && (avgState === 'sum')) {
                data = locSum;
            } else if ((locState === 'locations') && (avgState === 'avg')) {
                data = locAvg;
            } else if ((locState === 'activities') && (avgState === 'sum')) {
                data = actSum;
            } else if ((locState === 'activities') && (avgState === 'avg')) {
                data = actAvg;
            }

            d3.select("#chart2")
                .datum(data)
                .call(this.suppChart);
        },
        drawTable: function (counts) {
            //console.log('testing', counts);

            this.buildTemplate(counts.total, '#total-sum-table', '#total-data');
            this.buildTemplate(counts.locationsSum, '#locations-sum-table', '#locations-data');
            this.buildTemplate(counts.activitiesSum, '#activities-sum-table', '#activities-data');
        },
        buildTemplate: function (items, templateId, elementId) {
            var html,
                json,
                template;

            // Insert list into object for template iteration
            json = {items: items};

            // Retrieve template from index.php (in script tag)
            html = $(templateId).html();

            // Compile template
            template = Handlebars.compile(html);

            // Template helper to convert depth to emdash
            // Handlebars.registerHelper('indent', function (depth) {
            //     var indent = '';
            //     while (depth > 0) {
            //         depth -= 1;
            //         indent += '&mdash;';
            //     }
            //     return indent;
            // });

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