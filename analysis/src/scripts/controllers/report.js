'use strict';

angular.module('sumaAnalysis')
  .controller('ReportCtrl', function ($anchorScroll, $location, $q, $scope, $timeout, promiseTracker, actsLocs, data, initiatives, scopeUtils, sumaConfig, uiStates) {
    var vm = this;

    // Initialize controller
    vm.initialize = function () {
      var urlParams = $location.search();

      // Get report specific configs
      vm.config = sumaConfig.getConfig($location.path());

      // Resolve active requests
      if (vm.dataTimeoutPromise) {
        vm.dataTimeoutPromise.resolve('resolved');
      }

      if (vm.initTimeoutPromise) {
        vm.initTimeoutPromise.resolve('resolved');
        vm.initTracker.cancel();
      }

      // Nav to initial, between reports, from initial
      if (_.isEmpty(urlParams)) {
        vm.getInitiatives().then(function () {
          vm.state  = uiStates.setUIState('initial');
          vm.params = sumaConfig.setParams(vm.config);
        }, vm.error);
      } else if (vm.params && vm.params.init) {
        vm.setScope(urlParams)
          .then(vm.getData)
          .then(vm.success, vm.error);
      } else {
        vm.getInitiatives().then(function () {
          vm.setScope(urlParams)
            .then(vm.getData)
            .then(vm.success, vm.error);
        }, vm.error);
      }
    };

    // Set scope.params based on urlParams
    vm.setScope = function (urlParams) {
      return scopeUtils.set(urlParams, vm.config, vm.inits)
        .then(vm._setScope)
        .then(scopeUtils.success, vm.error);
    };

    vm._setScope = function (response) {
      // Set scope where possible regardless of error
      vm.activities = response.activities;
      vm.locations  = response.locations;
      vm.params     = response.params;

      return response.errorMessage;
    };

    // Get initiatives
    vm.getInitiatives = function () {
      var cfg,
          loadInits;

      // Promise to resolve request on navigation change
      vm.initTimeoutPromise = $q.defer();

      // Promise/Explicit timeouts
      cfg = {
        timeoutPromise: vm.initTimeoutPromise,
        timeout: 180000
      };

      loadInits = initiatives.get(cfg).then(function (data) {
        vm.inits = data;
      });

      // Setup promise tracker for spinner on initial load
      vm.initTracker = promiseTracker('initTracker');
      vm.initTracker.addPromise(loadInits);

      return loadInits;
    };

    // Submit request and draw chart
    vm.getData = function () {
      var cfg;

      // Promise to resolve request on navigation change
      vm.dataTimeoutPromise = $q.defer();
      vm.state = uiStates.setUIState('loading');

      // Includes promise/explicit timeout values
      cfg = {
        params:         vm.params,
        acts:           vm.activities,
        locs:           vm.locations,
        dataProcessor:  vm.config.dataProcessor,
        timeoutPromise: vm.dataTimeoutPromise,
        timeout:        180000
      };

      return data[vm.config.dataSource](cfg);
    };

    // Get initiative metadata
    vm.getMetadata = function () {
      var actsLocsArys = actsLocs.get(vm.params.init);
      vm.activities    = actsLocsArys.activities;
      vm.locations     = actsLocsArys.locations;
    };

    // Update init metadata
    vm.updateMetadata = function () {
      if (vm.params.init) {
        vm.processMetadata = true;
        vm.getMetadata();

        // Artificially add a delay for UI
        $timeout(function () {
          vm.processMetadata = false;
        }, 400);
      }
    };

    // Submit form and set URL
    vm.submit = function () {
      var currentUrl,
          currentScope;

      currentUrl   = $location.search();
      currentScope = scopeUtils.getCurrentScope(vm.params, vm.activities, vm.locations);

      if (_.isEqual(currentUrl, currentScope)) {
        vm.getData().then(vm.success, vm.error);
      } else {
        $location.search(currentScope);
      }
    };

    // Display error message
    vm.error = function (data) {
      if (!data.promiseTimeout) {
        vm.state        = uiStates.setUIState('error');
        vm.errorMessage = data.message;
        vm.errorCode    = data.code;
      }
    };

    // Assign data to scope and set state
    vm.success = function (processedData) {
      vm.state         = uiStates.setUIState('success');
      vm.data          = processedData;
      vm.summaryParams = angular.copy(vm.params);
    };

    // Handle anchor links
    vm.scrollTo = function (id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      $location.hash(old);
    };

    // Attach listener for URL changes
    $scope.$on('$routeUpdate', vm.initialize);

    // Initialize controller
    vm.initialize();
  });
