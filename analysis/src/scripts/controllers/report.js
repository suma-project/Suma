'use strict';

angular.module('sumaAnalysis')
  .controller('ReportCtrl', function ($scope, $rootScope, $http, $location, $anchorScroll, $timeout, initiatives, actsLocs, data, promiseTracker, uiStates, sumaConfig, $routeParams, $q, validation) {

    // Initialize controller
    $scope.initialize = function () {
      var urlParams = $location.search();

      // Set default scope values from config
      $scope.setDefaults();

      // Attach listener for URL changes
      $scope.$on('$routeUpdate', $scope.routeUpdate);

      // Get initiatives
      $scope.getInitiatives().then(function () {
        if (_.isEmpty(urlParams)) {
          $scope.state = uiStates.setUIState('initial');
        } else {
          $scope.setScope(urlParams).then($scope.getData, $scope.error);
        }
      });
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
    $scope.setScope = function (urlParams) {
      var dfd = $q.defer(),
          errors = [];

      $scope.params.init = _.find($scope.inits, function (e, i) {
        return String(e.id) === String(urlParams.id);
      });

      if (!$scope.params.init) {
        dfd.reject({message: 'Initiative ID Not Found.', code: 500});
      } else {
        $scope.params.classifyCounts = _.find($scope.countOptions, function (e, i) {
          return String(e.id) === String(urlParams.classifyCounts);
        });

        if (!$scope.params.classifyCounts) {
          errors.push('Invalid value for classifyCounts. Valid values are "count", "start", or "end".');
        }

        $scope.params.wholeSession = _.find($scope.sessionOptions, function (e, i) {
          return String(e.id) === String(urlParams.wholeSession);
        });

        if (!$scope.params.wholeSession) {
          errors.push('Invalid value for wholeSession. Valid values are "yes" or "no".');
        }

        $scope.params.daygroup = _.find($scope.dayOptions, function (e, i) {
          return String(e.id) === String(urlParams.daygroup);
        });

        if (!$scope.params.daygroup) {
          errors.push('Invalid value for daygroup. Valid values are "all", "weekends", or "weekdays".');
        }

        $scope.getMetadata();

        $scope.params.activity = _.find($scope.activities, function (e, i) {
          var type,
              id;

          if (urlParams.activity === 'all') {
            return String(e.id) === String(urlParams.activity);
          } else {
            type = urlParams.activity.split('-')[0];
            id = urlParams.activity.split('-')[1];

            return String(e.id) === String(id) && String(e.type) === String(type);
          }
        });

        if (!$scope.params.activity) {
          errors.push('Invalid value for activity.');
        }

        $scope.params.location = _.find($scope.locations, function (e, i) {
          return String(e.id) === String(urlParams.location);
        });

        if (!$scope.params.location) {
          errors.push('Invalid value for location.');
        }

        // Validate sdate
        if (validation.validateDateTime(urlParams.sdate, 8)) {
          $scope.params.sdate = urlParams.sdate;
        } else {
          errors.push('Invalid value for sdate. Should be numeric and either 0 or 8 characters in length, not counting punctuation.');
        }

        // Validate edate
        if (validation.validateDateTime(urlParams.edate, 8)) {
          $scope.params.edate = urlParams.edate;
        } else {
          errors.push('Invalid value for edate. Should be numeric and either 0 or 8 characters in length, not counting punctuation.');
        }

        // Validate stime
        if (validation.validateDateTime(urlParams.stime, 4, true)) {
          $scope.params.stime = urlParams.stime;
        } else {
          errors.push('Invalid value for stime. Should be numeric and either 0 or 4 characters in length, not counting punctuation.');
        }

        // Validate etime
        if (validation.validateDateTime(urlParams.etime, 4, true)) {
          $scope.params.etime = urlParams.etime;
        } else {
          errors.push('Invalid value for etime. Should be numeric and either 0 or 4 characters in length, not counting punctuation.');
        }

        if (errors.length > 0) {
          var msg = 'Query parameter input error. ';
          _.each(errors, function (e) {
            msg = msg + e + ' ';
          });

          dfd.reject({message: msg, code: 500});
        }

        dfd.resolve();
      }

      return dfd.promise;
    };

    // Attach params to URL
    $scope.submit = function () {
      var currentUrl,
          currentScope;

      currentUrl = $location.search();

      currentScope = {
        id: String($scope.params.init.id),
        sdate: $scope.params.sdate,
        edate: $scope.params.edate,
        stime: $scope.params.stime || '',
        etime: $scope.params.etime || '',
        classifyCounts: $scope.params.classifyCounts ? $scope.params.classifyCounts.id : null,
        wholeSession: $scope.params.wholeSession ? $scope.params.wholeSession.id : null,
        activity: $scope.params.activity ? $scope.params.activity.type ? $scope.params.activity.type + '-' + $scope.params.activity.id : $scope.params.activity.id : null,
        location: $scope.params.location ? $scope.params.location.id : null,
        daygroup: $scope.params.daygroup ? $scope.params.daygroup.id : null
      };

      if (_.isEqual(currentUrl, currentScope)) {
        $scope.getData();
      } else {
        $location.search(currentScope);
      }
    };

    // Get initiatives
    $scope.getInitiatives = function () {
      var cfg,
          dfd = $q.defer();

      $scope.initTimeoutPromise = $q.defer();

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
      var cfg;

      $scope.dataTimeoutPromise = $q.defer();
      $scope.state = uiStates.setUIState('loading');

      cfg = {
        params: $scope.params,
        acts: $scope.activities,
        locs: $scope.locations,
        dataProcessor: sumaConfig.dataProcessor,
        timeoutPromise: $scope.dataTimeoutPromise,
        timeout: 180000
      };

      data[sumaConfig.dataSource](cfg)
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
      } else if ($scope.params.init){ // Typical navigation between reports (most common case)
        $scope.setScope(urlParams).then($scope.getData, $scope.error);
      } else { // Navigation from initial to completed report
        $scope.getInitiatives().then(function () {
          $scope.setScope(urlParams).then($scope.getData, $scope.error);
        });
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
