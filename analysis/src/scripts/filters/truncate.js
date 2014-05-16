'use strict';

angular.module('sumaAnalysis')
  .filter('truncate', function () {
    function truncate(string, n, useWordBoundary){
      var tooLong = string.length > n,
      s_ = tooLong ? string.substr(0, n - 1) : string;
      s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;

      return  tooLong ? s_ + '...' : s_;
    }

    return function (input, n, useWordBoundary) {
     return truncate(input, n, useWordBoundary);
    };
  });
