'use strict';

angular.module('sumaAnalysis')
  .factory('processTimeSeriesData', function ($q, $rootScope) {
    var weekdays = {
      Sunday   : 0,
      Monday   : 1,
      Tuesday  : 2,
      Wednesday: 3,
      Thursday : 4,
      Friday   : 5,
      Saturday : 6
    };

    // Calculate percentage based on number and divisor
    function calcPct(count, total) {
      var pct = count / total * 100;
      return _.isNaN(pct) ? 0 : pct.toFixed(2);
    }

    // Get counts of children recursively
    function calcCount(obj, coll, prop) {
      var chldrn,
          chldrnCnts;

      // Get children of loc/act
      chldrn = _.filter(coll, function (item) {
        if (prop === 'activityGroup') {
          return obj.id === item[prop] && obj.type === 'activityGroup';
        }

        return obj.id === item[prop];
      });

      // Stop recursion if no children
      if (chldrn.length < 1) {
        return obj.count;
      }

      // Get counts for children
      chldrnCnts = _.map(chldrn, function (o) {
        return calcCount(o, coll, prop);
      });

      // Add self count to array
      chldrnCnts.push(obj.count);

      // Reduce to single value
      return _.reduce(chldrnCnts, function (sum, num) {
        return sum + num;
      });
    }

    // Build array for locations/activities bar chart
    function buildArray (source, response, total, trunc, pct, cullNull) {
      return _.filter(_.map(_.cloneDeep(source), function (o) {
        o.name = o.title;

        // Truncate flag
        if (trunc) {
            o.count = _.isNumber(response[o.id]) ? response[o.id].toFixed(2) : null;
        } else {
            o.count = _.isNumber(response[o.id]) ? response[o.id] : null;
        }

        // Percentage flag
        if (pct) {
          if (cullNull && o.count === null) {
            o.count = null;
          } else {
            o.count = calcPct(o.count, total);
          }
        }

        return o;
      }), function (obj) {
        return obj.type !== 'activityGroup' && obj.count !== null;
      });
    }

    // Build array for locations/activities table
    function buildTableArray (source, response, total, prop) {
      var counts;

      counts = _.map(_.cloneDeep(source), function (o) {
        o.name = o.title;

        if (o.type === 'activityGroup') {
          o.count = 0;
        } else {
          o.count = _.isNumber(response[o.id]) ? response[o.id] : 0;
        }

        return o;
      });

      // Calculate counts for children
      return _.map(counts, function (o, index, coll) {
        o.count = calcCount(o, coll, prop);
        o.percent = calcPct(o.count, total);
        return o;
      });
    }

    function processData (response, activities, locations, params) {
      var counts,
        divisor;

      // Convert response into arrays of objects
      counts = {};

      // Configure divisor for avg/pct calculations
      if (params.zeroCounts.id === 'no') {
        divisor = response.total;
      } else {
        divisor = response.zeroDivisor;
      }

      // CSV
      counts.csv = response.csv;

      // Total Sum
      counts.total = response.total;

      // Total Counts
      counts.totalCounts = response.zeroDivisor;

      // Total Zero Counts
      counts.totalZeroCounts = response.zeroCounts;

      // Total Avg Sum
      counts.totalAvgSum = response.totalAvgSum;

      // Total AvgAvg
      counts.totalAvgAvg = response.totalAvgAvg;

      // Days with Observations
      counts.daysWithObservations = response.daysWithObservations;

      // Locations related data
      counts.locationsTable  = buildTableArray(locations, response.locationsSum, divisor, 'parent');
      counts.locationsSum    = buildArray(locations, response.locationsSum, divisor);
      counts.locationsAvgSum = buildArray(locations, response.locationsAvgSum, divisor, true);
      counts.locationsAvgAvg = buildArray(locations, response.locationsAvgAvg, divisor, true);
      counts.locationsPct    = buildArray(locations, response.locationsSum, divisor, false, true, true);

      // Activities related data
      counts.activitiesTable  = buildTableArray(activities, response.activitiesSum, response.total, 'activityGroup');
      counts.activitiesSum    = buildArray(activities, response.activitiesSum, response.total);
      counts.activitiesAvgSum = buildArray(activities, response.activitiesAvgSum, response.total, true);
      counts.activitiesAvgAvg = buildArray(activities, response.activitiesAvgAvg, response.total, true);
      counts.activitiesPct    = buildArray(activities, response.activitiesSum, response.total, false, true, true);

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
      counts.hourlySummary = _.filter(_.sortBy(_.map(_.cloneDeep(response.hourSummary), function (element, index) {
        return {
          name: index,
          count: element,
          percent: calcPct(element, divisor)
        };
      }), function (hour) {
          // Sort so startHour is first hour listed
          if (hour.name < parseInt(params.startHour.id.slice(0, 2), 10)) {
            return hour.name + 24;
          } else {
            return hour.name;
          }
      }), function (hour) {
        // Strip hours without data
        return hour.count !== null;
      });

      // Day of Week Summary
      counts.dayOfWeekSummary = _.sortBy(_.map(response.weekdaySummary, function (element, index) {
        return {
          name: index,
          count: element.total,
          avg: element.avg,
          percent: calcPct(element.total, divisor)
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
            percent: calcPct(count, divisor)
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
          percent: calcPct(element, divisor)
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
          {title: 'Sum',        data: counts.activitiesSum},
          {title: 'Pct',        data: counts.activitiesPct}
        ]},
        {title: 'Locations', val: 'locations', items: [
          {title: 'Avg of Sum', data: counts.locationsAvgSum},
          {title: 'Avg of Avg', data: counts.locationsAvgAvg},
          {title: 'Sum',        data: counts.locationsSum},
          {title: 'Pct',        data: counts.locationsPct}
        ]}
      ];

      counts.actsLocsData = counts.actsLocsOptions[1];

      counts.barChartData = counts.actsLocsData.items[2];

      return counts;
    }

    return {
      get: function (response, acts, locs, params) {
        var dfd = $q.defer();

        dfd.resolve(processData(response, acts, locs, params));

        return dfd.promise;
      }
    };
  });
