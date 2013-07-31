var Errors = {
    codes: {
        'timeout': 'The server was taking too long to respond. Try narrowing your search.',
        'not found': 'The data URL was not found.',
        'no data': 'Not enough data found to display a report. Try expanding your search.'
    },
    getMsg: function (code) {
        if (this.codes[code]) {
            return this.codes[code];
        }

        return "Unkown Error.";
    }
};
