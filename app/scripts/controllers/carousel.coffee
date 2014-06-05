'use strict'

angular.module('pemappApp')
  .controller 'CarouselCtrl', ($scope, $rootScope, $routeParams, UserDataService) ->
    
    UserDataService.getUserData();
    
    $rootScope.mode = 'spotlight-carousel'
    $rootScope.currentPageTitle = 'Full Screen View'
    $rootScope.compareMode = false


    $rootScope.$watch "userData", ((newVal, oldVal) ->
      if typeof newVal isnt "undefined"
        angular.forEach newVal[0].sessions, ((value, key) ->
          if parseInt(value.sessionId) is parseInt($routeParams.sessionId)
            $rootScope.currentSession = value
            wallName = value.wallName
            $scope.excerpts = $rootScope.currentSession.excerpts
            # flag in the view
            $scope.dataRetrieved = true
            $scope.allExcerpts = $rootScope.currentSession.excerpts['left'].concat $rootScope.currentSession.excerpts['right']
          
            filter out and store only those that have spotlight on
            $scope.spExcerpts = $scope.allExcerpts.filter (excerpt) ->
              excerpt.spotlight == false #at this moment just pretend we are using those without spotlight
        )
    ), true