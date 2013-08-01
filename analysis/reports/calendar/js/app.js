(function (ReportFilters, Errors, Calendar) {
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

            // Set initiative filter to default (for back button)
            $(this.cfg.filter).val('default');

            // Insert filter select boxes
            this.insertFilters();

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
            var filters,
                self = this;

            if (this.filters === null) {
                this.filters = new ReportFilters(this.cfg.filterOptions);
            }

            filters = this.filters.init();

            filters.fail(function (e) {
                self.error(e);
            });
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

            // Initialize help popovers
            $('.suma-popover').popover({placement: 'bottom'});
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
            $(this.cfg.legend).hide();
            $(this.cfg.welcome).hide();

            // Log errors for debugging
            console.log('error object', e);

            this.buildTemplate([{msg: Errors.getMsg(e.statusText)}], this.cfg.errorTemplate, this.cfg.errorTarget);
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
                dfd.reject({statusText: 'no data'});
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
        buildTemplate: function (items, templateId, targetId, empty) {
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
            if (empty) {
                $(targetId).empty();
            }
            $(targetId).prepend(template(json));
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(ReportFilters, Errors, Calendar));
