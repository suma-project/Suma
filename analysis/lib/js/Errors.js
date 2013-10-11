(function (window) {
    var Errors = {
        codes: {
            'timeout': 'The server was taking too long to respond. Try narrowing your search.',
            'not found': 'The data URL was not found.',
            'Not Found': 'The data URL was not found.',
            'no data': 'Not enough data found to display a report. Try expanding your search.',
            'not enough data': 'Not enough data was found to display a time series. However, summary data is shown below.',
            'filter error': 'There was a problem retrieving filters for that initiative.'
        },
        getMsg: function (code) {
            if (this.codes[code]) {
                return this.codes[code];
            }

            return 'Unkown Error: ' + code;
        }
    };

    window.Errors = Errors;
}(window));
