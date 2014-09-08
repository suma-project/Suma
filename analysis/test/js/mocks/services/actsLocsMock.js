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
      'activities': [{'id':48,'title':'Print/Copy','rank':0,'description':'','activityGroup':18},{'id':52,'title':'In-person','rank':0,'description':'','activityGroup':19},{'id':54,'title':'Very short (&lt; 5 seconds)','rank':0,'description':'','activityGroup':20},{'id':49,'title':'Reference','rank':1,'description':'','activityGroup':18},{'id':53,'title':'Phone','rank':1,'description':'','activityGroup':19},{'id':55,'title':'Short (&lt; 5 minutes)','rank':1,'description':'','activityGroup':20},{'id':50,'title':'Directional','rank':2,'description':'','activityGroup':18},{'id':58,'title':'Roaming','rank':2,'description':'','activityGroup':19},{'id':56,'title':'Medium (5-10 minutes)','rank':2,'description':'','activityGroup':20},{'id':51,'title':'Computing','rank':3,'description':'','activityGroup':18},{'id':57,'title':'Long (&gt; 10 minutes)','rank':3,'description':'','activityGroup':20},{'id':-1,'title':'No Activity','rank':0,'description':'','activityGroup':-2}],
      'activityGroups': [{'id':18,'title':'Type','rank':0,'description':'','required':true,'allowMulti':false},{'id':19,'title':'Medium','rank':1,'description':'','required':true,'allowMulti':false},{'id':20,'title':'Time','rank':2,'description':'','required':true,'allowMulti':false},{'id':-2,'title':'No Activity','rank':9999,'description':'','required':false,'allowedMulti':false}]
    }
  }).value('processedActsLocs', {'activities':[{'id':18,'rank':0,'title':'Type','type':'activityGroup','depth':0,'filter':'allow','enabled':true},{'id':48,'rank':0,'title':'Print/Copy','type':'activity','depth':1,'activityGroup':18,'activityGroupTitle':'Type','tooltipTitle':'Type: Print/Copy','altName':'Type: Print/Copy','filter':'allow','enabled':true},{'id':49,'rank':1,'title':'Reference','type':'activity','depth':1,'activityGroup':18,'activityGroupTitle':'Type','tooltipTitle':'Type: Reference','altName':'Type: Reference','filter':'allow','enabled':true},{'id':50,'rank':2,'title':'Directional','type':'activity','depth':1,'activityGroup':18,'activityGroupTitle':'Type','tooltipTitle':'Type: Directional','altName':'Type: Directional','filter':'allow','enabled':true},{'id':51,'rank':3,'title':'Computing','type':'activity','depth':1,'activityGroup':18,'activityGroupTitle':'Type','tooltipTitle':'Type: Computing','altName':'Type: Computing','filter':'allow','enabled':true},{'id':19,'rank':1,'title':'Medium','type':'activityGroup','depth':0,'filter':'allow','enabled':true},{'id':52,'rank':0,'title':'In-person','type':'activity','depth':1,'activityGroup':19,'activityGroupTitle':'Medium','tooltipTitle':'Medium: In-person','altName':'Medium: In-person','filter':'allow','enabled':true},{'id':53,'rank':1,'title':'Phone','type':'activity','depth':1,'activityGroup':19,'activityGroupTitle':'Medium','tooltipTitle':'Medium: Phone','altName':'Medium: Phone','filter':'allow','enabled':true},{'id':58,'rank':2,'title':'Roaming','type':'activity','depth':1,'activityGroup':19,'activityGroupTitle':'Medium','tooltipTitle':'Medium: Roaming','altName':'Medium: Roaming','filter':'allow','enabled':true},{'id':20,'rank':2,'title':'Time','type':'activityGroup','depth':0,'filter':'allow','enabled':true},{'id':54,'rank':0,'title':'Very short (&lt; 5 seconds)','type':'activity','depth':1,'activityGroup':20,'activityGroupTitle':'Time','tooltipTitle':'Time: Very short (&lt; 5 seconds)','altName':'Time: Very short (&lt; 5 seconds)','filter':'allow','enabled':true},{'id':55,'rank':1,'title':'Short (&lt; 5 minutes)','type':'activity','depth':1,'activityGroup':20,'activityGroupTitle':'Time','tooltipTitle':'Time: Short (&lt; 5 minutes)','altName':'Time: Short (&lt; 5 minutes)','filter':'allow','enabled':true},{'id':56,'rank':2,'title':'Medium (5-10 minutes)','type':'activity','depth':1,'activityGroup':20,'activityGroupTitle':'Time','tooltipTitle':'Time: Medium (5-10 minutes)','altName':'Time: Medium (5-10 minutes)','filter':'allow','enabled':true},{'id':57,'rank':3,'title':'Long (&gt; 10 minutes)','type':'activity','depth':1,'activityGroup':20,'activityGroupTitle':'Time','tooltipTitle':'Time: Long (&gt; 10 minutes)','altName':'Time: Long (&gt; 10 minutes)','filter':'allow','enabled':true},{'id':-2,'rank':9999,'title':'No Activity','type':'activityGroup','depth':0,'filter':'allow','enabled':true},{'id':-1,'rank':0,'title':'No Activity','type':'activity','depth':1,'activityGroup':-2,'activityGroupTitle':'No Activity','tooltipTitle':'No Activity: No Activity','altName':'No Activity: No Activity','filter':'allow','enabled':true}],'locations':[{'id':78,'title':'1st floor','parent':77,'description':'','rank':0,'depth':0,'tooltipTitle':'1st floor','ancestors':[],'filter':true,'enabled':true},{'id':79,'title':'2nd floor','parent':77,'description':'','rank':1,'depth':0,'tooltipTitle':'2nd floor','ancestors':[],'filter':true,'enabled':true},{'id':124,'title':'Lobby','parent':79,'description':'','rank':0,'depth':1,'tooltipTitle':'2nd floor: Lobby','ancestors':[79],'filter':true,'enabled':true},{'id':83,'title':'Ask Us','parent':79,'description':'','rank':1,'depth':1,'tooltipTitle':'2nd floor: Ask Us','ancestors':[79],'filter':true,'enabled':true},{'id':125,'title':'Tech Showcase','parent':79,'description':'','rank':2,'depth':1,'tooltipTitle':'2nd floor: Tech Showcase','ancestors':[79],'filter':true,'enabled':true},{'id':84,'title':'Rain Garden Reading Lounge','parent':79,'description':'','rank':3,'depth':1,'tooltipTitle':'2nd floor: Rain Garden Reading Lounge','ancestors':[79],'filter':true,'enabled':true},{'id':126,'title':'Idea Alcove','parent':79,'description':'','rank':4,'depth':1,'tooltipTitle':'2nd floor: Idea Alcove','ancestors':[79],'filter':true,'enabled':true},{'id':85,'title':'Quiet Reading Room','parent':79,'description':'','rank':5,'depth':1,'tooltipTitle':'2nd floor: Quiet Reading Room','ancestors':[79],'filter':true,'enabled':true},{'id':86,'title':'Study Rooms','parent':79,'description':'','rank':6,'depth':1,'tooltipTitle':'2nd floor: Study Rooms','ancestors':[79],'filter':true,'enabled':true},{'id':127,'title':'Connective Spaces','parent':79,'description':'','rank':7,'depth':1,'tooltipTitle':'2nd floor: Connective Spaces','ancestors':[79],'filter':true,'enabled':true},{'id':80,'title':'3rd floor','parent':77,'description':'','rank':2,'depth':0,'tooltipTitle':'3rd floor','ancestors':[],'filter':true,'enabled':true},{'id':87,'title':'Learning Commons [3rd]','parent':80,'description':'','rank':0,'depth':1,'tooltipTitle':'3rd floor: Learning Commons [3rd]','ancestors':[80],'filter':true,'enabled':true},{'id':88,'title':'Game Lab','parent':80,'description':'','rank':1,'depth':1,'tooltipTitle':'3rd floor: Game Lab','ancestors':[80],'filter':true,'enabled':true},{'id':89,'title':'Study Rooms','parent':80,'description':'','rank':2,'depth':1,'tooltipTitle':'3rd floor: Study Rooms','ancestors':[80],'filter':true,'enabled':true},{'id':137,'title':'Presentation Practice ','parent':80,'description':'','rank':3,'depth':1,'tooltipTitle':'3rd floor: Presentation Practice ','ancestors':[80],'filter':true,'enabled':true},{'id':101,'title':'Media Rooms','parent':80,'description':'','rank':4,'depth':1,'tooltipTitle':'3rd floor: Media Rooms','ancestors':[80],'filter':true,'enabled':true},{'id':81,'title':'4th floor','parent':77,'description':'','rank':3,'depth':0,'tooltipTitle':'4th floor','ancestors':[],'filter':true,'enabled':true},{'id':93,'title':'Learning Commons [4th]','parent':81,'description':'','rank':0,'depth':1,'tooltipTitle':'4th floor: Learning Commons [4th]','ancestors':[81],'filter':true,'enabled':true},{'id':106,'title':'Fishbowl','parent':81,'description':'','rank':1,'depth':1,'tooltipTitle':'4th floor: Fishbowl','ancestors':[81],'filter':true,'enabled':true},{'id':94,'title':'Graduate Student Commons','parent':81,'description':'','rank':2,'depth':1,'tooltipTitle':'4th floor: Graduate Student Commons','ancestors':[81],'filter':true,'enabled':true},{'id':113,'title':'Graduate Student Commons Study Rooms','parent':81,'description':'','rank':3,'depth':1,'tooltipTitle':'4th floor: Graduate Student Commons Study Rooms','ancestors':[81],'filter':true,'enabled':true},{'id':95,'title':'Creativity Studio','parent':81,'description':'','rank':4,'depth':1,'tooltipTitle':'4th floor: Creativity Studio','ancestors':[81],'filter':true,'enabled':true},{'id':96,'title':'Teaching and Visualization Lab','parent':81,'description':'','rank':5,'depth':1,'tooltipTitle':'4th floor: Teaching and Visualization Lab','ancestors':[81],'filter':true,'enabled':true},{'id':138,'title':'4K Video Editing/Viewing Suite (4215)','parent':81,'description':'','rank':6,'depth':1,'tooltipTitle':'4th floor: 4K Video Editing/Viewing Suite (4215)','ancestors':[81],'filter':true,'enabled':true},{'id':139,'title':'Green Screen Media Production Suite (4217)','parent':81,'description':'','rank':7,'depth':1,'tooltipTitle':'4th floor: Green Screen Media Production Suite (4217)','ancestors':[81],'filter':true,'enabled':true},{'id':97,'title':'Media Production Rooms','parent':81,'description':'','rank':8,'depth':1,'tooltipTitle':'4th floor: Media Production Rooms','ancestors':[81],'filter':true,'enabled':true},{'id':98,'title':'Study Rooms','parent':81,'description':'','rank':9,'depth':1,'tooltipTitle':'4th floor: Study Rooms','ancestors':[81],'filter':true,'enabled':true},{'id':99,'title':'Makerspace','parent':81,'description':'','rank':10,'depth':1,'tooltipTitle':'4th floor: Makerspace','ancestors':[81],'filter':true,'enabled':true},{'id':100,'title':'Oval View Reading Lounge','parent':81,'description':'','rank':11,'depth':1,'tooltipTitle':'4th floor: Oval View Reading Lounge','ancestors':[81],'filter':true,'enabled':true},{'id':102,'title':'Music Rooms','parent':81,'description':'','rank':12,'depth':1,'tooltipTitle':'4th floor: Music Rooms','ancestors':[81],'filter':true,'enabled':true},{'id':103,'title':'Usability Lab','parent':81,'description':'','rank':13,'depth':1,'tooltipTitle':'4th floor: Usability Lab','ancestors':[81],'filter':true,'enabled':true},{'id':104,'title':'Video Seminar Room','parent':81,'description':'','rank':14,'depth':1,'tooltipTitle':'4th floor: Video Seminar Room','ancestors':[81],'filter':true,'enabled':true},{'id':128,'title':'Connective Spaces','parent':81,'description':'','rank':15,'depth':1,'tooltipTitle':'4th floor: Connective Spaces','ancestors':[81],'filter':true,'enabled':true},{'id':82,'title':'5th floor','parent':77,'description':'','rank':4,'depth':0,'tooltipTitle':'5th floor','ancestors':[],'filter':true,'enabled':true},{'id':90,'title':'Skyline Reading Room','parent':82,'description':'','rank':0,'depth':1,'tooltipTitle':'5th floor: Skyline Reading Room','ancestors':[82],'filter':true,'enabled':true},{'id':91,'title':'Skyline Terrace','parent':82,'description':'','rank':1,'depth':1,'tooltipTitle':'5th floor: Skyline Terrace','ancestors':[82],'filter':true,'enabled':true},{'id':92,'title':'Faculty Research Commons','parent':82,'description':'','rank':2,'depth':1,'tooltipTitle':'5th floor: Faculty Research Commons','ancestors':[82],'filter':true,'enabled':true}]});