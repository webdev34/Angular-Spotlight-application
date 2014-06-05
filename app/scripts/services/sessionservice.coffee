'use strict'

angular.module('pemappApp')
  .service 'SessionsService', ($rootScope, $http, $q, $parse, $location, $routeParams, ampSectionService, ampStorageService) ->
    {
      getSessions: (sections) ->
        $rootScope.userData = { 
          userName : sections[0].user.firstName + " " + sections[0].user.lastName, 
          userId : sections[0].key,
          sessions : []
          sections : sections
        }
        
        applicationName = 'spotlight'
        fileName = $rootScope.userData.userId+'-spotlight-data';
       
        ampStorageService.read(applicationName, fileName).then (storage) ->
          if storage 
            angular.forEach storage, ((value, key) ->
              $rootScope.userData = $parse(value.data)($rootScope);
            )
            if $rootScope.userData.sessions.length > 0
              $rootScope.noSessions = false;
            else
              $rootScope.noSessions = true;
          else 
            $rootScope.noSessions = true;
      
      createSession: (newSession) ->
        applicationName = 'spotlight'
        fileName = $rootScope.userData.userId+'-spotlight-data';
        fileData = angular.toJson($rootScope.userData, true);
        ampStorageService.read(applicationName, fileName).then (storage) ->
            $rootScope.userData.sessions.push newSession
            fileData = angular.toJson($rootScope.userData, true);
            ampStorageService.create(applicationName, fileName, fileData).then (storage) ->
              console.log storage
              if storage
                return true

      updateSession: ->
        applicationName = 'spotlight'
        fileName = $rootScope.userData.userId+'-spotlight-data';
        fileData = angular.toJson($rootScope.userData, true);
        ampStorageService.create(applicationName, fileName, fileData).then (storage) ->
          if storage
            return true

      getStudentLastExcerptDate: (roster) ->
        applicationName = 'spotlight'
        studentData = ''
        thisData = ''
        fileName = $rootScope.userData.userId+'-'+$rootScope.currentSession.sectionKey+'-last-excerpt-date';
        ampStorageService.read(applicationName, fileName).then (storage) ->
          angular.forEach storage, ((value, key) ->
            thisData = $parse(value.data)(studentData);
          )
          angular.forEach thisData, ((excerptData, excerptKey) ->
            angular.forEach $rootScope.currentRoster, ((currentStudent, studentKey) ->
              if currentStudent.key is excerptData.studentId
                date1 = new Date(excerptData.lastDate)
                date2 = new Date()
                diff = new Date(date2.getTime() - date1.getTime())
                diff = diff.getUTCDate() - 1
                $rootScope.currentRoster[studentKey].lastExcerptDate = diff
                $rootScope.currentRoster[studentKey].pastExcerpt = true
            )
          )

      saveStudentExcerptCount: ->
        fileName = $rootScope.userData.userId+'-'+$rootScope.currentSession.sectionKey+'-last-excerpt-date';
        fileData = ''
        thisData = ''
        if $rootScope.$$childTail.excerpts
          allExcerpts = $rootScope.$$childTail.excerpts['left'].concat $rootScope.$$childTail.excerpts['right'];
        else
          allExcerpts = [{'left' : [], 'right': []}]
        applicationName = 'spotlight'
        studentData = []
        arrayOfExcerpts = []

        fileName = $rootScope.userData.userId+'-'+$rootScope.currentSession.sectionKey+'-last-excerpt-date';
        ampStorageService.read(applicationName, fileName).then (storage) ->
          if storage
            testData = []
            angular.forEach storage, ((value, key) ->
              thisData = $parse(value.data)(studentData);
              angular.forEach $rootScope.newerExcerpts, ((value, key) -> 
                pushThis = false

                angular.forEach thisData, ((studentDataValue, studentDataKey) ->
                  if value.studentId is studentDataValue.studentId
                    thisData[studentDataKey].lastDate = value.excerptDate
                  else
                    pushThis = true
                )
                if pushThis is true
                  thisData.push { "teacherId" : $rootScope.userData.userId, "excerptId" : value.excerptId, "studentId" : value.studentId, "studentName" : value.author, "lastDate" : value.excerptDate }
              )
            )
            
            fileData = angular.toJson(thisData, false);
            ampStorageService.create(applicationName, fileName, fileData).then (savedExcerptData) ->
                
          else
            thisData = []
            angular.forEach allExcerpts, ((value, key) -> 
              thisStudent = value.studentId
              thisData.push { "teacherId" : $rootScope.userData.userId, "excerptId" : value.excerptId, "studentId" : value.studentId, "studentName" : value.author, "lastDate" : value.excerptDate }
            )
            fileData = angular.toJson(thisData, false);
            ampStorageService.create(applicationName, fileName, fileData).then (savedExcerptData) ->        
    }