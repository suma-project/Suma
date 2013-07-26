(function (Calendar) {
    var App = {
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            var self = this;

            $('body').on('submit', 'form', function (e) {
                var input = $(this).serializeArray();

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
        // Sort data according to date
        sortData: function (a, b) {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        },
        processData: function (response) {
            var dfd = $.Deferred(),
                count,
                counts = [],
                self = this;

            // Does response have enough vlues to draw meaningful graph?
            if (Object.keys(response).length < 2) {
                dfd.reject('Not enough data.')
            }

            for (count in response) {
                if (response.hasOwnProperty(count)) {
                    counts.push({
                        date: count,
                        count: response[count]
                    });
                }
            }

            counts.sort(self.sortData);
            dfd.resolve(counts);

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
