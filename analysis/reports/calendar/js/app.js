(function (Calendar) {
    var App = {
        filters: null,
        init: function () {
            // Insert default dates
            this.insertDefaultDates();

            // Insert filter select boxes
            this.insertFilters();

            // Set initiative filter to default (for back button)
            $('#initiatives').val('default');

            // Bind Events
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
        bindEvents: function () {
            var self = this;

            // Initialize datepicker
            $('#sdate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});
            $('#edate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});

            // Get chart data on submit
            $('body').on('submit', 'form', function (e) {
                var input = $(this).serializeArray();
                console.log('input', input)
                $.when(self.getData(input))
                    .then(self.processData.bind(self))
                    .then(self.drawChart, self.error);

                e.preventDefault();
            });
        },
        getData: function (input) {
            var self = this;

            return $.ajax({
                url: 'results.php',
                data: input,
                beforeSend: function () {
                    $('#loading').show();
                    $("#legend").hide();
                    $('#welcome').hide();
                    $('svg').remove();
                },
                success: function () {
                    $("#legend").show();
                },
                complete: function () {
                    $('#loading').hide();
                }
            });
        },
        error: function (e) {
            $("#legend").hide();
            console.log("error: ", e);
        },
        sortData: function (response) {
            return _.sortBy(
                _.map(response, function (count, date) {
                    return {
                        date: date,
                        count: count
                    };
                }),
                function (obj) {
                    return obj.date;
                }
            );
        },
        processData: function (response) {
            var dfd = $.Deferred();

            // Does response have enough vlues to draw meaningful graph?
            if (Object.keys(response).length < 2) {
                dfd.reject('Not enough data.');
            }

            dfd.resolve(this.sortData(response));

            return dfd.promise();
        },
        drawChart: function (counts) {
            var chart;
            chart = Calendar();

            d3.select('#chart')
                .datum(counts)
                .call(chart);
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(Calendar));
