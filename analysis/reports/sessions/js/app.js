(function () {
    var App = {
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
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
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
            $('.suma-popover').popover();

            // Form submission
            $('body').on('submit', '#chartFilters', function (e) {
                var input = $(this).serializeArray();

                $.when(self.getData(input))
                    .then(function (data) {
                        if (data.length > 0) {
                            self.processData(data);
                        } else {
                            self.noData();
                        }
                    }, function (e) {
                        self.ajaxError();
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
        ajaxError: function () {
            $('#ajax-error').show();
            $('#sessions-data').hide();
        },
        noData: function () {
            $('#no-data').show();
            $('#sessions-data').hide();
        },
        getData: function (input) {
            return $.ajax({
                url: 'results.php',
                data: input,
                dataType: 'json',
                beforeSend: function () {
                    $('#loadingWidget').show();
                    $('#sessions-data').hide();
                    $('.alert').hide();
                },
                success: function () {
                    $('#sessions-data').show();
                },
                complete: function () {
                    $('#loadingWidget').hide();
                }
            });
        },
        processData: function (data) {
            this.buildTemplate(data.reverse(), '#sessions-table', '#sessions-data');
        },
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

            // Populate template with data and insert into DOM
            $(elementId).empty();
            $(elementId).append(template(json));
        }
    };
    App.init();
}());