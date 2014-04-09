'use strict';

angular.module('sumaAnalysis')
  .factory('processTimeSeriesData', function ($q, $rootScope) {
    var weekdays = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };

    function calcPct(count, total) {
      var pct = count / total * 100;

      return _.isNaN(pct) ? 0 : pct.toFixed(2);
    }

    function calcCount(obj, coll, prop) {
      var hasChildren;

      hasChildren = _.filter(coll, function (item) {
        if (prop === 'activityGroup') {
          return obj.id === item[prop] && obj.type === 'activityGroup';
        }

        return obj.id === item[prop];
      });

      if (hasChildren.length < 1) {
        return obj.count;
      }

      return _.reduce(_.map(hasChildren, function (o) {
        return calcCount(o, coll, prop);
      }), function (sum, num) {
        return sum + num;
      });
    }

    function buildArray (source, response, total, trunc, pct) {
      return _.filter(_.map(_.cloneDeep(source), function (o) {
        o.name = o.title;

        if (trunc) {
          o.count = _.isNumber(response[o.id]) ? response[o.id].toFixed(2) : null;
        } else {
          if (o.type === 'activityGroup') {
            o.count = null;
          } else {
            o.count = _.isNumber(response[o.id]) ? response[o.id] : null;
          }
        }

        if (o.count !== null) {
          o.percent = calcPct(o.count, total);
        } else {
          o.percent = null;
        }

        if (pct) {
          o.count = o.percent;
        }

        return o;
      }), function (obj) {
        return obj.count !== null;
      });
    }

    function buildTableArray (source, response, total, flag) {
      var counts;

      counts = _.filter(_.map(_.cloneDeep(source), function (loc) {
        loc.name = loc.title;
        loc.count = _.isNumber(response[loc.id]) ? response[loc.id] : null;
        return loc;
      }), function (obj) {
        return obj.count !== null;
      });

      // Calculate counts for children
      return _.map(counts, function (loc, index, coll) {
        loc.count = calcCount(loc, coll, flag);
        loc.percent = calcPct(loc.count, total);

        return loc;
      });
    }

    function insertNoActs (source, total, mode) {
      var obj = {},
        noActs;

      noActs = _.find(source, function (item, key) {
        return key === '_No Activity';
      });

      if (noActs) {
        obj.name = 'No Activity';
        obj.depth = 0;

        obj.percent = (noActs / total * 100).toFixed(2);

        if (mode === 'pct') {
          obj.count = (noActs / total * 100).toFixed(2);
        }

        if (mode === 'sum') {
          obj.count = noActs;
        }

        if (mode === 'avg') {
          obj.count = noActs.toFixed(2);
        }

        return obj;
      }

      return false;
    }

    function processData (response, activities, locations) {
      var noActsSum,
        noActsAvgSum,
        noActsAvgAvg,
        counts;

      // Convert response into arrays of objects
      counts = {};

      // CSV
      counts.csv = response.csv;

      // Total Sum
      counts.total = [{
        count : response.total
      }];

      // Total Avg Sum
      counts.totalAvgSum = [{
        count: response.totalAvgSum
      }];

      // Total AvgAvg
      counts.totalAvgAvg = [{
        count: response.totalAvgAvg
      }];

      // Locations related data
      counts.locationsTable = buildTableArray(locations, response.locationsSum, response.total, 'parent');
      counts.locationsSum = buildArray(locations, response.locationsSum, response.total);
      counts.locationsAvgSum = buildArray(locations, response.locationsAvgSum, response.total, true);
      counts.locationsAvgAvg = buildArray(locations, response.locationsAvgAvg, response.total, true);
      counts.locationsPct = buildArray(locations, response.locationsSum, response.total, false, true);

      // Activities related data
      counts.activitiesTable = buildTableArray(activities, response.activitiesSum, response.total, 'activityGroup');
      counts.activitiesSum = buildArray(activities, response.activitiesSum, response.total);
      counts.activitiesAvgSum = buildArray(activities, response.activitiesAvgSum, response.total, true);
      counts.activitiesAvgAvg = buildArray(activities, response.activitiesAvgAvg, response.total, true);
      counts.activitiesPct = buildArray(activities, response.activitiesSum, response.total, false, true);

      // Handle insertion of no activity values
      noActsSum = insertNoActs(response.activitiesSum, response.total, 'sum');
      if (noActsSum) {
        counts.activitiesSum.push(noActsSum);
        counts.activitiesTable.push(noActsSum);
        counts.activitiesPct.push(insertNoActs(response.activitiesSum, response.total, 'pct'));
      }

      noActsAvgSum = insertNoActs(response.activitiesAvgSum, response.total, 'avg');
      if (noActsAvgSum) {
        counts.activitiesAvgSum.push(noActsAvgSum);
      }

      noActsAvgAvg = insertNoActs(response.activitiesAvgAvg, response.total, 'avg');
      if (noActsAvgAvg) {
        counts.activitiesAvgAvg.push(noActsAvgAvg);
      }

      // Period Sum
      counts.periodSum = _.sortBy(_.map(response.periodSum, function (element, index) {
        return {
          date: index,
          count: element.count
        };
      }), function (item) {
        return new Date(item.date).getTime();
      });

      // Period Avg
      counts.periodAvg = _.sortBy(_.map(response.periodAvg, function (element, index) {
        return {
          date: index,
          count: element.count
        };
      }), function (item) {
        return new Date(item.date).getTime();
      });

      // Hourly Summary
      counts.hourlySummary = _.filter(_.map(_.cloneDeep(response.hourSummary), function (element, index) {
        return {
          name: index,
          count: element,
          percent: calcPct(element, response.total)
        };
      }), function (hour) {
        return hour.count !== null;
      });

      // Day of Week Summary
      counts.dayOfWeekSummary = _.sortBy(_.map(response.weekdaySummary, function (element, index) {
        return {
          name: index,
          count: element,
          percent: calcPct(element, response.total)
        };
      }), function (item) {
        return weekdays[item.name];
      });

      // Month Summary
      counts.monthSummary = _.sortBy(_.flatten(_.map(response.monthSummary, function (months, year) {
        return _.map(months, function (count, month) {
          return {
            date: month + ' ' + '1' + ', ' + year,
            name: month + ' ' + year,
            count: count,
            percent: calcPct(count, response.total)
          };
        });
      })), function (item) {
        return new Date(item.date).getTime();
      });

      // Year Summary
      counts.yearSummary = _.sortBy(_.map(response.yearSummary, function (element, index) {
        return {
          name: index,
          count: element,
          percent: calcPct(element, response.total)
        };
      }), function (item) {
        return item.name;
      });

      counts.timeSeriesOptions = [
        {title: 'Daily Avg', val: 'avg', data: counts.periodAvg},
        {title: 'Daily Sum', val: 'sum', data: counts.periodSum}
      ];

      counts.timeSeriesData = counts.timeSeriesOptions[1];

      counts.actsLocsOptions = [
        {title: 'Activities', val: 'activities', items: [
          {title: 'Avg of Sum', data: counts.activitiesAvgSum},
          {title: 'Avg of Avg', data: counts.activitiesAvgAvg},
          {title: 'Sum', data: counts.activitiesSum},
          {title: 'Pct', data: counts.activitiesPct}
        ]},
        {title: 'Locations', val: 'locations', items: [
          {title: 'Avg of Sum', data: counts.locationsAvgSum},
          {title: 'Avg of Avg', data: counts.locationsAvgAvg},
          {title: 'Sum', data: counts.locationsSum},
          {title: 'Pct', data: counts.locationsPct}
        ]}
      ];

      counts.actsLocsData = counts.actsLocsOptions[1];

      counts.barChartData = counts.actsLocsData.items[2];

      return counts;
    }

    return {
      get: function (response, acts, locs) {
        var dfd = $q.defer();

        acts = _.filter(acts, function (act) {
          return act.id !== 'all';
        });

        locs = _.filter(locs, function (loc) {
          return loc.id !== 'all';
        });

        dfd.resolve(processData(response, acts, locs));

        return dfd.promise;
      }
    };
  });
