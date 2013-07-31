(function (Calendar) {
    var App = {
        cfg: {
            sdate:         '#sdate',
            edate:         '#edate',
            legend:        '#legend',
            welcome:       '#welcome',
            loading:       '#loading',
            errorTarget:   '#error-container',
            errorTemplate: '#error',
            chart:         '#chart',
            filter:        '#initiatives',
            filterOptions: {
                url:                '../../lib/php/reportFilters.php',
                triggerForm:        '#initiatives',
                filterForm:         '#secondary-filters',
                locationsTemplate:  '#locations-template',
                activitiesTemplate: '#activities-template',
                locationsSelect:    '#locations',
                activitiesSelect:   '#activities'
            }
        },
        filters: null,
        init: function () {
            // Insert default dates
            this.insertDefaultDates();

            // Insert filter select boxes
            this.insertFilters();

            // Set initiative filter to default (for back button)
            $(this.cfg.filter).val('default');

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
            $(this.cfg.sdate).val(then);
            $(this.cfg.edate).val(now);
        },
        /**
         * Initializes and inserts secondary filters
         */
        insertFilters: function () {
            if (this.filters === null) {
                this.filters = new ReportFilters(this.cfg.filterOptions);
            }

            this.filters.init();
        },
        bindEvents: function () {
            var self = this;

            // Initialize datepicker
            $(self.cfg.sdate).datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});
            $(self.cfg.edate).datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});

            // Get chart data on submit
            $('body').on('submit', 'form', function (e) {
                var input = $(this).serializeArray();

                $.when(self.getData(input))
                    .then(self.processData.bind(self))
                    .then(self.drawChart.bind(self), self.error.bind(self));

                e.preventDefault();
            });
        },
        getData: function (input) {
            var self = this;

            return $.ajax({
                url: 'results.php',
                data: input,
                beforeSend: function () {
                    $(self.cfg.loading).show();
                    $(self.cfg.legend).hide();
                    $(self.cfg.welcome).hide();
                    $(self.cfg.errorTarget).empty();
                    $('svg').remove();
                },
                success: function () {
                    $(self.cfg.legend).show();
                },
                complete: function () {
                    $(self.cfg.loading).hide();
                },
                timeout: 180000 // 3 mins
            });
        },
        error: function (e) {
            var msg;

            $(this.cfg.legend).hide();

            if (e.statusText === 'timeout') {
                msg = 'The server was taking too long to respond. Please narrow your results and try again.';
            } else if (e.statusText === 'Not Found') {
                msg = 'The requested data URL was not found.';
            } else {
                msg = e.statusText;
            }

            this.buildTemplate([{msg: msg}], this.errorTemplate, this.errorTarget);
        },
        sortData: function (response) {
            return _.sortBy(
                _.map(response, function (count, date) {
                    return {
                        date: date,
                        count: count.count
                    };
                }),
                function (obj) {
                    return obj.date;
                }
            );
        },
        processData: function (response) {
            var dfd = $.Deferred();

            // Does response have enough values to draw meaningful graph?
            if (Object.keys(response.periodSum).length < 1) {
                dfd.reject({statusText: 'Not enough data found to show graph.'});
            }

            dfd.resolve(this.sortData(response.periodSum));

            return dfd.promise();
        },
        drawChart: function (counts) {
            var chart,
                self = this;

            chart = Calendar();

            d3.select(self.cfg.chart)
                .datum(counts)
                .call(chart);
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

            // Populate template with data and insert into DOM
            $(elementId).prepend(template(json));
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(Calendar));
