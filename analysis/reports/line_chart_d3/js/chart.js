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
                    $('#loading').show();
                },
                complete: function () {
                    $('#loading').hide();
                }
            });
        },

        // Sort data according to date
        sortData: function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        },

        sumData: function (counts) {
            var sum = d3.sum(_.pluck(counts, 'count'));
            $('#sum').text(Math.floor(sum));
        },

        avgData: function (counts) {
            var avg = d3.sum(_.pluck(counts, 'count')) / counts.length;
            $('#avg').text(Math.floor(avg));
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

            // Sort by date
            counts.sort(Chart.sortData);

            Chart.sumData(counts);
            Chart.avgData(counts);
            Chart.drawChart(counts);
        },

        drawChart: function (counts) {
            var chart = timeSeries();

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
