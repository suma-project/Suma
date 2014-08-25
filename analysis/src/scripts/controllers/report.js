'use strict';

angular.module('sumaAnalysis')
  .controller('ReportCtrl', function ($anchorScroll, $location, $q, $scope, $timeout, promiseTracker, actsLocs, data, initiatives, scopeUtils, sumaConfig, uiStates) {
    // Initialize controller
    $scope.initialize = function () {
      var urlParams = $location.search();

      // Get report specific configs
      $scope.sumaConfig = sumaConfig.getConfig($location.path());

      // Set default scope values from config
      $scope.setDefaults();

      // Attach listener for URL changes
      $scope.$on('$routeUpdate', $scope.routeUpdate);

      // Get initiatives
      $scope.getInitiatives().then(function () {
        // None bookmark navigation
        if (_.isEmpty(urlParams)) {
          $scope.state = uiStates.setUIState('initial');
        } else {
          // Bookmark navigation
          $scope.setScope(urlParams).then($scope.getData, $scope.error);
        }
      });
    };

    // Set default form values
    $scope.setDefaults = function () {
      $scope.params = sumaConfig.setParams($scope.sumaConfig);
    };

    // Set scope.params based on urlParams
    $scope.setScope = function (urlParams) {
      var dfd = $q.defer();

      scopeUtils.set(urlParams, $scope.sumaConfig, $scope.inits).then(function (response) {
        // Set scope where possible regardless of error
        $scope.actsLocs = response.actsLocs;
        $scope.activities = response.activities;
        $scope.locations = response.locations;
        $scope.params = response.params;

        // Partial success
        if (response.errorMessage) {
          dfd.reject({message: response.errorMessage, code: 500});
        } else {
          // Fully successful
          dfd.resolve();
        }
      }, function (response) {
        dfd.reject({message: response.errorMessage, code: 500});
      });

      return dfd.promise;
    };

    // Get initiatives
    $scope.getInitiatives = function () {
      var cfg,
          dfd = $q.defer();

      // Promise to resolve request on navigation change
      $scope.initTimeoutPromise = $q.defer();

      // Promise/Explicit timeouts
      cfg = {
        timeoutPromise: $scope.initTimeoutPromise,
        timeout: 180000
      };

      $scope.loadInits = initiatives.get(cfg).then(function (data) {
        $scope.inits = data;
        dfd.resolve();
      }, $scope.error);

      // Setup promise tracker for spinner on initial load
      $scope.finder = promiseTracker('initTracker');
      $scope.finder.addPromise($scope.loadInits);

      return dfd.promise;
    };

    // Get initiative metadata
    $scope.getMetadata = function () {
      $scope.actsLocs = actsLocs.get($scope.params.init);
      $scope.activities = $scope.actsLocs.activities;
      $scope.locations = $scope.actsLocs.locations;
      $scope.params.location = $scope.locations[0];
    };

    // Submit request and draw chart
    $scope.getData = function () {
      var cfg;

      // Promise to resolve request on navigation change
      $scope.dataTimeoutPromise = $q.defer();
      $scope.state = uiStates.setUIState('loading');

      // Includes promise/explicit timeout values
      cfg = {
        params: $scope.params,
        acts: $scope.activities,
        locs: $scope.locations,
        dataProcessor: $scope.sumaConfig.dataProcessor,
        timeoutPromise: $scope.dataTimeoutPromise,
        timeout: 180000
      };

      data[$scope.sumaConfig.dataSource](cfg)
        .then($scope.success, $scope.error);
    };

    // Update metadata UI wrapper, fired by
    // init selection in form
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

    // Respond to routeUpdate event
    $scope.routeUpdate = function () {
      var urlParams = $location.search();

      // Resolve active requests
      if ($scope.dataTimeoutPromise) {
        $scope.dataTimeoutPromise.resolve('resolved');
      }

      if ($scope.initTimeoutPromise) {
        $scope.initTimeoutPromise.resolve('resolved');
        $scope.finder.cancel();
      }

      if (_.isEmpty(urlParams)) { // True when navigating back to initial
        $scope.state = uiStates.setUIState('initial');
        $scope.setDefaults();
      } else if ($scope.params.init){ // Typical navigation between reports (most common case)
        $scope.setScope(urlParams).then($scope.getData, $scope.error);
      } else { // Navigation from initial to completed report
        $scope.getInitiatives().then(function () {
          $scope.setScope(urlParams).then($scope.getData, $scope.error);
        });
      }
    };

    // Submit form and set URL
    $scope.submit = function () {
      var currentUrl,
          currentScope;

      // Current URL for comparison
      currentUrl = $location.search();

      // Map current scope to object for comparison/setting
      currentScope = {
        id: String($scope.params.init.id),
        sdate: $scope.params.sdate || $scope.params.sdate === '' ? $scope.params.sdate : null,
        edate: $scope.params.edate || $scope.params.edate === '' ? $scope.params.edate : null,
        stime: $scope.params.stime || $scope.params.stime === '' ? $scope.params.stime : null,
        etime: $scope.params.etime || $scope.params.etime === '' ? $scope.params.etime : null,
        classifyCounts: $scope.params.classifyCounts ? $scope.params.classifyCounts.id : null,
        wholeSession: $scope.params.wholeSession ? $scope.params.wholeSession.id : null,
        zeroCounts: $scope.params.zeroCounts ? $scope.params.zeroCounts.id : null,
        requireActs: scopeUtils.stringifyActs($scope.activities, 'require'),
        excludeActs: scopeUtils.stringifyActs($scope.activities, 'exclude'),
        requireActGrps: scopeUtils.stringifyActs($scope.activities, 'require', true),
        excludeActGrps: scopeUtils.stringifyActs($scope.activities, 'exclude', true),
        location: $scope.params.location ? $scope.params.location.id : null,
        days: scopeUtils.stringifyDays($scope.params.days)
      };

      // Remove empty fields
      currentScope = _.compactObject(currentScope);

      // Resubmit if equal, set URL if not and fire RouteUpdate
      if (_.isEqual(currentUrl, currentScope)) {
        $scope.getData();
      } else {
        $location.search(currentScope);
      }
    };

    // Display error message
    $scope.error = function (data) {
      if (!data.promiseTimeout) {
        $scope.state = uiStates.setUIState('error');
        $scope.errorMessage = data.message;
        $scope.errorCode = data.code;
      }
    };

    // Assign data to scope and set state
    $scope.success = function (processedData) {
      $scope.state = uiStates.setUIState('success');
      $scope.data = processedData;
      $scope.summaryParams = angular.copy($scope.params);

      // Supplemental bar chart
      if ($scope.sumaConfig.suppWatch) {
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

    // Initialize controller
    $scope.initialize();
  });
