(function (ReportFilters, Errors, Calendar) {
    var App = {
        cfg: {
            avgSum:        '#avg-sum',
            buttons:       '#controls',
            calendarDownload: '#calendar-download',
            chart:         '#chart',
            edate:         '#edate',
            errorTarget:   '#error-container',
            errorTemplate: '#error',
            filter:        '#initiatives',
            summary:       '#summary',
            loading:       '#loading',
            popover:       '.suma-popover',
            sdate:         '#sdate',
            state:         '#avg-sum > .active',
            submit:        '#submit',
            welcome:       '#welcome',
            filterOptions: {
                activitiesSelect:   '#activities',
                activitiesTemplate: '#activities-template',
                filterForm:         '.secondary-filters',
                locationsSelect:    '#locations',
                locationsTemplate:  '#locations-template',
                triggerForm:        '#initiatives',
                url:                '../../lib/php/reportFilters.php'
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
                    .then(_.bind(self.processData, self))
                    .then(_.bind(self.drawChart, self), _.bind(self.error, self));

                e.preventDefault();
            });

            // Toggle between sum and avg
            $(self.cfg.avgSum).on('click', function (e) {
                var state = e.target.htmlFor;

                self.drawChart(self.data, state);
            });

            // Initialize help popovers
            $(self.cfg.popover).popover({
                trigger: 'hover',
                delay: 300,
                placement: 'bottom'});

            // Chart download
            $(self.cfg.calendarDownload).on('click', function () {
                var linkId = '#' + this.id,
                    chartId = '#' + $(this).attr('data-chart-div');

                self.downloadPNG(linkId, chartId);
            });
        },
        downloadPNG: function (linkId, chartId) {
            var canvas,
                img,
                svg;

            // Get svg markup from chart
            svg = $.trim($(chartId).html());

            // Insert invisible canvas
            $('body').append('<canvas id="canvas" style="display:none"></canvas>');

            // Insert chart into invisible canvas
            canvg(document.getElementById('canvas'), svg);

            // Retrieve contents of invisible canvas
            canvas = document.getElementById('canvas');

            // Convert canvas to data
            img = canvas.toDataURL('image/png');

            // Update href to use data:image
            $(linkId).attr('href', img);

            // Remove Canvas
            $('#canvas').remove();
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
        getData: function (input) {
            var self = this;

            return $.ajax({
                url: 'results.php',
                data: input,
                beforeSend: function () {
                    self.toggleSubmit(true);
                    $(self.cfg.loading).show();
                    $(self.cfg.buttons).hide();
                    $(self.cfg.summary).hide();
                    $(self.cfg.welcome).hide();
                    $(self.cfg.errorTarget).empty();
                    $('svg').remove();
                },
                success: function () {
                    $(self.cfg.buttons).show();
                    $(self.cfg.summary).show();
                },
                complete: function () {
                    self.toggleSubmit();
                    $(self.cfg.loading).hide();
                },
                timeout: 180000 // 3 mins
            });
        },
        error: function (e) {
            $(this.cfg.buttons).hide();
            $(this.cfg.welcome).hide();
            $(this.cfg.summary).hide();

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
            var dfd = $.Deferred(),
                data = {};

            // Does response have enough values to draw meaningful graph?
            if (!response.periodSum) {
                return dfd.reject({statusText: 'no data'});
            }

            if (Object.keys(response.periodSum).length < 1) {
                return dfd.reject({statusText: 'no data'});
            }

            data.sum = this.sortData(response.periodSum);

            data.avg = this.sortData(response.periodAvg);

            this.data = data;

            dfd.resolve(data);

            return dfd.promise();
        },
        getState: function () {
            return $('#avg-sum').find('label.active').data('state');
        },
        drawChart: function (counts, state) {
            var data;

            if (state) {
                data = counts[state];
            } else {
                state = this.getState();
                data = counts[state];
            }

            if (!this.calendar) {
                this.calendar = Calendar();
            }

            d3.select(this.cfg.chart)
                .datum(data)
                .call(this.calendar);
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
