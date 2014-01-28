'use strict';

angular.module('sumaAnalysis')
  .controller('ReportCtrl', function ($scope, $rootScope, $http, $location, $anchorScroll, $timeout, initiatives, actsLocs, data, promiseTracker, uiStates, sumaConfig, $routeParams, $q) {
    var tPromise;

    $scope.setDefaults = function () {
      // Form data
      _.each(sumaConfig.formData, function (e, i) {
        $scope[i] = e;
      });

      // Form defaults
      $scope.params = {};
      _.each(sumaConfig.formDefaults, function (e, i) {
        $scope.params[i] = $scope[e][0];
      });

      // Date defaults
      $scope.params.sdate = moment().subtract('months', 6).add('days', 1).format('YYYY-MM-DD');
      $scope.params.edate = moment().add('days', 1).format('YYYY-MM-DD');
    };

    $scope.setParams = function (p) {
      $scope.params.init = _.find($scope.inits, function (e, i) {
        return String(e.id) === String(p.id);
      });

      $scope.params.count = _.find($scope.countOptions, function (e, i) {
        return String(e.id) === String(p.count);
      });

      $scope.params.session_filter = _.find($scope.sessionOptions, function (e, i) {
        return String(e.id) === String(p.session_filter);
      });

      $scope.params.daygroup = _.find($scope.dayOptions, function (e, i) {
        return String(e.id) === String(p.daygroup);
      });

      $scope.getMetadata();

      $scope.params.activity = _.find($scope.activities, function (e, i) {
        return String(e.id) === String(p.activity);
      });

      $scope.params.location = _.find($scope.locations, function (e, i) {
        return String(e.id) === String(p.location);
      });

      $scope.params.sdate = p.sdate;
      $scope.params.edate = p.edate;
      $scope.params.stime = p.stime ? p.stime : '';
      $scope.params.etime = p.etime ? p.etime : '';
    };

    $scope.setUrl = function () {
      $location.search({
        id: $scope.params.init.id,
        edate: $scope.params.edate,
        sdate: $scope.params.sdate,
        count: $scope.params.count ? $scope.params.count.id : null,
        session_filter: $scope.params.session_filter ? $scope.params.session_filter.id : null,
        stime: $scope.params.stime || '',
        etime: $scope.params.etime || '',
        activity: $scope.params.activity ? $scope.params.activity.id : null,
        location: $scope.params.location ? $scope.params.location.id : null,
        daygroup: $scope.params.daygroup ? $scope.params.daygroup.id : null
      });
    };

    $scope.initialize = function () {
      var p1 = $location.search();

      // UI State
      if (_.isEmpty(p1)) {
        $scope.state = uiStates.setUIState('initial');
      }

      // Set defaults
      $scope.setDefaults();

      // Get inits on load
      $scope.loadInits = initiatives.get().then(function (data) {
        $scope.inits = data;

        if (!_.isEmpty(p1)) {
          $scope.setParams(p1);
          $scope.submit()
        }
      }, $scope.error);

      // Setup promise tracker for spinner on initial load
      // $scope.finder = promiseTracker('initTracker');
      // $scope.finder.addPromise($scope.loadInits);

      // Attach listener for routeUpdate
      $scope.$on('$routeUpdate', $scope.routeUpdate);
    };

    $scope.routeUpdate = function () {
      var p = $location.search();

      if (tPromise) {
        tPromise.resolve();
      }
      // Check for no params. Occurs when going back in history
      // to original page with no params in URL. Initial page
      // load with no params doesn't call routeUpdate

      if (_.isEmpty(p)) {
        $scope.state = uiStates.setUIState('initial');
        $scope.setDefaults();
      } else {
        $scope.setParams(p);
        $scope.submit();
      }
    };

    // Handle anchor links
    $scope.scrollTo = function (id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      // Reset to old to suppress routing logic
      $location.hash(old);
    };

    $scope.getMetadata = function () {
      $scope.actsLocs = actsLocs.get($scope.params.init);

      $scope.activities = $scope.actsLocs.activities;
      $scope.locations = $scope.actsLocs.locations;

      $scope.params.activity = $scope.actsLocs.activities[0];
      $scope.params.location = $scope.actsLocs.locations[0];
    };

    // Get Initiative Metadata
    $scope.updateMetadata = function () {
      if ($scope.params.init) {
        $scope.processMetadata = true;

        $scope.getMetadata();

        // Artificially add a delay for UI
        $timeout(function () {
          $scope.processMetadata = false;
        }, 400);
      }
    };

    $scope.error = function (data) {
      $scope.state = uiStates.setUIState('error');
      $scope.errorMessage = data.message;
      $scope.errorCode = data.code;
    };

    $scope.success = function (processedData) {
      $scope.data = processedData;

      if (sumaConfig.suppWatch) {
        $scope.$watch('data.actsLocsData', function () {
          var index = _.findIndex($scope.data.actsLocsData.items, function (item) {
            return item.title === $scope.data.barChartData.title;
          });

          $scope.data.barChartData = $scope.data.actsLocsData.items[index];
        });
      }

      $scope.state = uiStates.setUIState('success');

      $scope.setUrl();
    };

    // Submit Form and Draw Chart
    $scope.submit = function () {
      tPromise = $q.defer();

      $scope.state = uiStates.setUIState('loading');
      data[sumaConfig.dataSource]($scope.params, $scope.activities, $scope.locations, sumaConfig.dataProcessor, tPromise)
        .then($scope.success, $scope.error);
    };

    $scope.initialize();
  });
