/**
 * Central application for chart display.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 *
 * @property {object} filters Instantiated filter module
 * @property {object} chart Instantiated time series chart
 */
(function (ReportFilters, TimeSeries) {
    var App = {
        filters: undefined,
        chart: undefined,
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
                        } else {
                            self.noData();
                        }
                    }, function (e) {
                        $('#ajax-error').show();
                    });

                e.preventDefault();
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
        },
        /**
         * Process response from AJAX call
         * 
         * @param  {object} response
         * @return {array}
         */
        processData: function (response) {
            var self = this,
                counts = [],
                testLength;

            _.each(response, function (element, index) {
                var newObj = {
                    date: index,
                    count: element.dayCount.toFixed(2)
                };

                // Create array for d3.js
                counts.push(newObj);
            });

            // Check if counts is large enough to display meaningfully
            testLength = _.unique(_.pluck(_.values(counts), 'count'));

            if (testLength.length === 1) {
                return false;
            }

            // Sort by date
            counts.sort(self.sortData);

            return counts;
        },
        /**
         * Draw chart
         * 
         * @param  {array} counts
         */
        drawChart: function (counts) {
            if (!this.chart) {
                this.chart = new TimeSeries();
            }

            d3.select("#chart")
                .datum(counts)
                .call(this.chart);
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(ReportFilters, TimeSeries));