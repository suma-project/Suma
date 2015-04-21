'use strict';

angular.module('csvMock', [])
  .value('mockData', {
    'csv': {
      '2013-08-12': {
        'date': '2013-08-12',
        'total': 10,
        'locations': {
          'Tower/Stacks': null,
          'Unity lab': null,
          '2nd floor': null,
          '3rd floor': null,
          '4th floor': null,
          '5th floor': null,
          '6th floor': null,
          '7th floor': null,
          '8th floor': null,
          '9th floor': null,
          'Ground Floor': 6,
          'Lobby and Mezzanine': 4,
          'West Wing': null,
          'Technology Sandbox': null,
          'Quiet Reading Room': null,
          'Terrace': null,
          'ConeZone & Creamery': null,
          'WW 1st floor': null,
          'WW 2nd floor': null,
          'East Wing': null,
          'EW 1st floor (Learning Commons)': null,
          'EW 2nd floor': null,
          'Special Collections Reading Room': null,
          'Digital Media Lab': null
        },
        'activities': {
          'Reading': 2,
          'Knitting': 2,
          'Computer': 2,
          'Sleeping': null,
          'Laptop': null,
          'Computing': null,
          'Tablet': null,
          'Collaborating': null,
          '_No Activity': 8
        }
      },
      '2013-08-14': {
        'date': '2013-08-14',
        'total': 20,
        'locations': {
          'Tower/Stacks': null,
          'Unity lab': null,
          '2nd floor': null,
          '3rd floor': null,
          '4th floor': null,
          '5th floor': null,
          '6th floor': null,
          '7th floor': null,
          '8th floor': null,
          '9th floor': null,
          'Ground Floor': 10,
          'Lobby and Mezzanine': null,
          'West Wing': null,
          'Technology Sandbox': null,
          'Quiet Reading Room': null,
          'Terrace': null,
          'ConeZone & Creamery': 6,
          'WW 1st floor': null,
          'WW 2nd floor': null,
          'East Wing': null,
          'EW 1st floor (Learning Commons)': null,
          'EW 2nd floor': 4,
          'Special Collections Reading Room': null,
          'Digital Media Lab': null
        },
        'activities': {
          'Reading': null,
          'Knitting': 1,
          'Computer': 2,
          'Sleeping': null,
          'Laptop': null,
          'Computing': 1,
          'Tablet': null,
          'Collaborating': null,
          '_No Activity': 17
        }
      },
      '2013-08-13': {
        'date': '2013-08-13',
        'total': 8,
        'locations': {
          'Tower/Stacks': null,
          'Unity lab': null,
          '2nd floor': null,
          '3rd floor': null,
          '4th floor': null,
          '5th floor': null,
          '6th floor': null,
          '7th floor': null,
          '8th floor': null,
          '9th floor': null,
          'Ground Floor': null,
          'Lobby and Mezzanine': 8,
          'West Wing': null,
          'Technology Sandbox': null,
          'Quiet Reading Room': null,
          'Terrace': null,
          'ConeZone & Creamery': null,
          'WW 1st floor': null,
          'WW 2nd floor': null,
          'East Wing': null,
          'EW 1st floor (Learning Commons)': null,
          'EW 2nd floor': null,
          'Special Collections Reading Room': null,
          'Digital Media Lab': null
        },
        'activities': {
          'Reading': 1,
          'Knitting': null,
          'Computer': 2,
          'Sleeping': null,
          'Laptop': null,
          'Computing': null,
          'Tablet': 1,
          'Collaborating': null,
          '_No Activity': 6
        }
      }
    },
    'total': [{
      'count': 38
    }],
    'locationsTable': [{
      'id': 2,
      'title': 'Tower/Stacks',
      'parent': 1,
      'description': '',
      'rank': 0,
      'depth': 0,
      'name': 'Tower/Stacks',
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '04M'
    }, {
      'id': 7,
      'title': 'Unity lab',
      'parent': 2,
      'description': '',
      'rank': 0,
      'depth': 1,
      'name': 'Unity lab',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04N'
    }, {
      'id': 8,
      'title': '2nd floor',
      'parent': 2,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': '2nd floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04O'
    }, {
      'id': 9,
      'title': '3rd floor',
      'parent': 2,
      'description': '',
      'rank': 2,
      'depth': 1,
      'name': '3rd floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04P'
    }, {
      'id': 10,
      'title': '4th floor',
      'parent': 2,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': '4th floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04Q'
    }, {
      'id': 11,
      'title': '5th floor',
      'parent': 2,
      'description': '',
      'rank': 4,
      'depth': 1,
      'name': '5th floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04R'
    }, {
      'id': 12,
      'title': '6th floor',
      'parent': 2,
      'description': '',
      'rank': 5,
      'depth': 1,
      'name': '6th floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04S'
    }, {
      'id': 13,
      'title': '7th floor',
      'parent': 2,
      'description': '',
      'rank': 6,
      'depth': 1,
      'name': '7th floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04T'
    }, {
      'id': 14,
      'title': '8th floor',
      'parent': 2,
      'description': '',
      'rank': 7,
      'depth': 1,
      'name': '8th floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04U'
    }, {
      'id': 15,
      'title': '9th floor',
      'parent': 2,
      'description': '',
      'rank': 8,
      'depth': 1,
      'name': '9th floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04V'
    }, {
      'id': 3,
      'title': 'Ground Floor',
      'parent': 1,
      'description': '',
      'rank': 1,
      'depth': 0,
      'name': 'Ground Floor',
      'count': 16,
      'percent': '42.11',
      '$$hashKey': '04W'
    }, {
      'id': 4,
      'title': 'Lobby and Mezzanine',
      'parent': 1,
      'description': '',
      'rank': 2,
      'depth': 0,
      'name': 'Lobby and Mezzanine',
      'count': 12,
      'percent': '31.58',
      '$$hashKey': '04X'
    }, {
      'id': 5,
      'title': 'West Wing',
      'parent': 1,
      'description': '',
      'rank': 3,
      'depth': 0,
      'name': 'West Wing',
      'count': 6,
      'percent': '15.79',
      '$$hashKey': '04Y'
    }, {
      'id': 16,
      'title': 'Technology Sandbox',
      'parent': 5,
      'description': '',
      'rank': 0,
      'depth': 1,
      'name': 'Technology Sandbox',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '04Z'
    }, {
      'id': 17,
      'title': 'Quiet Reading Room',
      'parent': 5,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': 'Quiet Reading Room',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '050'
    }, {
      'id': 53,
      'title': 'Terrace',
      'parent': 5,
      'description': '',
      'rank': 2,
      'depth': 1,
      'name': 'Terrace',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '051'
    }, {
      'id': 18,
      'title': 'ConeZone & Creamery',
      'parent': 5,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': 'ConeZone & Creamery',
      'count': 6,
      'percent': '15.79',
      '$$hashKey': '052'
    }, {
      'id': 19,
      'title': 'WW 1st floor',
      'parent': 5,
      'description': '',
      'rank': 4,
      'depth': 1,
      'name': 'WW 1st floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '053'
    }, {
      'id': 20,
      'title': 'WW 2nd floor',
      'parent': 5,
      'description': '',
      'rank': 5,
      'depth': 1,
      'name': 'WW 2nd floor',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '054'
    }, {
      'id': 6,
      'title': 'East Wing',
      'parent': 1,
      'description': '',
      'rank': 4,
      'depth': 0,
      'name': 'East Wing',
      'count': 4,
      'percent': '10.53',
      '$$hashKey': '055'
    }, {
      'id': 21,
      'title': 'EW 1st floor (Learning Commons)',
      'parent': 6,
      'description': '',
      'rank': 0,
      'depth': 1,
      'name': 'EW 1st floor (Learning Commons)',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '056'
    }, {
      'id': 22,
      'title': 'EW 2nd floor',
      'parent': 6,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': 'EW 2nd floor',
      'count': 4,
      'percent': '10.53',
      '$$hashKey': '057'
    }, {
      'id': 23,
      'title': 'Special Collections Reading Room',
      'parent': 6,
      'description': '',
      'rank': 2,
      'depth': 1,
      'name': 'Special Collections Reading Room',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '058'
    }, {
      'id': 24,
      'title': 'Digital Media Lab',
      'parent': 6,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': 'Digital Media Lab',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '059'
    }],
    'locationsSum': [{
      'id': 3,
      'title': 'Ground Floor',
      'parent': 1,
      'description': '',
      'rank': 1,
      'depth': 0,
      'name': 'Ground Floor',
      'count': 16,
      'percent': '42.11'
    }, {
      'id': 4,
      'title': 'Lobby and Mezzanine',
      'parent': 1,
      'description': '',
      'rank': 2,
      'depth': 0,
      'name': 'Lobby and Mezzanine',
      'count': 12,
      'percent': '31.58'
    }, {
      'id': 18,
      'title': 'ConeZone & Creamery',
      'parent': 5,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': 'ConeZone & Creamery',
      'count': 6,
      'percent': '15.79'
    }, {
      'id': 22,
      'title': 'EW 2nd floor',
      'parent': 6,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': 'EW 2nd floor',
      'count': 4,
      'percent': '10.53'
    }],
    'locationsAvgSum': [{
      'id': 3,
      'title': 'Ground Floor',
      'parent': 1,
      'description': '',
      'rank': 1,
      'depth': 0,
      'name': 'Ground Floor',
      'count': '5.33',
      'percent': '14.03'
    }, {
      'id': 4,
      'title': 'Lobby and Mezzanine',
      'parent': 1,
      'description': '',
      'rank': 2,
      'depth': 0,
      'name': 'Lobby and Mezzanine',
      'count': '4.00',
      'percent': '10.53'
    }, {
      'id': 18,
      'title': 'ConeZone & Creamery',
      'parent': 5,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': 'ConeZone & Creamery',
      'count': '2.00',
      'percent': '5.26'
    }, {
      'id': 22,
      'title': 'EW 2nd floor',
      'parent': 6,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': 'EW 2nd floor',
      'count': '1.33',
      'percent': '3.50'
    }],
    'locationsAvgAvg': [{
      'id': 3,
      'title': 'Ground Floor',
      'parent': 1,
      'description': '',
      'rank': 1,
      'depth': 0,
      'name': 'Ground Floor',
      'count': '5.50',
      'percent': '14.47'
    }, {
      'id': 4,
      'title': 'Lobby and Mezzanine',
      'parent': 1,
      'description': '',
      'rank': 2,
      'depth': 0,
      'name': 'Lobby and Mezzanine',
      'count': '4.00',
      'percent': '10.53'
    }, {
      'id': 18,
      'title': 'ConeZone & Creamery',
      'parent': 5,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': 'ConeZone & Creamery',
      'count': '6.00',
      'percent': '15.79'
    }, {
      'id': 22,
      'title': 'EW 2nd floor',
      'parent': 6,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': 'EW 2nd floor',
      'count': '4.00',
      'percent': '10.53'
    }],
    'locationsPct': [{
      'id': 3,
      'title': 'Ground Floor',
      'parent': 1,
      'description': '',
      'rank': 1,
      'depth': 0,
      'name': 'Ground Floor',
      'count': '42.11',
      'percent': '42.11'
    }, {
      'id': 4,
      'title': 'Lobby and Mezzanine',
      'parent': 1,
      'description': '',
      'rank': 2,
      'depth': 0,
      'name': 'Lobby and Mezzanine',
      'count': '31.58',
      'percent': '31.58'
    }, {
      'id': 18,
      'title': 'ConeZone & Creamery',
      'parent': 5,
      'description': '',
      'rank': 3,
      'depth': 1,
      'name': 'ConeZone & Creamery',
      'count': '15.79',
      'percent': '15.79'
    }, {
      'id': 22,
      'title': 'EW 2nd floor',
      'parent': 6,
      'description': '',
      'rank': 1,
      'depth': 1,
      'name': 'EW 2nd floor',
      'count': '10.53',
      'percent': '10.53'
    }],
    'activitiesTable': [{
      'id': 23,
      'rank': 0,
      'title': 'Test Group',
      'type': 'activityGroup',
      'depth': 0,
      'name': 'Test Group',
      'count': 3,
      'percent': '7.89',
      '$$hashKey': '05Y'
    }, {
      'id': 63,
      'rank': 0,
      'title': 'Knitting',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 23,
      'name': 'Knitting',
      'count': 3,
      'percent': '7.89',
      '$$hashKey': '05Z'
    }, {
      'id': 24,
      'rank': 1,
      'title': 'Technology',
      'type': 'activityGroup',
      'depth': 0,
      'name': 'Technology',
      'count': 7,
      'percent': '18.42',
      '$$hashKey': '060'
    }, {
      'id': 64,
      'rank': 0,
      'title': 'Computer',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Computer',
      'count': 6,
      'percent': '15.79',
      '$$hashKey': '061'
    }, {
      'id': 65,
      'rank': 1,
      'title': 'Laptop',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Laptop',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '062'
    }, {
      'id': 66,
      'rank': 2,
      'title': 'Tablet',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Tablet',
      'count': 1,
      'percent': '2.63',
      '$$hashKey': '063'
    }, {
      'id': 1,
      'rank': 2,
      'title': 'Activities',
      'type': 'activityGroup',
      'depth': 0,
      'name': 'Activities',
      'count': 4,
      'percent': '10.53',
      '$$hashKey': '064'
    }, {
      'id': 1,
      'rank': 0,
      'title': 'Reading',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Reading',
      'count': 3,
      'percent': '7.89',
      '$$hashKey': '065'
    }, {
      'id': 2,
      'rank': 1,
      'title': 'Sleeping',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Sleeping',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '066'
    }, {
      'id': 4,
      'rank': 2,
      'title': 'Computing',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Computing',
      'count': 1,
      'percent': '2.63',
      '$$hashKey': '067'
    }, {
      'id': 3,
      'rank': 3,
      'title': 'Collaborating',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Collaborating',
      'count': null,
      'percent': '0.00',
      '$$hashKey': '068'
    }, {
      'name': 'No Activity',
      'depth': 0,
      'percent': '81.58',
      'count': 31,
      '$$hashKey': '069'
    }],
    'activitiesSum': [{
      'id': 63,
      'rank': 0,
      'title': 'Knitting',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 23,
      'name': 'Knitting',
      'count': 3,
      'percent': '7.89'
    }, {
      'id': 64,
      'rank': 0,
      'title': 'Computer',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Computer',
      'count': 6,
      'percent': '15.79'
    }, {
      'id': 66,
      'rank': 2,
      'title': 'Tablet',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Tablet',
      'count': 1,
      'percent': '2.63'
    }, {
      'id': 1,
      'rank': 0,
      'title': 'Reading',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Reading',
      'count': 3,
      'percent': '7.89'
    }, {
      'id': 4,
      'rank': 2,
      'title': 'Computing',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Computing',
      'count': 1,
      'percent': '2.63'
    }, {
      'name': 'No Activity',
      'depth': 0,
      'percent': '81.58',
      'count': 31,
      '$$hashKey': '069'
    }],
    'activitiesAvgSum': [{
      'id': 63,
      'rank': 0,
      'title': 'Knitting',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 23,
      'name': 'Knitting',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 64,
      'rank': 0,
      'title': 'Computer',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Computer',
      'count': '2.00',
      'percent': '5.26'
    }, {
      'id': 66,
      'rank': 2,
      'title': 'Tablet',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Tablet',
      'count': '0.33',
      'percent': '0.87'
    }, {
      'id': 1,
      'rank': 2,
      'title': 'Activities',
      'type': 'activityGroup',
      'depth': 0,
      'name': 'Activities',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 1,
      'rank': 0,
      'title': 'Reading',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Reading',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 4,
      'rank': 2,
      'title': 'Computing',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Computing',
      'count': '0.33',
      'percent': '0.87'
    }, {
      'name': 'No Activity',
      'depth': 0,
      'percent': '27.19',
      'count': '10.33'
    }],
    'activitiesAvgAvg': [{
      'id': 63,
      'rank': 0,
      'title': 'Knitting',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 23,
      'name': 'Knitting',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 64,
      'rank': 0,
      'title': 'Computer',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Computer',
      'count': '1.67',
      'percent': '4.39'
    }, {
      'id': 66,
      'rank': 2,
      'title': 'Tablet',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Tablet',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 1,
      'rank': 2,
      'title': 'Activities',
      'type': 'activityGroup',
      'depth': 0,
      'name': 'Activities',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 1,
      'rank': 0,
      'title': 'Reading',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Reading',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'id': 4,
      'rank': 2,
      'title': 'Computing',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Computing',
      'count': '1.00',
      'percent': '2.63'
    }, {
      'name': 'No Activity',
      'depth': 0,
      'percent': '23.68',
      'count': '9.00'
    }],
    'activitiesPct': [{
      'id': 63,
      'rank': 0,
      'title': 'Knitting',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 23,
      'name': 'Knitting',
      'count': '7.89',
      'percent': '7.89'
    }, {
      'id': 64,
      'rank': 0,
      'title': 'Computer',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Computer',
      'count': '15.79',
      'percent': '15.79'
    }, {
      'id': 66,
      'rank': 2,
      'title': 'Tablet',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 24,
      'name': 'Tablet',
      'count': '2.63',
      'percent': '2.63'
    }, {
      'id': 1,
      'rank': 0,
      'title': 'Reading',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Reading',
      'count': '7.89',
      'percent': '7.89'
    }, {
      'id': 4,
      'rank': 2,
      'title': 'Computing',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 1,
      'name': 'Computing',
      'count': '2.63',
      'percent': '2.63'
    }, {
      'name': 'No Activity',
      'depth': 0,
      'percent': '81.58',
      'count': '81.58'
    }],
    'periodSum': [{
      'date': '2013-08-12',
      'count': 10,
      'title': '2013-08-12',
      'fDate': '2013-08-12T04:00:00.000Z',
      'day': 'Mon'
    }, {
      'date': '2013-08-13',
      'count': 8,
      'title': '2013-08-13',
      'fDate': '2013-08-13T04:00:00.000Z',
      'day': 'Tue'
    }, {
      'date': '2013-08-14',
      'count': 20,
      'title': '2013-08-14',
      'fDate': '2013-08-14T04:00:00.000Z',
      'day': 'Wed'
    }],
    'periodAvg': [{
      'date': '2013-08-12',
      'count': 10
    }, {
      'date': '2013-08-13',
      'count': 4
    }, {
      'date': '2013-08-14',
      'count': 15
    }],
    'hourlySummary': [{
      'name': 0,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06Q'
    }, {
      'name': 1,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06R'
    }, {
      'name': 2,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06S'
    }, {
      'name': 3,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06T'
    }, {
      'name': 4,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06U'
    }, {
      'name': 5,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06V'
    }, {
      'name': 6,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06W'
    }, {
      'name': 7,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06X'
    }, {
      'name': 8,
      'count': 11,
      'percent': '28.95',
      '$$hashKey': '06Y'
    }, {
      'name': 9,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '06Z'
    }, {
      'name': 10,
      'count': 8,
      'percent': '21.05',
      '$$hashKey': '070'
    }, {
      'name': 11,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '071'
    }, {
      'name': 12,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '072'
    }, {
      'name': 13,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '073'
    }, {
      'name': 14,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '074'
    }, {
      'name': 15,
      'count': 19,
      'percent': '50.00',
      '$$hashKey': '075'
    }, {
      'name': 16,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '076'
    }, {
      'name': 17,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '077'
    }, {
      'name': 18,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '078'
    }, {
      'name': 19,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '079'
    }, {
      'name': 20,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '07A'
    }, {
      'name': 21,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '07B'
    }, {
      'name': 22,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '07C'
    }, {
      'name': 23,
      'count': 0,
      'percent': '0.00',
      '$$hashKey': '07D'
    }],
    'dayOfWeekSummary': [],
    'monthSummary': [{
      'date': 'August 1, 2013',
      'name': 'August 2013',
      'count': 38,
      'percent': '100.00',
      '$$hashKey': '06O'
    }],
    'yearSummary': [{
      'name': '2013',
      'count': 38,
      'percent': '100.00',
      '$$hashKey': '06M'
    }],
    'timeSeriesOptions': [{
      'title': 'Daily Avg',
      'val': 'avg',
      'data': [{
        'date': '2013-08-12',
        'count': 10
      }, {
        'date': '2013-08-13',
        'count': 4
      }, {
        'date': '2013-08-14',
        'count': 15
      }],
      '$$hashKey': '082'
    }, {
      'title': 'Daily Sum',
      'val': 'sum',
      'data': [{
        'date': '2013-08-12',
        'count': 10,
        'title': '2013-08-12',
        'fDate': '2013-08-12T04:00:00.000Z',
        'day': 'Mon'
      }, {
        'date': '2013-08-13',
        'count': 8,
        'title': '2013-08-13',
        'fDate': '2013-08-13T04:00:00.000Z',
        'day': 'Tue'
      }, {
        'date': '2013-08-14',
        'count': 20,
        'title': '2013-08-14',
        'fDate': '2013-08-14T04:00:00.000Z',
        'day': 'Wed'
      }],
      '$$hashKey': '083'
    }],
    'timeSeriesData': {
      'title': 'Daily Sum',
      'val': 'sum',
      'data': [{
        'date': '2013-08-12',
        'count': 10,
        'title': '2013-08-12',
        'fDate': '2013-08-12T04:00:00.000Z',
        'day': 'Mon'
      }, {
        'date': '2013-08-13',
        'count': 8,
        'title': '2013-08-13',
        'fDate': '2013-08-13T04:00:00.000Z',
        'day': 'Tue'
      }, {
        'date': '2013-08-14',
        'count': 20,
        'title': '2013-08-14',
        'fDate': '2013-08-14T04:00:00.000Z',
        'day': 'Wed'
      }],
      '$$hashKey': '083'
    },
    'actsLocsOptions': [{
      'title': 'Activities',
      'val': 'activities',
      'items': [{
        'title': 'Avg of Sum',
        'data': [{
          'id': 63,
          'rank': 0,
          'title': 'Knitting',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 23,
          'name': 'Knitting',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 64,
          'rank': 0,
          'title': 'Computer',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Computer',
          'count': '2.00',
          'percent': '5.26'
        }, {
          'id': 66,
          'rank': 2,
          'title': 'Tablet',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Tablet',
          'count': '0.33',
          'percent': '0.87'
        }, {
          'id': 1,
          'rank': 2,
          'title': 'Activities',
          'type': 'activityGroup',
          'depth': 0,
          'name': 'Activities',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 1,
          'rank': 0,
          'title': 'Reading',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Reading',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 4,
          'rank': 2,
          'title': 'Computing',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Computing',
          'count': '0.33',
          'percent': '0.87'
        }, {
          'name': 'No Activity',
          'depth': 0,
          'percent': '27.19',
          'count': '10.33'
        }]
      }, {
        'title': 'Avg of Avg',
        'data': [{
          'id': 63,
          'rank': 0,
          'title': 'Knitting',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 23,
          'name': 'Knitting',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 64,
          'rank': 0,
          'title': 'Computer',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Computer',
          'count': '1.67',
          'percent': '4.39'
        }, {
          'id': 66,
          'rank': 2,
          'title': 'Tablet',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Tablet',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 1,
          'rank': 2,
          'title': 'Activities',
          'type': 'activityGroup',
          'depth': 0,
          'name': 'Activities',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 1,
          'rank': 0,
          'title': 'Reading',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Reading',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'id': 4,
          'rank': 2,
          'title': 'Computing',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Computing',
          'count': '1.00',
          'percent': '2.63'
        }, {
          'name': 'No Activity',
          'depth': 0,
          'percent': '23.68',
          'count': '9.00'
        }]
      }, {
        'title': 'Sum',
        'data': [{
          'id': 63,
          'rank': 0,
          'title': 'Knitting',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 23,
          'name': 'Knitting',
          'count': 3,
          'percent': '7.89'
        }, {
          'id': 64,
          'rank': 0,
          'title': 'Computer',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Computer',
          'count': 6,
          'percent': '15.79'
        }, {
          'id': 66,
          'rank': 2,
          'title': 'Tablet',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Tablet',
          'count': 1,
          'percent': '2.63'
        }, {
          'id': 1,
          'rank': 0,
          'title': 'Reading',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Reading',
          'count': 3,
          'percent': '7.89'
        }, {
          'id': 4,
          'rank': 2,
          'title': 'Computing',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Computing',
          'count': 1,
          'percent': '2.63'
        }, {
          'name': 'No Activity',
          'depth': 0,
          'percent': '81.58',
          'count': 31,
          '$$hashKey': '069'
        }]
      }, {
        'title': 'Pct',
        'data': [{
          'id': 63,
          'rank': 0,
          'title': 'Knitting',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 23,
          'name': 'Knitting',
          'count': '7.89',
          'percent': '7.89'
        }, {
          'id': 64,
          'rank': 0,
          'title': 'Computer',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Computer',
          'count': '15.79',
          'percent': '15.79'
        }, {
          'id': 66,
          'rank': 2,
          'title': 'Tablet',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 24,
          'name': 'Tablet',
          'count': '2.63',
          'percent': '2.63'
        }, {
          'id': 1,
          'rank': 0,
          'title': 'Reading',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Reading',
          'count': '7.89',
          'percent': '7.89'
        }, {
          'id': 4,
          'rank': 2,
          'title': 'Computing',
          'type': 'activity',
          'depth': 1,
          'activityGroup': 1,
          'name': 'Computing',
          'count': '2.63',
          'percent': '2.63'
        }, {
          'name': 'No Activity',
          'depth': 0,
          'percent': '81.58',
          'count': '81.58'
        }]
      }],
      '$$hashKey': '086'
    }, {
      'title': 'Locations',
      'val': 'locations',
      'items': [{
        'title': 'Avg of Sum',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': '5.33',
          'percent': '14.03'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': '4.00',
          'percent': '10.53'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': '2.00',
          'percent': '5.26'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': '1.33',
          'percent': '3.50'
        }],
        '$$hashKey': '08A'
      }, {
        'title': 'Avg of Avg',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': '5.50',
          'percent': '14.47'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': '4.00',
          'percent': '10.53'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': '6.00',
          'percent': '15.79'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': '4.00',
          'percent': '10.53'
        }],
        '$$hashKey': '08B'
      }, {
        'title': 'Sum',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': 16,
          'percent': '42.11'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': 12,
          'percent': '31.58'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': 6,
          'percent': '15.79'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': 4,
          'percent': '10.53'
        }],
        '$$hashKey': '08C'
      }, {
        'title': 'Pct',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': '42.11',
          'percent': '42.11'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': '31.58',
          'percent': '31.58'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': '15.79',
          'percent': '15.79'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': '10.53',
          'percent': '10.53'
        }],
        '$$hashKey': '08D'
      }],
      '$$hashKey': '087'
    }],
    'actsLocsData': {
      'title': 'Locations',
      'val': 'locations',
      'items': [{
        'title': 'Avg of Sum',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': '5.33',
          'percent': '14.03'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': '4.00',
          'percent': '10.53'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': '2.00',
          'percent': '5.26'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': '1.33',
          'percent': '3.50'
        }],
        '$$hashKey': '08A'
      }, {
        'title': 'Avg of Avg',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': '5.50',
          'percent': '14.47'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': '4.00',
          'percent': '10.53'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': '6.00',
          'percent': '15.79'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': '4.00',
          'percent': '10.53'
        }],
        '$$hashKey': '08B'
      }, {
        'title': 'Sum',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': 16,
          'percent': '42.11'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': 12,
          'percent': '31.58'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': 6,
          'percent': '15.79'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': 4,
          'percent': '10.53'
        }],
        '$$hashKey': '08C'
      }, {
        'title': 'Pct',
        'data': [{
          'id': 3,
          'title': 'Ground Floor',
          'parent': 1,
          'description': '',
          'rank': 1,
          'depth': 0,
          'name': 'Ground Floor',
          'count': '42.11',
          'percent': '42.11'
        }, {
          'id': 4,
          'title': 'Lobby and Mezzanine',
          'parent': 1,
          'description': '',
          'rank': 2,
          'depth': 0,
          'name': 'Lobby and Mezzanine',
          'count': '31.58',
          'percent': '31.58'
        }, {
          'id': 18,
          'title': 'ConeZone & Creamery',
          'parent': 5,
          'description': '',
          'rank': 3,
          'depth': 1,
          'name': 'ConeZone & Creamery',
          'count': '15.79',
          'percent': '15.79'
        }, {
          'id': 22,
          'title': 'EW 2nd floor',
          'parent': 6,
          'description': '',
          'rank': 1,
          'depth': 1,
          'name': 'EW 2nd floor',
          'count': '10.53',
          'percent': '10.53'
        }],
        '$$hashKey': '08D'
      }],
      '$$hashKey': '087'
    },
    'barChartData': {
      'title': 'Sum',
      'data': [{
        'id': 3,
        'title': 'Ground Floor',
        'parent': 1,
        'description': '',
        'rank': 1,
        'depth': 0,
        'name': 'Ground Floor',
        'count': 16,
        'percent': '42.11'
      }, {
        'id': 4,
        'title': 'Lobby and Mezzanine',
        'parent': 1,
        'description': '',
        'rank': 2,
        'depth': 0,
        'name': 'Lobby and Mezzanine',
        'count': 12,
        'percent': '31.58'
      }, {
        'id': 18,
        'title': 'ConeZone & Creamery',
        'parent': 5,
        'description': '',
        'rank': 3,
        'depth': 1,
        'name': 'ConeZone & Creamery',
        'count': 6,
        'percent': '15.79'
      }, {
        'id': 22,
        'title': 'EW 2nd floor',
        'parent': 6,
        'description': '',
        'rank': 1,
        'depth': 1,
        'name': 'EW 2nd floor',
        'count': 4,
        'percent': '10.53'
      }],
      '$$hashKey': '08C'
    }
  }).value('mockLink', 'data:text/csv;charset=utf-8,Metadata%0ATest%0A2014-01-01%20to%202014-01-31%0A%20Report%0A%0A%0A%0APrimary%0ADate,Total,Tower/Stacks,Unity%20lab,2nd%20floor,3rd%20floor,4th%20floor,5th%20floor,6th%20floor,7th%20floor,8th%20floor,9th%20floor,Ground%20Floor,Lobby%20and%20Mezzanine,West%20Wing,Technology%20Sandbox,Quiet%20Reading%20Room,Terrace,ConeZone%20&%20Creamery,WW%201st%20floor,WW%202nd%20floor,East%20Wing,EW%201st%20floor%20(Learning%20Commons),EW%202nd%20floor,Special%20Collections%20Reading%20Room,Digital%20Media%20Lab,Reading,Knitting,Computer,Sleeping,Laptop,Computing,Tablet,Collaborating,_No%20Activity%0A2013-08-12,10,,,,,,,,,,,6,4,,,,,,,,,,,,,2,2,2,,,,,,8%0A2013-08-14,20,,,,,,,,,,,10,,,,,,6,,,,,4,,,,1,2,,,1,,,17%0A2013-08-13,8,,,,,,,,,,,,8,,,,,,,,,,,,,1,,2,,,,1,,6%0A%0A%0ALocations%0ALocation,Count,Percent%0ATower/Stacks,0,0.00%0A%20%20%20%20%20Unity%20lab,,0.00%0A%20%20%20%20%202nd%20floor,,0.00%0A%20%20%20%20%203rd%20floor,,0.00%0A%20%20%20%20%204th%20floor,,0.00%0A%20%20%20%20%205th%20floor,,0.00%0A%20%20%20%20%206th%20floor,,0.00%0A%20%20%20%20%207th%20floor,,0.00%0A%20%20%20%20%208th%20floor,,0.00%0A%20%20%20%20%209th%20floor,,0.00%0AGround%20Floor,16,42.11%0ALobby%20and%20Mezzanine,12,31.58%0AWest%20Wing,6,15.79%0A%20%20%20%20%20Technology%20Sandbox,,0.00%0A%20%20%20%20%20Quiet%20Reading%20Room,,0.00%0A%20%20%20%20%20Terrace,,0.00%0A%20%20%20%20%20ConeZone%20&%20Creamery,6,15.79%0A%20%20%20%20%20WW%201st%20floor,,0.00%0A%20%20%20%20%20WW%202nd%20floor,,0.00%0AEast%20Wing,4,10.53%0A%20%20%20%20%20EW%201st%20floor%20(Learning%20Commons),,0.00%0A%20%20%20%20%20EW%202nd%20floor,4,10.53%0A%20%20%20%20%20Special%20Collections%20Reading%20Room,,0.00%0A%20%20%20%20%20Digital%20Media%20Lab,,0.00%0A%0A%0AActivities%0AActivity,Count,Percent%0ATest%20Group,3,7.89%0A%20%20%20%20%20Knitting,3,7.89%0ATechnology,7,18.42%0A%20%20%20%20%20Computer,6,15.79%0A%20%20%20%20%20Laptop,,0.00%0A%20%20%20%20%20Tablet,1,2.63%0AActivities,4,10.53%0A%20%20%20%20%20Reading,3,7.89%0A%20%20%20%20%20Sleeping,,0.00%0A%20%20%20%20%20Computing,1,2.63%0A%20%20%20%20%20Collaborating,,0.00%0ANo%20Activity,31,81.58%0A%0A%0AHourly%0AHour,Count,Percent%0A0,0,0.00%0A1,0,0.00%0A2,0,0.00%0A3,0,0.00%0A4,0,0.00%0A5,0,0.00%0A6,0,0.00%0A7,0,0.00%0A8,11,28.95%0A9,0,0.00%0A10,8,21.05%0A11,0,0.00%0A12,0,0.00%0A13,0,0.00%0A14,0,0.00%0A15,19,50.00%0A16,0,0.00%0A17,0,0.00%0A18,0,0.00%0A19,0,0.00%0A20,0,0.00%0A21,0,0.00%0A22,0,0.00%0A23,0,0.00%0A%0A%0ADaily%0A%0A%0A%0AMonthly%0AMonth,Count,Percent%0AAugust%202013,38,100.00%0A%0A%0AYearly%0AYear,Count,Percent%0A2013,38,100.00%0A%0A%0A'
);
