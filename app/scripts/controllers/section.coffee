'use strict'

angular.module('pemappApp')
    .controller 'SectionCtrl', ($scope, $rootScope, $location, UserDataService) ->
      
      $rootScope.mode = 'sections'
      $rootScope.currentPageTitle = 'Spotlight'
      $rootScope.compareMode = false
      $rootScope.isEditWall = false;
      $rootScope.userData
      $rootScope.userSections
      UserDataService.getUserData();
      
      $scope.editSession = (sectionName, sessionId) ->
        $location.path('section/'+sectionName+'/session/'+sessionId+'/edit');

      $scope.goToWall = (sectionName, sessionId)->
       $location.path('/section/'+sectionName+'/session/'+sessionId+'/wall/')

      $scope.deleteSession = (sectionName, sessionId, wallName) ->
        if (confirm("Are you sure you want to delete " +wallName) == true) 
          angular.forEach $rootScope.userData.sessions, (value, key) ->
           if sessionId is value.sessionId
              $rootScope.userData.sessions.splice(key, 1);
              SessionsService.updateSession();
              
        if $rootScope.userData.sessions.length > 0
            $rootScope.noSessions = false;
        else
            $rootScope.noSessions = true;  