(function () {
    var Chart = {
        // Initializes application
        init: function () {

            // Create dates for default date display
            var now = moment().format('YYYY-MM-DD'),
                then = moment().subtract('months', 6).format('YYYY-MM-DD');

            // Insert default dates into DOM
            $('#sdate').val(then);
            $('#edate').val(now);

            // Initialize datepicker
            $('#sdate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});
            $('#edate').datepicker({'format': 'yyyy-mm-dd', 'autoclose': 'true'});

            // Event handler to initiate application
            $('body').on('submit', '#chartFilters', function (e) {
                var input = $(this).serializeArray();

                $.when(Chart.getData(input)).then(function (data) {
                    Chart.processData(data);
                });

                e.preventDefault();
            });
        },

        // AJAX call to query server, accepts form input as parameter
        getData: function (input) {
            return $.ajax({
                url: 'results.php',
                data: input,
                dataType: 'json',
                beforeSend: function () {
                    $('svg').remove();
                    $('.alert').hide();
                    $('#loading').show();
                    var text = $('#submit').data('loading-text');
                    $('#submit').addClass('disabled').val(text);
                    $('#submit').attr('disabled', 'true');
                },
                complete: function () {
                    var text = $('#submit').data('default-text');
                    $('#submit').removeClass('disabled').val(text);
                    $('#loading').hide();
                    $('#submit').removeAttr('disabled');
                }
            });
        },

        // Sort data according to date
        sortData: function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        },

        showError: function () {
            $('.alert-error').show();
            $('#submit').removeAttr('disabled');
        },

        // Process and prepare data for display, accepts response from getData
        processData: function (response) {
            var counts = [];

            _.each(response, function (element, index) {
                var newObj = {
                    date: index,
                    count: element.dayCount.toFixed(2)
                };

                // Create array for d3.js
                counts.push(newObj);
            });

            var test = _.unique(_.pluck(_.values(counts), 'count'));
            if(test.length === 1) {
                Chart.showError();
                return;
            }
            // Sort by date
            counts.sort(Chart.sortData);

            Chart.drawChart(counts);
        },

        drawChart: function (counts) {
            var chart = new timeSeries();

            d3.select("#chart")
                .datum(counts)
                .call(chart);
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        Chart.init();
    });
}());
