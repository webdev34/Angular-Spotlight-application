'use strict' 

angular.module('pemappApp')
  .service 'UserDataService', ($http, $q, localStorageService, $rootScope) ->
    @getUserData = () ->
      deferred = $q.defer()
      $http(
        method: 'GET'
        url: '/scripts/services/userSection.json'
      ).success((data, status, headers, config) ->
          deferred.resolve data
          $rootScope.userSections = data
          return
        ).error((data, status, headers, config) ->
            deferred.reject status
            return
          )

      deferred = $q.defer()
      $http(
        method: 'GET'
        url: '/scripts/services/userData.json'
      ).success((data, status, headers, config) ->
          deferred.resolve data
          $rootScope.userData = data
          return
        ).error((data, status, headers, config) ->
            deferred.reject status
            return
          )
      # return deferred.promise
    return