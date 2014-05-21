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
      'src/bower_components/bootstrap-sass/js/modal.js',
      'src/bower_components/bootstrap-sass/js/popover.js',
      'src/bower_components/bootstrap3-datetimepicker/src/js/bootstrap-datetimepicker.js',
      'src/bower_components/lodash/dist/lodash.js',
      'src/lib/js/lodash_mixins.js',
      'src/bower_components/d3/d3.js',
      'src/bower_components/canvg/canvg.js',
      'test/js/mocks/**/*.js',
      'src/scripts/*.js',
      'src/scripts/**/*.js',
      'test/js/spec/**/*.js',
      'src/views/directives/**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8888,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporters
    reporters: ['progress', 'coverage'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // config for directive testing
    preprocessors: {
      'src/views/directives/**/*.html': 'ng-html2js',
      'src/scripts/**/!(app).js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'src/'         // HERE
    },

    // coverageReporter config
    coverageReporter: {
      type: 'html',
      dir: 'test/js/coverage/'
    },

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome', 'Safari', 'Firefox', 'PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
