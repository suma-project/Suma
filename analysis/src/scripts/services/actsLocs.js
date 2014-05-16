'use strict';

angular.module('sumaAnalysis')
  .factory('actsLocs', function () {
    function calculateDepth (item, list, root, depth) {
      var parent;

      depth = depth || 0;
      if (parseInt(item.parent, 10) === parseInt(root, 10)) {
        return depth;
      }

      depth += 1;

      parent = _.find(list, {'id': item.parent});

      return calculateDepth(parent, list, root, depth);
    }

    function processActivities (activities, activityGroups) {
      var activityList = [];

      // Sort activities and activity groups
      activities = _.sortBy(activities, 'rank');
      activityGroups = _.sortBy(activityGroups, 'rank');

      // For each activity group, build a list of activities
      _.each(activityGroups, function (activityGroup) {
          // Add activity group metadata to activityGroupList array
         activityList.push({
            'id'   : activityGroup.id,
            'rank' : activityGroup.rank,
            'title': activityGroup.title,
            'type' : 'activityGroup',
            'depth': 0,
            'filter': 'allow',
            'enabled': true
          });

          // Loop over activities and add the ones belonging to the current activityGroup
          _.each(activities, function (activity) {
            if (activity.activityGroup === activityGroup.id) {
              // Add activities to activityList array behind proper activityGroup
              activityList.push({
                'id'   : activity.id,
                'rank' : activity.rank,
                'title': activity.title,
                'type' : 'activity',
                'depth': 1,
                'activityGroup': activityGroup.id,
                'filter': 'allow',
                'enabled': true
              });
            }
          });
        });

      return activityList;
    }

    function processLocations (locations, root) {
      return [{
        title: 'All',
        id: 'all'
      }].concat(_.map(locations, function (loc, index, list) {
        loc.depth = calculateDepth(loc, list, root);
        return loc;
      }));
    }

    return {
      get: function (init) {
        return {
          activities: processActivities(init.dictionary.activities, init.dictionary.activityGroups),
          locations: processLocations(init.dictionary.locations, init.rootLocation)
        };
      }
    };
  });
