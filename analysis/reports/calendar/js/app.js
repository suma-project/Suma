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
        sortData: function (response) {
            return _.sortBy(
                _.map(response, function (count, date) {
                    return {
                        date: date,
                        count: count
                    };
                }),
                function (obj) {
                    return obj.date;
                }
            );
        },
        processData: function (response) {
            var dfd = $.Deferred();

            // Does response have enough vlues to draw meaningful graph?
            if (Object.keys(response).length < 2) {
                dfd.reject('Not enough data.');
            }

            dfd.resolve(this.sortData(response));

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
