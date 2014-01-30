'use strict';

angular.module('sumaAnalysis')
  .controller('ReportCtrl', function ($scope, $rootScope, $http, $location, $anchorScroll, $timeout, initiatives, actsLocs, data, promiseTracker, uiStates, sumaConfig, $routeParams, $q) {
    $scope.dataTimeoutPromise;
    $scope.initTimeoutPromise;
    $scope.paramsSet = false;

    // Initialize controller
    $scope.initialize = function () {
      var urlParams = $location.search();

      // UI State
      if (_.isEmpty(urlParams)) {
        $scope.state = uiStates.setUIState('initial');
      }

      // Set defaults
      $scope.setDefaults();

      // Fetch inits
      $scope.getInitiatives(urlParams);

      // Attach listener for routeUpdate
      $scope.$on('$routeUpdate', $scope.routeUpdate);
    };

    // Set default form values
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

    // Set scope.params based on urlParams
    $scope.setParams = function (p) {
      $scope.params.init = _.find($scope.inits, function (e, i) {
        return String(e.id) === String(p.id);
      });

      $scope.params.count = _.find($scope.countOptions, function (e, i) {
        return String(e.id) === String(p.count);
      }) || $scope.countOptions[0];

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

    // Attach params to URL
    $scope.setUrl = function () {
      $scope.paramsSet = true;

      $location.search({
        id: $scope.params.init.id,
        sdate: $scope.params.sdate,
        edate: $scope.params.edate,
        stime: $scope.params.stime || '',
        etime: $scope.params.etime || '',
        count: $scope.params.count ? $scope.params.count.id : null,
        session_filter: $scope.params.session_filter ? $scope.params.session_filter.id : null,
        activity: $scope.params.activity ? $scope.params.activity.id : null,
        location: $scope.params.location ? $scope.params.location.id : null,
        daygroup: $scope.params.daygroup ? $scope.params.daygroup.id : null
      });
    };

    // Get initiatives
    $scope.getInitiatives = function (urlParams) {
      $scope.initTimeoutPromise = $q.defer();

      $scope.loadInits = initiatives.get($scope.initTimeoutPromise).then(function (data) {
        $scope.inits = data;

        if (!_.isEmpty(urlParams)) {
          $scope.setParams(urlParams);
          $scope.getData();
        }
      }, $scope.error);

      // Setup promise tracker for spinner on initial load
      $scope.finder = promiseTracker('initTracker');
      $scope.finder.addPromise($scope.loadInits);
    };

    // Get initiative metadata
    $scope.getMetadata = function () {
      $scope.actsLocs = actsLocs.get($scope.params.init);

      $scope.activities = $scope.actsLocs.activities;
      $scope.locations = $scope.actsLocs.locations;

      $scope.params.activity = $scope.actsLocs.activities[0];
      $scope.params.location = $scope.actsLocs.locations[0];
    };

    // Update metadata UI wrapper
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

    // Submit request and draw chart
    $scope.getData = function () {
      $scope.dataTimeoutPromise = $q.defer();
      $scope.state = uiStates.setUIState('loading');

      data[sumaConfig.dataSource]($scope.params, $scope.activities, $scope.locations, sumaConfig.dataProcessor, $scope.dataTimeoutPromise)
        .then($scope.success, $scope.error);
    };

    // Respond to routeUpdate event
    $scope.routeUpdate = function () {
      var urlParams = $location.search();

      // Resolve active requests
      if ($scope.dataTimeoutPromise) {
        $scope.dataTimeoutPromise.resolve();
      }

      if ($scope.initTimeoutPromise) {
        $scope.initTimeoutPromise.resolve();
        $scope.finder.cancel();
      }

      if (_.isEmpty(urlParams)) { // True when navigating back to initial
        $scope.state = uiStates.setUIState('initial');
        $scope.setDefaults();
      } else if ($scope.params.init){ // Typical navigation between reports and default "submit"
        if (!$scope.paramsSet) {
          $scope.setParams(urlParams);
        }
        $scope.paramsSet = false;
        $scope.getData();
      } else { // Navigation from initial to completed report
        $scope.getInitiatives(urlParams);
      }
    };

    // Display error message
    $scope.error = function (data) {
      if (!data.timeout) {
        $scope.state = uiStates.setUIState('error');
        $scope.errorMessage = data.message;
        $scope.errorCode = data.code;
      }
    };

    // Assign data to scope and set state
    $scope.success = function (processedData) {
      $scope.state = uiStates.setUIState('success');
      $scope.data = processedData;

      if (sumaConfig.suppWatch) {
        $scope.$watch('data.actsLocsData', function () {
          var index = _.findIndex($scope.data.actsLocsData.items, function (item) {
            return item.title === $scope.data.barChartData.title;
          });

          $scope.data.barChartData = $scope.data.actsLocsData.items[index];
        });
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

    $scope.initialize();
  });
