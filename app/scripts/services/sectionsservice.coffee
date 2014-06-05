'use strict'

angular.module('pemappApp')
  .service 'UserDataService', ($http, $q, $rootScope, ampSectionService, SessionsService, ampRosterService, $parse) ->
    {
      getUserData: (currentSectionName) ->
        $rootScope.currentSession
        $rootScope.userSections = []
        ampSectionService.fetch().then (sections) ->
          if sections
            #Gets user sections for drop down in modal and roster list when modifying an excerpt
            angular.forEach sections, ((value, key) ->
              ampRosterService.read(value.section.key).then (roster) ->
                $rootScope.userSections.push({ "name" : value.section.name , "id" : value.section.key, "roster" : roster });
            )

       getUserSections: () ->
        $rootScope.userSections = [] 
        ampSectionService.fetch().then (sections) ->
          if sections
            #Gets user sections for drop down in create/edit wall modal
            angular.forEach sections, ((value, key) ->
              @push { "name" : value.section.name , "id" : value.section.key  }
            ), $rootScope.userSections
            SessionsService.getSessions(sections);
            
    }