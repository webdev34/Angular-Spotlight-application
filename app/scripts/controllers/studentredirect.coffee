'use strict'

angular.module('pemappApp')
    .controller 'StudentRedirectCtrl', ($rootScope, AuthenticationService) ->
      $rootScope.mode = 'student-redirect'
      AuthenticationService.checkLogin(true, $scope);
      