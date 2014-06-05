/**
 * @license TODO
 * (c) 2014-2014 Amplify, Inc
 * License: TODO
 */
(function(window, angular) {'use strict';

  // --------- //
  // Constants //
  // --------- //

  var CONFIG_URL = "/amp-config.json";

  var VERSION = "/api/0.1";
  
  // -------- //
  // Services //
  // -------- //

  angular.module('ampConfig', []).
  service('ampConfigService', ['$q', '$http', function($q, $http) {

    // we cannot make callbacks until we have a valid url
    // those urls are based off of the config file
    // which we also have to download

    var configPromise = $q.defer();
    var configDataCallback = $q.defer();

    var csApiUrlBuilder = function(url) {

      var result = $q.defer();
      configPromise.promise.then(function(config) {
        result.resolve(config.cs + (config.version || VERSION) + url);
      });

      return result.promise;
    };

    var csBaseUrlBuilder = function(url) {

      var result = $q.defer();
      configPromise.promise.then(function(config) {
        result.resolve(config.cs + url);
      });

      return result.promise;
    };

    // once we fetch the config file
    // we can resolve all our promised url builds
    // probably triggering a number of different requests

    $http.get(CONFIG_URL, { withCredentials: true })
      .success(function(data, status, headers, config) {
          configPromise.resolve(angular.fromJson(data));
          configDataCallback.resolve(angular.fromJson(data));
        })
        .error(function(data, status, headers, config) {
          configPromise.resolve(null);
          configDataCallback.resolve(null);
        });

    return {
      csBaseUrlBuilder : csBaseUrlBuilder,
      csApiUrlBuilder : csApiUrlBuilder,
      config : configDataCallback
    };
  }]);

})(window, window.angular);