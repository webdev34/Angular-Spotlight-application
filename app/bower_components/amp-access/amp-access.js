/**
* @license TODO
* (c) 2014-2014 Amplify, Inc
* License: TODO
* Authors: Mike Lynch [mlynch@amplify.com]
*          Dan Fast [dfast@amplify.com]
*/

(function(window, angular) {'use strict';

  // ------- //
  // Helpers //
  // ------- //

  // Much of the front-end link to the api has not been implemented yet
  // this is a factory that creates angular promises for future features

  var makeEmptyPromise = function(errorMessage) {
    var emptyPromiseCreator = function() {
      var result = $q.defer();
      result.resolve({ error: errorMessage });

      return result.promise;
    };

    return emptyPromiseCreator;
  };

  // --------- //
  // Constants //
  // --------- //

  var LOGIN_URL_PREFIX = '/auth/sso/login?redirect_url=';
  var LOGIN_URL_POSTFIX = '%23%2Frestoresession';
  var STATUS_URL = '/auth/sso/status';
  var LOGOUT_URL = '/auth/sso/logout';
  var NOT_ENTITLED_URL = '/notentitled.html';
  var ENTITLEMENTS_URL = '/data/purchasedCourse/courseEntitlements';
  var DIRECT_ENTITLEMENT_URL = '/data/purchasedCourse?publicId=';

  
  // this is the data related to a session (whether active or not)

  var NO_SESSION_DATA = {
    authenticated : false
  };

  var LOGOUT_DATA = {
    message : "Logged out",
    authenticated : false
  };

  var CREDENTIAL_CONFIG = {
    withCredentials : true
  };




  angular.module('ampAccess', ['ampConfig'])







  // Entitlements is a user's right to access a file

  .service('ampEntitlementService',['$window', 'ampConfigService','$http', '$q', function($window, ampConfigService, $http, $q) {
 
    // fetch all sections for the current user-session

    var readEntitlements = function() {

      var result = $q.defer();

      ampConfigService.csApiUrlBuilder(ENTITLEMENTS_URL).then(function(url){
        $http.get(url, { withCredentials: true })
        .success(function(data, status, headers, config) {
          result.resolve(data);
        })
        .error(function(data, status, headers, config) {
          result.resolve([]);
        });
      });

      return result.promise;
    };

    var readEntitlement = function(publicId) {

      if(!publicId || !angular.isString(publicId)) {
        throw new Error("ampEntitlementService.read requires a publicId:String");
      }

      var result = $q.defer();

      ampConfigService.csApiUrlBuilder(DIRECT_ENTITLEMENT_URL + publicId).then(function(url){
        $http.get(url, { withCredentials: true })
        .success(function(data, status, headers, config) {
          result.resolve(data);
        })
        .error(function(data, status, headers, config) {
          result.resolve(null);
        });
      });

      return result.promise;
    };

    var entitlementOrRedirect = function(publicId) {

      if(!publicId || !angular.isString(publicId)) {
        throw new Error("ampEntitlementService.entitlementOrRedirect requires a publicId:String");
      }

      readEntitlement(publicId).then(function(data){
        if(!data){
          $window.location.assign(NOT_ENTITLED_URL)
        }
      });
    };  

    var createEntitlement = makeEmptyPromise($q, "ampEntitlementService.create' has not been implemented.");
    var updateEntitlement = makeEmptyPromise($q, "ampEntitlementService.update' has not been implemented.");
    var deleteEntitlement = makeEmptyPromise($q, "ampEntitlementService.delete' has not been implemented.");

    return {
      fetch : readEntitlements,
      create : createEntitlement,
      read : readEntitlement,
      update : updateEntitlement,
      delete : deleteEntitlement,
      entitlementOrRedirect : entitlementOrRedirect
    };
  }])






  .service('ampAccessService',['ampConfigService','$http', '$q', '$window', '$timeout', function(ampConfigService, $http, $q, $window, $timeout) {
    
    // login involves a redirect to a google page, followed by a forward to a desired location
    // that desired location is usually the page that we are coming from

    var canRestoreSession = function() {
      var result = $q.defer();

      ampConfigService.csBaseUrlBuilder(STATUS_URL).then(function(url){ 
        $http.get(url, CREDENTIAL_CONFIG)
        .success(function (data, status, headers, config) {
          result.resolve(data);
        })
        .error(function (data, status, headers, config) {
          result.resolve(angular.copy(NO_SESSION_DATA));
        });
      });

      return result.promise;
    };

    var logout = function() {
      var result = $q.defer();
      ampConfigService.csBaseUrlBuilder(LOGOUT_URL).then(function(url){
        $http.get(url, CREDENTIAL_CONFIG);
        $timeout(function(){
          result.resolve(angular.copy(LOGOUT_DATA));
        }, 100);
      });
      return result.promise;
    };

    var redirectToLoginPage = function() {

      ampConfigService.csBaseUrlBuilder(LOGIN_URL_PREFIX).then(function(url){
        $window.location.assign(url + $window.location.origin + encodeURIComponent($window.location.pathname) + LOGIN_URL_POSTFIX);
      })
    };

    // make api public

    return {
      canRestoreSession: canRestoreSession,
      logout : logout,
      redirectToLoginPage : redirectToLoginPage,
      restoreSession: makeEmptyPromise("ampAccessService.restoreSession' has not been implemented."),

      create : redirectToLoginPage,
      read : canRestoreSession,
      update : makeEmptyPromise("ampAccessService.update' has not been implemented."),
      delete : logout
    };
  }])








  

.controller('ampAuthorizationController', ['$scope', 'ampAccessService', 'ampEntitlementService', '$interval', function ($scope, ampAccessService, ampEntitlementService, $interval) {

    var DEFAULT_SESSION = { authenticated: false };

    $scope.getSession = function() {
        $scope.messages.push("Restoring session");
        ampAccessService.canRestoreSession().then(function(session){
            $scope.messages.push("Session retrieved");
            $scope.session = session;
            $scope.login();
        });
    };
 
    $scope.login = function() {
        if(!$scope.session.authenticated) {
            ampAccessService.redirectToLoginPage();
            $scope.messages.push("Redirecting to login");
        } else {
            $scope.messages.push("Already Logged in");
            if($scope.entitlementKey) {
                ampEntitlementService.entitlementOrRedirect($scope.entitlementKey);
            }
        }
    }

    $scope.logout = function() {
        if($scope.session.authenticated) {
            $scope.session = angular.copy(DEFAULT_SESSION);
            $scope.messages.push("Logging out");
            ampAccessService.logout().then(function(){
                $scope.messages.push("Logged out");
                $scope.getSession();
            });
        } else {
            $scope.messages.push("Already logged out");
        }
    };

    // default state

    $scope.session = angular.copy(DEFAULT_SESSION);

    $scope.messages = [];

    // automatically get session and login

    $scope.getSession();

    var delay = 1000 * 60 * 20;

    var sessionCall = $interval($scope.getSession, delay);

     $scope.$on("$destroy", function() {
        $interval.cancel(sessionCall);
    });
}])





.directive('ampAuthorizationMenu', [function(){

  // hah take that relative pathing to external files

  var link = function(scope, element, attrs) {
    scope.applicationName = attrs['applicationName'] || 'Unknown';
    scope.applicationVersion = attrs['applicationVersion'] || '0.0.0';
    scope.entitlementKey = attrs['entitlementKey'] || null;
  };    
                    
  return {
    restrict: 'E',
    transclude : true,
    controller: 'ampAuthorizationController',
    template: '<div><div ng-transclude></div></div>',
    link : link
  };
}])







})(window, window.angular);