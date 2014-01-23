'use strict';

angular.module('actsLocsMock', [])
  .value('init', {
    'title': 'Hunt Service',
    'id': 9,
    'description': null,
    'rootLocation': '77',
    'dictionary': {
      'locations': [{
        'id': 78,
        'title': '1st floor',
        'parent': 77,
        'description': '',
        'rank': 0,
        'depth': 0
      }, {
        'id': 79,
        'title': '2nd floor',
        'parent': 77,
        'description': '',
        'rank': 1,
        'depth': 0
      }, {
        'id': 124,
        'title': 'Lobby',
        'parent': 79,
        'description': '',
        'rank': 0,
        'depth': 1
      }, {
        'id': 83,
        'title': 'Ask Us',
        'parent': 79,
        'description': '',
        'rank': 1,
        'depth': 1
      }, {
        'id': 125,
        'title': 'Tech Showcase',
        'parent': 79,
        'description': '',
        'rank': 2,
        'depth': 1
      }, {
        'id': 84,
        'title': 'Rain Garden Reading Lounge',
        'parent': 79,
        'description': '',
        'rank': 3,
        'depth': 1
      }, {
        'id': 126,
        'title': 'Idea Alcove',
        'parent': 79,
        'description': '',
        'rank': 4,
        'depth': 1
      }, {
        'id': 85,
        'title': 'Quiet Reading Room',
        'parent': 79,
        'description': '',
        'rank': 5,
        'depth': 1
      }, {
        'id': 86,
        'title': 'Study Rooms',
        'parent': 79,
        'description': '',
        'rank': 6,
        'depth': 1
      }, {
        'id': 127,
        'title': 'Connective Spaces',
        'parent': 79,
        'description': '',
        'rank': 7,
        'depth': 1
      }, {
        'id': 80,
        'title': '3rd floor',
        'parent': 77,
        'description': '',
        'rank': 2,
        'depth': 0
      }, {
        'id': 87,
        'title': 'Learning Commons [3rd]',
        'parent': 80,
        'description': '',
        'rank': 0,
        'depth': 1
      }, {
        'id': 88,
        'title': 'Game Lab',
        'parent': 80,
        'description': '',
        'rank': 1,
        'depth': 1
      }, {
        'id': 89,
        'title': 'Study Rooms',
        'parent': 80,
        'description': '',
        'rank': 2,
        'depth': 1
      }, {
        'id': 137,
        'title': 'Presentation Practice ',
        'parent': 80,
        'description': '',
        'rank': 3,
        'depth': 1
      }, {
        'id': 101,
        'title': 'Media Rooms',
        'parent': 80,
        'description': '',
        'rank': 4,
        'depth': 1
      }, {
        'id': 81,
        'title': '4th floor',
        'parent': 77,
        'description': '',
        'rank': 3,
        'depth': 0
      }, {
        'id': 93,
        'title': 'Learning Commons [4th]',
        'parent': 81,
        'description': '',
        'rank': 0,
        'depth': 1
      }, {
        'id': 106,
        'title': 'Fishbowl',
        'parent': 81,
        'description': '',
        'rank': 1,
        'depth': 1
      }, {
        'id': 94,
        'title': 'Graduate Student Commons',
        'parent': 81,
        'description': '',
        'rank': 2,
        'depth': 1
      }, {
        'id': 113,
        'title': 'Graduate Student Commons Study Rooms',
        'parent': 81,
        'description': '',
        'rank': 3,
        'depth': 1
      }, {
        'id': 95,
        'title': 'Creativity Studio',
        'parent': 81,
        'description': '',
        'rank': 4,
        'depth': 1
      }, {
        'id': 96,
        'title': 'Teaching and Visualization Lab',
        'parent': 81,
        'description': '',
        'rank': 5,
        'depth': 1
      }, {
        'id': 138,
        'title': '4K Video Editing/Viewing Suite (4215)',
        'parent': 81,
        'description': '',
        'rank': 6,
        'depth': 1
      }, {
        'id': 139,
        'title': 'Green Screen Media Production Suite (4217)',
        'parent': 81,
        'description': '',
        'rank': 7,
        'depth': 1
      }, {
        'id': 97,
        'title': 'Media Production Rooms',
        'parent': 81,
        'description': '',
        'rank': 8,
        'depth': 1
      }, {
        'id': 98,
        'title': 'Study Rooms',
        'parent': 81,
        'description': '',
        'rank': 9,
        'depth': 1
      }, {
        'id': 99,
        'title': 'Makerspace',
        'parent': 81,
        'description': '',
        'rank': 10,
        'depth': 1
      }, {
        'id': 100,
        'title': 'Oval View Reading Lounge',
        'parent': 81,
        'description': '',
        'rank': 11,
        'depth': 1
      }, {
        'id': 102,
        'title': 'Music Rooms',
        'parent': 81,
        'description': '',
        'rank': 12,
        'depth': 1
      }, {
        'id': 103,
        'title': 'Usability Lab',
        'parent': 81,
        'description': '',
        'rank': 13,
        'depth': 1
      }, {
        'id': 104,
        'title': 'Video Seminar Room',
        'parent': 81,
        'description': '',
        'rank': 14,
        'depth': 1
      }, {
        'id': 128,
        'title': 'Connective Spaces',
        'parent': 81,
        'description': '',
        'rank': 15,
        'depth': 1
      }, {
        'id': 82,
        'title': '5th floor',
        'parent': 77,
        'description': '',
        'rank': 4,
        'depth': 0
      }, {
        'id': 90,
        'title': 'Skyline Reading Room',
        'parent': 82,
        'description': '',
        'rank': 0,
        'depth': 1
      }, {
        'id': 91,
        'title': 'Skyline Terrace',
        'parent': 82,
        'description': '',
        'rank': 1,
        'depth': 1
      }, {
        'id': 92,
        'title': 'Faculty Research Commons',
        'parent': 82,
        'description': '',
        'rank': 2,
        'depth': 1
      }],
      'activities': [{
        'id': 48,
        'title': 'Print/Copy',
        'rank': 0,
        'description': '',
        'activityGroup': 18
      }, {
        'id': 52,
        'title': 'In-person',
        'rank': 0,
        'description': '',
        'activityGroup': 19
      }, {
        'id': 54,
        'title': 'Very short (&lt; 5 seconds)',
        'rank': 0,
        'description': '',
        'activityGroup': 20
      }, {
        'id': 49,
        'title': 'Reference',
        'rank': 1,
        'description': '',
        'activityGroup': 18
      }, {
        'id': 53,
        'title': 'Phone',
        'rank': 1,
        'description': '',
        'activityGroup': 19
      }, {
        'id': 55,
        'title': 'Short (&lt; 5 minutes)',
        'rank': 1,
        'description': '',
        'activityGroup': 20
      }, {
        'id': 50,
        'title': 'Directional',
        'rank': 2,
        'description': '',
        'activityGroup': 18
      }, {
        'id': 58,
        'title': 'Roaming',
        'rank': 2,
        'description': '',
        'activityGroup': 19
      }, {
        'id': 56,
        'title': 'Medium (5-10 minutes)',
        'rank': 2,
        'description': '',
        'activityGroup': 20
      }, {
        'id': 51,
        'title': 'Computing',
        'rank': 3,
        'description': '',
        'activityGroup': 18
      }, {
        'id': 57,
        'title': 'Long (&gt; 10 minutes)',
        'rank': 3,
        'description': '',
        'activityGroup': 20
      }],
      'activityGroups': [{
        'id': 18,
        'title': 'Type',
        'rank': 0,
        'description': '',
        'required': true,
        'allowMulti': false
      }, {
        'id': 19,
        'title': 'Medium',
        'rank': 1,
        'description': '',
        'required': true,
        'allowMulti': false
      }, {
        'id': 20,
        'title': 'Time',
        'rank': 2,
        'description': '',
        'required': true,
        'allowMulti': false
      }]
    }
  }).value('processedActsLocs', {
    'activities': [{
      'title': 'All',
      'id': 'all'
    }, {
      'id': 18,
      'rank': 0,
      'title': 'Type',
      'type': 'activityGroup',
      'depth': 0
    }, {
      'id': 48,
      'rank': 0,
      'title': 'Print/Copy',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 18
    }, {
      'id': 49,
      'rank': 1,
      'title': 'Reference',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 18
    }, {
      'id': 50,
      'rank': 2,
      'title': 'Directional',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 18
    }, {
      'id': 51,
      'rank': 3,
      'title': 'Computing',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 18
    }, {
      'id': 19,
      'rank': 1,
      'title': 'Medium',
      'type': 'activityGroup',
      'depth': 0
    }, {
      'id': 52,
      'rank': 0,
      'title': 'In-person',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 19
    }, {
      'id': 53,
      'rank': 1,
      'title': 'Phone',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 19
    }, {
      'id': 58,
      'rank': 2,
      'title': 'Roaming',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 19
    }, {
      'id': 20,
      'rank': 2,
      'title': 'Time',
      'type': 'activityGroup',
      'depth': 0
    }, {
      'id': 54,
      'rank': 0,
      'title': 'Very short (&lt; 5 seconds)',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 20
    }, {
      'id': 55,
      'rank': 1,
      'title': 'Short (&lt; 5 minutes)',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 20
    }, {
      'id': 56,
      'rank': 2,
      'title': 'Medium (5-10 minutes)',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 20
    }, {
      'id': 57,
      'rank': 3,
      'title': 'Long (&gt; 10 minutes)',
      'type': 'activity',
      'depth': 1,
      'activityGroup': 20
    }],
    'locations': [{
      'title': 'All',
      'id': 'all'
    }, {
      'id': 78,
      'title': '1st floor',
      'parent': 77,
      'description': '',
      'rank': 0,
      'depth': 0
    }, {
      'id': 79,
      'title': '2nd floor',
      'parent': 77,
      'description': '',
      'rank': 1,
      'depth': 0
    }, {
      'id': 124,
      'title': 'Lobby',
      'parent': 79,
      'description': '',
      'rank': 0,
      'depth': 1
    }, {
      'id': 83,
      'title': 'Ask Us',
      'parent': 79,
      'description': '',
      'rank': 1,
      'depth': 1
    }, {
      'id': 125,
      'title': 'Tech Showcase',
      'parent': 79,
      'description': '',
      'rank': 2,
      'depth': 1
    }, {
      'id': 84,
      'title': 'Rain Garden Reading Lounge',
      'parent': 79,
      'description': '',
      'rank': 3,
      'depth': 1
    }, {
      'id': 126,
      'title': 'Idea Alcove',
      'parent': 79,
      'description': '',
      'rank': 4,
      'depth': 1
    }, {
      'id': 85,
      'title': 'Quiet Reading Room',
      'parent': 79,
      'description': '',
      'rank': 5,
      'depth': 1
    }, {
      'id': 86,
      'title': 'Study Rooms',
      'parent': 79,
      'description': '',
      'rank': 6,
      'depth': 1
    }, {
      'id': 127,
      'title': 'Connective Spaces',
      'parent': 79,
      'description': '',
      'rank': 7,
      'depth': 1
    }, {
      'id': 80,
      'title': '3rd floor',
      'parent': 77,
      'description': '',
      'rank': 2,
      'depth': 0
    }, {
      'id': 87,
      'title': 'Learning Commons [3rd]',
      'parent': 80,
      'description': '',
      'rank': 0,
      'depth': 1
    }, {
      'id': 88,
      'title': 'Game Lab',
      'parent': 80,
      'description': '',
      'rank': 1,
      'depth': 1
    }, {
      'id': 89,
      'title': 'Study Rooms',
      'parent': 80,
      'description': '',
      'rank': 2,
      'depth': 1
    }, {
      'id': 137,
      'title': 'Presentation Practice ',
      'parent': 80,
      'description': '',
      'rank': 3,
      'depth': 1
    }, {
      'id': 101,
      'title': 'Media Rooms',
      'parent': 80,
      'description': '',
      'rank': 4,
      'depth': 1
    }, {
      'id': 81,
      'title': '4th floor',
      'parent': 77,
      'description': '',
      'rank': 3,
      'depth': 0
    }, {
      'id': 93,
      'title': 'Learning Commons [4th]',
      'parent': 81,
      'description': '',
      'rank': 0,
      'depth': 1
    }, {
      'id': 106,
      'title': 'Fishbowl',
      'parent': 81,
      'description': '',
      'rank': 1,
      'depth': 1
    }, {
      'id': 94,
      'title': 'Graduate Student Commons',
      'parent': 81,
      'description': '',
      'rank': 2,
      'depth': 1
    }, {
      'id': 113,
      'title': 'Graduate Student Commons Study Rooms',
      'parent': 81,
      'description': '',
      'rank': 3,
      'depth': 1
    }, {
      'id': 95,
      'title': 'Creativity Studio',
      'parent': 81,
      'description': '',
      'rank': 4,
      'depth': 1
    }, {
      'id': 96,
      'title': 'Teaching and Visualization Lab',
      'parent': 81,
      'description': '',
      'rank': 5,
      'depth': 1
    }, {
      'id': 138,
      'title': '4K Video Editing/Viewing Suite (4215)',
      'parent': 81,
      'description': '',
      'rank': 6,
      'depth': 1
    }, {
      'id': 139,
      'title': 'Green Screen Media Production Suite (4217)',
      'parent': 81,
      'description': '',
      'rank': 7,
      'depth': 1
    }, {
      'id': 97,
      'title': 'Media Production Rooms',
      'parent': 81,
      'description': '',
      'rank': 8,
      'depth': 1
    }, {
      'id': 98,
      'title': 'Study Rooms',
      'parent': 81,
      'description': '',
      'rank': 9,
      'depth': 1
    }, {
      'id': 99,
      'title': 'Makerspace',
      'parent': 81,
      'description': '',
      'rank': 10,
      'depth': 1
    }, {
      'id': 100,
      'title': 'Oval View Reading Lounge',
      'parent': 81,
      'description': '',
      'rank': 11,
      'depth': 1
    }, {
      'id': 102,
      'title': 'Music Rooms',
      'parent': 81,
      'description': '',
      'rank': 12,
      'depth': 1
    }, {
      'id': 103,
      'title': 'Usability Lab',
      'parent': 81,
      'description': '',
      'rank': 13,
      'depth': 1
    }, {
      'id': 104,
      'title': 'Video Seminar Room',
      'parent': 81,
      'description': '',
      'rank': 14,
      'depth': 1
    }, {
      'id': 128,
      'title': 'Connective Spaces',
      'parent': 81,
      'description': '',
      'rank': 15,
      'depth': 1
    }, {
      'id': 82,
      'title': '5th floor',
      'parent': 77,
      'description': '',
      'rank': 4,
      'depth': 0
    }, {
      'id': 90,
      'title': 'Skyline Reading Room',
      'parent': 82,
      'description': '',
      'rank': 0,
      'depth': 1
    }, {
      'id': 91,
      'title': 'Skyline Terrace',
      'parent': 82,
      'description': '',
      'rank': 1,
      'depth': 1
    }, {
      'id': 92,
      'title': 'Faculty Research Commons',
      'parent': 82,
      'description': '',
      'rank': 2,
      'depth': 1
    }]
  });