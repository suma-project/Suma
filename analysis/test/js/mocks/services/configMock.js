'use strict';

angular.module('configMock', [])
  .value('cfgMock', {
    '/timeseries': {
      'formData': {
        'countOptions': [{
          'id': 'count',
          'title': 'Count Date'
        }, {
          'id': 'start',
          'title': 'Session Start'
        }, {
          'id': 'end',
          'title': 'Session End'
        }],
        'dayOptions': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        'sessionOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'zeroOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'startHourOptions': [{
          'id': '0000',
          'title': '12:00 AM'
        }, {
          'id': '0100',
          'title': '01:00 AM'
        }, {
          'id': '0200',
          'title': '02:00 AM'
        }, {
          'id': '0300',
          'title': '03:00 AM'
        }, {
          'id': '0400',
          'title': '04:00 AM'
        }, {
          'id': '0500',
          'title': '05:00 AM'
        }, {
          'id': '0600',
          'title': '06:00 AM'
        }, {
          'id': '0700',
          'title': '07:00 AM'
        }, {
          'id': '0800',
          'title': '08:00 AM'
        }, {
          'id': '0900',
          'title': '09:00 AM'
        }, {
          'id': '1000',
          'title': '10:00 AM'
        }, {
          'id': '1100',
          'title': '11:00 AM'
        }, {
          'id': '1200',
          'title': '12:00 PM'
        }, {
          'id': '1300',
          'title': '01:00 PM'
        }, {
          'id': '1400',
          'title': '02:00 PM'
        }, {
          'id': '1500',
          'title': '03:00 PM'
        }, {
          'id': '1600',
          'title': '04:00 PM'
        }, {
          'id': '1700',
          'title': '05:00 PM'
        }, {
          'id': '1800',
          'title': '06:00 PM'
        }, {
          'id': '1900',
          'title': '07:00 PM'
        }, {
          'id': '2000',
          'title': '08:00 PM'
        }, {
          'id': '2100',
          'title': '09:00 PM'
        }, {
          'id': '2200',
          'title': '10:00 PM'
        }, {
          'id': '2300',
          'title': '11:00 PM'
        }],
        'startDate': [moment().subtract(4, 'months').format('YYYY-MM-DD')],
        'endDate': [moment().format('YYYY-MM-DD')],
        'startTime': [''],
        'endTime': ['']
      },
      'formDefaults': {
        'classifyCounts': 'countOptions',
        'wholeSession': 'sessionOptions',
        'zeroCounts': 'zeroOptions',
        'startHour': 'startHourOptions',
        'sdate': 'startDate',
        'edate': 'endDate',
        'stime': 'startTime',
        'etime': 'endTime'
      },
      'formFields': {
        'sdate': true,
        'edate': true,
        'stime': true,
        'etime': true,
        'startHour': true,
        'classifyCounts': true,
        'days': true,
        'wholeSession': true,
        'zeroCounts': true,
        'activities': true,
        'locations': true
      },
      'dataSource': 'getData',
      'dataProcessor': 'processTimeSeriesData',
      'suppWatch': true
    },
    '/calendar': {
      'formData': {
        'countOptions': [{
          'id': 'count',
          'title': 'Count Date'
        }, {
          'id': 'start',
          'title': 'Session Start'
        }, {
          'id': 'end',
          'title': 'Session End'
        }],
        'dayOptions': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        'sessionOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'zeroOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'startHourOptions': [{
          'id': '0000',
          'title': '12:00 AM'
        }, {
          'id': '0100',
          'title': '01:00 AM'
        }, {
          'id': '0200',
          'title': '02:00 AM'
        }, {
          'id': '0300',
          'title': '03:00 AM'
        }, {
          'id': '0400',
          'title': '04:00 AM'
        }, {
          'id': '0500',
          'title': '05:00 AM'
        }, {
          'id': '0600',
          'title': '06:00 AM'
        }, {
          'id': '0700',
          'title': '07:00 AM'
        }, {
          'id': '0800',
          'title': '08:00 AM'
        }, {
          'id': '0900',
          'title': '09:00 AM'
        }, {
          'id': '1000',
          'title': '10:00 AM'
        }, {
          'id': '1100',
          'title': '11:00 AM'
        }, {
          'id': '1200',
          'title': '12:00 PM'
        }, {
          'id': '1300',
          'title': '01:00 PM'
        }, {
          'id': '1400',
          'title': '02:00 PM'
        }, {
          'id': '1500',
          'title': '03:00 PM'
        }, {
          'id': '1600',
          'title': '04:00 PM'
        }, {
          'id': '1700',
          'title': '05:00 PM'
        }, {
          'id': '1800',
          'title': '06:00 PM'
        }, {
          'id': '1900',
          'title': '07:00 PM'
        }, {
          'id': '2000',
          'title': '08:00 PM'
        }, {
          'id': '2100',
          'title': '09:00 PM'
        }, {
          'id': '2200',
          'title': '10:00 PM'
        }, {
          'id': '2300',
          'title': '11:00 PM'
        }],
        'startDate': [moment().subtract(4, 'months').format('YYYY-MM-DD')],
        'endDate': [moment().format('YYYY-MM-DD')],
        'startTime': [''],
        'endTime': ['']
      },
      'formDefaults': {
        'classifyCounts': 'countOptions',
        'wholeSession': 'sessionOptions',
        'zeroCounts': 'zeroOptions',
        'startHour': 'startHourOptions',
        'sdate': 'startDate',
        'edate': 'endDate',
        'stime': 'startTime',
        'etime': 'endTime'
      },
      'formFields': {
        'sdate': true,
        'edate': true,
        'stime': true,
        'etime': true,
        'startHour': true,
        'classifyCounts': true,
        'days': true,
        'wholeSession': true,
        'zeroCounts': true,
        'activities': true,
        'locations': true
      },
      'dataSource': 'getData',
      'dataProcessor': 'processCalendarData',
      'suppWatch': false
    },
    '/hourly': {
      'formData': {
        'countOptions': [{
          'id': 'count',
          'title': 'Count Date'
        }, {
          'id': 'start',
          'title': 'Session Start'
        }, {
          'id': 'end',
          'title': 'Session End'
        }],
        'dayOptions': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        'sessionOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'zeroOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'startHourOptions': [{
          'id': '0000',
          'title': '12:00 AM'
        }, {
          'id': '0100',
          'title': '01:00 AM'
        }, {
          'id': '0200',
          'title': '02:00 AM'
        }, {
          'id': '0300',
          'title': '03:00 AM'
        }, {
          'id': '0400',
          'title': '04:00 AM'
        }, {
          'id': '0500',
          'title': '05:00 AM'
        }, {
          'id': '0600',
          'title': '06:00 AM'
        }, {
          'id': '0700',
          'title': '07:00 AM'
        }, {
          'id': '0800',
          'title': '08:00 AM'
        }, {
          'id': '0900',
          'title': '09:00 AM'
        }, {
          'id': '1000',
          'title': '10:00 AM'
        }, {
          'id': '1100',
          'title': '11:00 AM'
        }, {
          'id': '1200',
          'title': '12:00 PM'
        }, {
          'id': '1300',
          'title': '01:00 PM'
        }, {
          'id': '1400',
          'title': '02:00 PM'
        }, {
          'id': '1500',
          'title': '03:00 PM'
        }, {
          'id': '1600',
          'title': '04:00 PM'
        }, {
          'id': '1700',
          'title': '05:00 PM'
        }, {
          'id': '1800',
          'title': '06:00 PM'
        }, {
          'id': '1900',
          'title': '07:00 PM'
        }, {
          'id': '2000',
          'title': '08:00 PM'
        }, {
          'id': '2100',
          'title': '09:00 PM'
        }, {
          'id': '2200',
          'title': '10:00 PM'
        }, {
          'id': '2300',
          'title': '11:00 PM'
        }],
        'startDate': [moment().subtract(4, 'months').format('YYYY-MM-DD')],
        'endDate': [moment().format('YYYY-MM-DD')],
        'startTime': [''],
        'endTime': ['']
      },
      'formDefaults': {
        'classifyCounts': 'countOptions',
        'wholeSession': 'sessionOptions',
        'zeroCounts': 'zeroOptions',
        'startHour': 'startHourOptions',
        'sdate': 'startDate',
        'edate': 'endDate',
        'stime': 'startTime',
        'etime': 'endTime'
      },
      'formFields': {
        'sdate': true,
        'edate': true,
        'stime': false,
        'etime': false,
        'startHour': false,
        'classifyCounts': true,
        'days': true,
        'wholeSession': true,
        'zeroCounts': true,
        'activities': true,
        'locations': true
      },
      'dataSource': 'getData',
      'dataProcessor': 'processHourlyData',
      'suppWatch': false
    },
    '/sessions': {
      'formData': {
        'countOptions': [{
          'id': 'count',
          'title': 'Count Date'
        }, {
          'id': 'start',
          'title': 'Session Start'
        }, {
          'id': 'end',
          'title': 'Session End'
        }],
        'dayOptions': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        'sessionOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'zeroOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'startHourOptions': [{
          'id': '0000',
          'title': '12:00 AM'
        }, {
          'id': '0100',
          'title': '01:00 AM'
        }, {
          'id': '0200',
          'title': '02:00 AM'
        }, {
          'id': '0300',
          'title': '03:00 AM'
        }, {
          'id': '0400',
          'title': '04:00 AM'
        }, {
          'id': '0500',
          'title': '05:00 AM'
        }, {
          'id': '0600',
          'title': '06:00 AM'
        }, {
          'id': '0700',
          'title': '07:00 AM'
        }, {
          'id': '0800',
          'title': '08:00 AM'
        }, {
          'id': '0900',
          'title': '09:00 AM'
        }, {
          'id': '1000',
          'title': '10:00 AM'
        }, {
          'id': '1100',
          'title': '11:00 AM'
        }, {
          'id': '1200',
          'title': '12:00 PM'
        }, {
          'id': '1300',
          'title': '01:00 PM'
        }, {
          'id': '1400',
          'title': '02:00 PM'
        }, {
          'id': '1500',
          'title': '03:00 PM'
        }, {
          'id': '1600',
          'title': '04:00 PM'
        }, {
          'id': '1700',
          'title': '05:00 PM'
        }, {
          'id': '1800',
          'title': '06:00 PM'
        }, {
          'id': '1900',
          'title': '07:00 PM'
        }, {
          'id': '2000',
          'title': '08:00 PM'
        }, {
          'id': '2100',
          'title': '09:00 PM'
        }, {
          'id': '2200',
          'title': '10:00 PM'
        }, {
          'id': '2300',
          'title': '11:00 PM'
        }],
        'startDate': [moment().subtract(4, 'months').format('YYYY-MM-DD')],
        'endDate': [moment().format('YYYY-MM-DD')],
        'startTime': [''],
        'endTime': ['']
      },
      'formDefaults': {
        'classifyCounts': 'countOptions',
        'wholeSession': 'sessionOptions',
        'zeroCounts': 'zeroOptions',
        'startHour': 'startHourOptions',
        'sdate': 'startDate',
        'edate': 'endDate',
        'stime': 'startTime',
        'etime': 'endTime'
      },
      'formFields': {
        'sdate': true,
        'edate': true,
        'stime': true,
        'etime': true,
        'startHour': false,
        'classifyCounts': false,
        'days': false,
        'wholeSession': false,
        'zeroCounts': false,
        'activities': false,
        'locations': false
      },
      'dataSource': 'getSessionsData',
      'dataProcessor': false,
      'suppWatch': false
    },
    '/default': {
      'formData': {
        'countOptions': [{
          'id': 'count',
          'title': 'Count Date'
        }, {
          'id': 'start',
          'title': 'Session Start'
        }, {
          'id': 'end',
          'title': 'Session End'
        }],
        'dayOptions': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        'sessionOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'zeroOptions': [{
          'id': 'no',
          'title': 'No'
        }, {
          'id': 'yes',
          'title': 'Yes'
        }],
        'startHourOptions': [{
          'id': '0000',
          'title': '12:00 AM'
        }, {
          'id': '0100',
          'title': '01:00 AM'
        }, {
          'id': '0200',
          'title': '02:00 AM'
        }, {
          'id': '0300',
          'title': '03:00 AM'
        }, {
          'id': '0400',
          'title': '04:00 AM'
        }, {
          'id': '0500',
          'title': '05:00 AM'
        }, {
          'id': '0600',
          'title': '06:00 AM'
        }, {
          'id': '0700',
          'title': '07:00 AM'
        }, {
          'id': '0800',
          'title': '08:00 AM'
        }, {
          'id': '0900',
          'title': '09:00 AM'
        }, {
          'id': '1000',
          'title': '10:00 AM'
        }, {
          'id': '1100',
          'title': '11:00 AM'
        }, {
          'id': '1200',
          'title': '12:00 PM'
        }, {
          'id': '1300',
          'title': '01:00 PM'
        }, {
          'id': '1400',
          'title': '02:00 PM'
        }, {
          'id': '1500',
          'title': '03:00 PM'
        }, {
          'id': '1600',
          'title': '04:00 PM'
        }, {
          'id': '1700',
          'title': '05:00 PM'
        }, {
          'id': '1800',
          'title': '06:00 PM'
        }, {
          'id': '1900',
          'title': '07:00 PM'
        }, {
          'id': '2000',
          'title': '08:00 PM'
        }, {
          'id': '2100',
          'title': '09:00 PM'
        }, {
          'id': '2200',
          'title': '10:00 PM'
        }, {
          'id': '2300',
          'title': '11:00 PM'
        }],
        'startDate': [moment().subtract(4, 'months').format('YYYY-MM-DD')],
        'endDate': [moment().format('YYYY-MM-DD')],
        'startTime': [''],
        'endTime': ['']
      },
      'formDefaults': {
        'classifyCounts': 'countOptions',
        'wholeSession': 'sessionOptions',
        'zeroCounts': 'zeroOptions',
        'startHour': 'startHourOptions',
        'sdate': 'startDate',
        'edate': 'endDate',
        'stime': 'startTime',
        'etime': 'endTime'
      },
      'formFields': {
        'sdate': true,
        'edate': true,
        'stime': true,
        'etime': true,
        'startHour': true,
        'classifyCounts': true,
        'days': true,
        'wholeSession': true,
        'zeroCounts': true,
        'activities': true,
        'locations': true
      },
      'dataSource': 'getData',
      'dataProcessor': 'processTimeSeriesData',
      'suppWatch': true
    }
  }).value('paramsMock', {
    'startDate': [moment().subtract(4, 'months').format('YYYY-MM-DD')],
    'sdate': moment().subtract(4, 'months').format('YYYY-MM-DD'),
    'endDate': [moment().format('YYYY-MM-DD')],
    'edate': moment().format('YYYY-MM-DD'),
    'startTime': [''],
    'stime': '',
    'endTime': [''],
    'etime': '',
    'startHourOptions': [{
      'id': '0000',
      'title': '12:00 AM'
    }, {
      'id': '0100',
      'title': '01:00 AM'
    }, {
      'id': '0200',
      'title': '02:00 AM'
    }, {
      'id': '0300',
      'title': '03:00 AM'
    }, {
      'id': '0400',
      'title': '04:00 AM'
    }, {
      'id': '0500',
      'title': '05:00 AM'
    }, {
      'id': '0600',
      'title': '06:00 AM'
    }, {
      'id': '0700',
      'title': '07:00 AM'
    }, {
      'id': '0800',
      'title': '08:00 AM'
    }, {
      'id': '0900',
      'title': '09:00 AM'
    }, {
      'id': '1000',
      'title': '10:00 AM'
    }, {
      'id': '1100',
      'title': '11:00 AM'
    }, {
      'id': '1200',
      'title': '12:00 PM'
    }, {
      'id': '1300',
      'title': '01:00 PM'
    }, {
      'id': '1400',
      'title': '02:00 PM'
    }, {
      'id': '1500',
      'title': '03:00 PM'
    }, {
      'id': '1600',
      'title': '04:00 PM'
    }, {
      'id': '1700',
      'title': '05:00 PM'
    }, {
      'id': '1800',
      'title': '06:00 PM'
    }, {
      'id': '1900',
      'title': '07:00 PM'
    }, {
      'id': '2000',
      'title': '08:00 PM'
    }, {
      'id': '2100',
      'title': '09:00 PM'
    }, {
      'id': '2200',
      'title': '10:00 PM'
    }, {
      'id': '2300',
      'title': '11:00 PM'
    }],
    'startHour': {
      'id': '0000',
      'title': '12:00 AM'
    },
    'countOptions': [{
      'id': 'count',
      'title': 'Count Date'
    }, {
      'id': 'start',
      'title': 'Session Start'
    }, {
      'id': 'end',
      'title': 'Session End'
    }],
    'classifyCounts': {
      'id': 'count',
      'title': 'Count Date'
    },
    'dayOptions': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    'days': ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    'sessionOptions': [{
      'id': 'no',
      'title': 'No'
    }, {
      'id': 'yes',
      'title': 'Yes'
    }],
    'wholeSession': {
      'id': 'no',
      'title': 'No'
    },
    'zeroOptions': [{
      'id': 'no',
      'title': 'No'
    }, {
      'id': 'yes',
      'title': 'Yes'
    }],
    'zeroCounts': {
      'id': 'no',
      'title': 'No'
    }
  });