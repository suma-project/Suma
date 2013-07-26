(function (Calendar) {
    var App = {
        // Initializes application
        init: function () {
            this.bindEvents();

            // Handle the display of loading.gif
            $(document).ajaxStart(function () {
                $('#loading').show();
                $("#legend").hide();
                $('svg').remove();

            }).ajaxStop(function () {
                $('#loading').hide();
                $('#legend').show();
            });
        },
        bindEvents: function () {
            var self = this;

            $('body').on('submit', 'form', function (e) {
                var input = $(this).serializeArray();
                self.getData(input);
                e.preventDefault();
            });
        },
        // AJAX call to query server, accepts form input as parameter
        getData: function (input) {
            var self = this;

            $.ajax({
                url: 'results.php',
                data: input,
                success: self.processData.bind(self),
                error: self.error,
                dataType: 'json'
            });
        },
        // Sort data according to date
        sortData: function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        },
        // No data
        noData: function () {
            alert('no data found');
        },
        // Process and prepare data for display, accepts response from getData
        processData: function (response) {
            var first,
                last,
                count,
                counts = [],
                self = this;

            // Does response have enough vlues to draw meaningful graph?
            if (Object.keys(response).length < 2) {
                self.noData();
            } else {
                for (count in response) {
                    if (response.hasOwnProperty(count)) {
                        // Create array that can be used by d3.js
                        counts.push({
                            date: count,
                            count: response[count]
                        });
                    }
                }

                counts.sort(self.sortData);
                var chart = Calendar();

                d3.select('#chart')
                    .datum(counts)
                    .call(chart);
            }
        }
    };

    // Start app on document ready
    $(document).ready(function () {
        App.init();
    });
}(Calendar));
