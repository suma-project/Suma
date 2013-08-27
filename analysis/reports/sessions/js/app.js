(function () {
    var App = {
        cfg: {
            errorTarget:   '#error-container',
            errorTemplate: '#error',
            tableTarget:   '#sessions-data',
            tableTemplate: '#sessions-table',
            welcome:       '#welcome'
        },
        init: function () {
            this.addSpinner();
            this.insertDefaultDates();
            this.bindEvents();
        },
        addSpinner: function () {
            var opts,
                spinner,
                target;

            opts = {
                lines: 11, // The number of lines to draw
                length: 15, // The length of each line
                width: 6, // The line thickness
                radius: 12, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#fff', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };

            target = $('#loadingWidget');
            spinner = new Spinner(opts).spin(target[0]);
            $('#loadingWidget').hide();
        },
        bindEvents: function () {
            var self = this;

             // Initialize datepicker
            $('#sdate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});
            $('#edate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});

            // Help text on filters
            $('.suma-popover').popover({
                trigger: 'hover', 
                delay: 300,
                placement: 'bottom'
            });

            // Form submission
            $('body').on('submit', '#chartFilters', function (e) {
                var data,
                    input;

                input = $(this).serializeArray();

                data = $.when(self.getData(input))
                                .then(self.processData);

                data.done(function (data) {
                    self.buildTemplate(data, self.cfg.tableTemplate, self.cfg.tableTarget, true);
                });

                data.fail(function (e) {
                    self.error(e);
                });

                e.preventDefault();
            });
        },
        insertDefaultDates: function () {
            // Create dates for default date display
            var now = moment().format('YYYY-MM-DD'),
                then = moment().subtract('months', 6).format('YYYY-MM-DD');

            // Insert default dates into DOM
            $('#sdate').val(then);
            $('#edate').val(now);
        },
        getData: function (input) {
            return $.ajax({
                url: 'results.php',
                data: input,
                dataType: 'json',
                beforeSend: function () {
                    $('#loadingWidget').fadeIn(200);
                    $('#sessions-data').hide();
                    $('.alert').hide();
                },
                complete: function () {
                    $('#loadingWidget').fadeOut(400);
                    $('#sessions-data').show();
                },
                timeout: 30000
            });
        },
        processData: function (data) {
            var dfd = $.Deferred(),
                sortedData;

            if (data.length < 1) {
                dfd.reject({statusText: 'no data'});
            }

            sortedData = _.sortBy(data, function (obj) {
                return obj.start;
            });

            dfd.resolve(sortedData.reverse());

            return dfd.promise();
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

            $(targetId).append(template(json));
        },
        error: function (e) {
            $(this.cfg.welcome).hide();

            // Log errors for debugging
            console.log('error object', e);

            this.buildTemplate([{msg: Errors.getMsg(e.statusText)}], this.cfg.errorTemplate, this.cfg.errorTarget);
        }
    };
    App.init();
}());