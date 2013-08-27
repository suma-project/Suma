(function (ReportFilters, Errors, HourlyCalendar, HourlyLine) {
    var App = {
        cfg: {
            avgSum:        '#avg-sum',
            buttons:       '#controls',
            calendarDownload: '#calendar-download',
            chart2:        '#chart2',
            chart:         '#chart',
            csv:           '#csv',
            edate:         '#edate',
            errorTarget:   '#error-container',
            errorTemplate: '#error',
            filter:        '#initiatives',
            legend:        '#legend',
            lineDownload:  '#line-download',
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
        dict: {
            weekdays: {
                1: 'Sunday',
                2: 'Monday',
                3: 'Tuesday',
                4: 'Wednesday',
                5: 'Thursday',
                6: 'Friday',
                7: 'Saturday'
            },
            hours: {
                1: '12:00 AM',
                2: '1:00 AM',
                3: '2:00 AM',
                4: '3:00 AM',
                5: '4:00 AM',
                6: '5:00 AM',
                7: '6:00 AM',
                8: '7:00 AM',
                9: '8:00 AM',
                10: '9:00 AM',
                11: '10:00 AM',
                12: '11:00 AM',
                13: '12:00 PM',
                14: '1:00 PM',
                15: '2:00 PM',
                16: '3:00 PM',
                17: '4:00 PM',
                18: '5:00 PM',
                19: '6:00 PM',
                20: '7:00 PM',
                21: '8:00 PM',
                22: '9:00 PM',
                23: '10:00 PM',
                24: '11:00 PM'
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
                var input,
                    processData;

                input = $(this).serializeArray();

                processData = $.when(self.getData(input))
                                    .then(_.bind(self.processData, self));

                processData.done(function (data) {
                    self.drawChart(data);
                });

                processData.done(function (data) {
                    self.buildCSV(data);
                });

                processData.fail(function (e) {
                    self.error(e);
                });

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

            // Chart Download
            $(self.cfg.lineDownload).on('click', function () {
                var linkId = '#' + this.id,
                    chartId = '#' + $(this).attr('data-chart-div');

                self.downloadPNG(linkId, chartId);
            });

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
                    $(self.cfg.legend).hide();
                    $(self.cfg.buttons).hide();
                    $(self.cfg.welcome).hide();
                    $(self.cfg.errorTarget).empty();
                    $('svg').remove();
                },
                success: function () {
                    $(self.cfg.legend).show();
                    $(self.cfg.buttons).show();
                },
                complete: function () {
                    self.toggleSubmit();
                    $(self.cfg.loading).hide();
                },
                timeout: 180000 // 3 mins
            });
        },
        getState: function () {
            return $('#avg-sum').find('label.active').data('state');
        },
        error: function (e) {
            $(this.cfg.legend).hide();
            $(this.cfg.buttons).hide();
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
            var dfd = $.Deferred(),
                data = {};

            data.sum = _.flatten(_.map(response.dailyHourSummary, function (day, d) {
                return _.map(day, function (hour, h) {
                    return {
                        day: d + 1,
                        hour: h + 1,
                        value: hour.sum
                    };
                });
            }));

            // Does response have enough values to draw meaningful graph?
            if (_.compact(_.pluck(data.sum, 'value')) < 1) {
                dfd.reject({statusText: 'no data'});
            }

            data.avg = _.flatten(_.map(response.dailyHourSummary, function (day, d) {
                return _.map(day, function (hour, h) {
                    return {
                        day: d + 1,
                        hour: h + 1,
                        value: hour.avg
                    };
                });
            }));

            this.data = data;

            dfd.resolve(data);

            return dfd.promise();
        },
        drawChart: function (counts, state) {
            var data,
                self = this;

            if (state) {
                data = counts[state];
            } else {
                state = this.getState();
                data = counts[state];
            }

            if (!this.calendar) {
                this.calendar = HourlyCalendar();
            }

            if (!this.line) {
                this.line = HourlyLine();
            }

            d3.select(self.cfg.chart)
                .datum(data)
                .call(this.calendar);

            d3.select(self.cfg.chart2)
                .datum(data)
                .call(this.line);
        },
        buildCSVString: function (counts, dict) {
            return d3.csv.format(_.map(counts, function (o) {
                var count;

                if (o.value === undefined || o.value === null) {
                    count = 'No Data Found';
                } else {
                    count = o.value;
                }

                return {
                    Day: dict.weekdays[o.day],
                    Hour: dict.hours[o.hour],
                    Count: count
                };
            }));
        },
        buildCSV: function (counts) {
            var data = {},
                finalData = '',
                base,
                href,
                lines,
                space = '\n\n\n\n';

            data.Averages = this.buildCSVString(counts.avg, this.dict);
            data.Sums = this.buildCSVString(counts.sum, this.dict);

            _.each(data, function (str, name) {
                finalData += (name + '\n');
                finalData += str;
                finalData += space;
            });

            // Build download URL
            base = 'data:application/csv;charset=utf-8,';
            href = encodeURI(base + _.unescape(finalData));

            $(this.cfg.csv).attr('href', href);
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
}(ReportFilters, Errors, HourlyCalendar, HourlyLine));
