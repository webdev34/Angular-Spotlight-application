'use strict'

angular.module('pemappApp')
  .service 'AuthenticationService', (ampAccessService, $location) ->
    {
      checkLogin : (shouldRedirect, $scope) ->
        ampAccessService.canRestoreSession().then ((logdata) ->
          $scope.curstatus = logdata
          $scope.isTeacher = false
          $scope.isStudent = false

          angular.forEach $scope.curstatus.roles, ((value, key) ->
            if value is 'ROLE_TEACHER'
              $scope.isTeacher = true
            else if value is 'ROLE_STUDENT'
              $scope.isStudent = true
            return
          )
          if $scope.isStudent is true
            $location.path('/studentsredirect')
          else if logdata.authenticated and (logdata.authenticated is true) and $scope.isTeacher is true
            console.log "authenticated"
            console.log logdata
          else
            ampAccessService.redirectToLoginPage()  if shouldRedirect
          return
        ), ((reason) ->
          console.log "Failed: " + reason
          return
        ), (update) ->
          console "Got notification: " + update
          return

        return

      logout : ($scope) ->
        self = this
        ampAccessService.logout().then (->
          console.log "Logged Out."
          ampAccessService.redirectToLoginPage()
          return
        ), ((reason) ->
          console.log "Failed to logout: " + reason
          return
        ), (update) ->
          alert "Got notification: " + update
          return

        console.log "logging you out..."
        return

    }
