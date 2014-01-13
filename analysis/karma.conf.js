// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'chai-jquery', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'src/bower_components/jquery/jquery.js',
      'src/bower_components/angular/angular.js',
      'src/bower_components/angular-mocks/angular-mocks.js',
      'src/bower_components/angular-route/angular-route.js',
      'src/bower_components/angular-promise-tracker/promise-tracker.js',
      'src/bower_components/moment/moment.js',
      'src/bower_components/bootstrap-sass/js/tooltip.js',
      'src/bower_components/bootstrap-sass/js/popover.js',
      'src/bower_components/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
      'src/bower_components/lodash/dist/lodash.js',
      'src/bower_components/d3/d3.js',
      'src/bower_components/canvg/canvg.js',
      'src/scripts/*.js',
      'src/scripts/**/*.js',
      // 'test/js/mock/**/*.js',
      'test/js/spec/filters/**/*.js',
      'test/js/spec/services/**/*.js',
      // 'test/js/spec/directives/**/*.js',
      'test/js/spec/directives/buttonsRadio.js',
      'test/js/spec/directives/popover.js',
      'test/js/spec/directives/timepicker.js',
      'test/js/spec/directives/datepicker.js',
      'test/js/spec/directives/chartDownload.js',
      'test/js/spec/directives/csv.js',
      'test/js/spec/directives/csvHourly.js',
      'test/js/spec/directives/barChart.js',
      // 'test/js/spec/**/*.js',
      'src/views/directives/**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8888,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // config for directive testing
    preprocessors: {
      'src/views/directives/**/*.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'src/'         // HERE
    },

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
