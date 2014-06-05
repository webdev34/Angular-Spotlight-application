'use strict'

angular.module('pemappApp')
    .controller 'ModalCtrl', ($scope, $location, $rootScope, dateParser, ampStorageService, SessionsService) ->
      $scope.selectedDate = dateParser.currentDate();
      $scope.wallName 
      $scope.selectedSection
      $scope.userDataTest
      $rootScope.isEditWall = false;
      $rootScope.dropDownDisplay = true

      $rootScope.showValueDropDown = (dropDownValue)->
        if dropDownValue
          $rootScope.dropDownDisplay = !$rootScope.dropDownDisplay

      $rootScope.resetModalValue = ->
        $scope.selectedSection = ''
        $scope.wallName = ''
        $scope.selectedDate = new Date().toDateString();
        $rootScope.dropDownDisplay = true

      $rootScope.populateModal = ->
        $rootScope.resetModalValue(); 
        $rootScope.isEditWall = true;
        $rootScope.dropDownDisplay = false
        if $rootScope.currentSession.sectionName && $rootScope.currentSession.sectionKey
          angular.forEach $rootScope.userSections, ((value, key) ->
              if $rootScope.currentSession.sectionKey == value.id
                $scope.selectedSection = $rootScope.userSections[key]
                $scope.wallName = $rootScope.currentSession.wallName
                $scope.selectedDate = new Date($rootScope.currentSession.date).toDateString();
          )
       
      $scope.upDateWall = ->
        angular.forEach $rootScope.userData.sessions, ((value, key) ->
          if parseInt($rootScope.currentSession.sessionId) == parseInt(value.sessionId)
            $rootScope.userData.sessions[key].wallName = $scope.wallName
            $rootScope.userData.sessions[key].date = Date.parse($scope.selectedDate) 
            $rootScope.userData.sessions[key].sectionName = $scope.selectedSection.name
            $rootScope.userData.sessions[key].sectionKey = $scope.selectedSection.id
            $rootScope.currentSession.sectionKey = $scope.selectedSection.id
            SessionsService.updateSession();
            $rootScope.isEditWall = false;
            angular.forEach $rootScope.userSections, ((value, key) ->
              if value.id is $rootScope.currentSession.sectionKey
                $rootScope.currentRoster = value.roster
            )
        )

      $scope.createSessionSubmit = ->
        if $rootScope.userData.sessions.length is 0
          newSessionId = 1
        else newSessionId = $rootScope.userData.sessions[$rootScope.userData.sessions.length - 1].sessionId + 1
        newSession = {
          sectionName : $scope.selectedSection.name
          sectionKey : $scope.selectedSection.id
          wallName : $scope.wallName
          date: Date.parse($scope.selectedDate) 
          excerptCount : 0
          sessionId : newSessionId
          excerpts: {'left' : [], 'right': []}
        }
        SessionsService.createSession( newSession).then (data) ->
          if data
            $scope.selectedDate = dateParser.currentDate()
            $scope.wallName = ''
            $scope.selectedSection
            $location.path('/section/'+newSession.sectionName+'/session/'+newSession.sessionId+'/edit'); 

      $scope.$watch "selectedDate", ((newVal, oldVal) ->
        if newVal.length == 0
          $scope.selectedDate = dateParser.currentDate();
      ), true 