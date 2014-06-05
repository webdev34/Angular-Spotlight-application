'use strict'

angular.module('pemappApp')
  .controller 'WallCtrl', ($scope, $rootScope, $routeParams, AuthenticationService, SessionsService, UserDataService) ->
    
    UserDataService.getUserData();

    $rootScope.compareMode = false
    $rootScope.mode = 'wall'
    $rootScope.currentPageTitle = 'Wall'
    $rootScope.compareText = 'Select a comparison...'

    $scope.leftComparison = false # compare state
    $scope.rightComparison = false # compare state
    $scope.compareFromSameSide = false
    $scope.compareLeft = -> # set compare to true
      $scope.leftComparison = true
    
    $scope.compareRight = ->
      $scope.rightComparison = true

    $scope.leftIndex = -1
    $scope.rightIndex = -1
    $scope.rightIndexOffset = 1000

    $scope.counter = 0
    $scope.compareExcerpt = ->
      # counter = 0 #track how many times you clicked compareExcerpt
      if $scope.counter == 1
        $rootScope.compareText = 'Comparison View'
        return $scope.counter = 0

      $rootScope.compareText = 'Select a comparison...'
      $rootScope.compareMode = true
      $scope.counter += 1

    $scope.leftItemClicked = ($index, e) ->
      if $scope.leftIndex is -1
        if angular.element(e.target).parents('li').hasClass('right-half')
          angular.element(e.target).parents('li').removeClass('right-half')
        $scope.leftIndex = $index
      if $index != $scope.leftIndex
        angular.element(e.target).parents('li').addClass('right-half')
        $scope.compareFromSameSide = true

    $scope.rightItemClicked = ($index, e) ->
      if $scope.rightIndex is -1
        if angular.element(e.target).parents('li').hasClass('left-half')
          angular.element(e.target).parents('li').removeClass('left-half')
        $scope.rightIndexOffset = 1000+$index #adding 1000 so left and right column have different indexes
        $scope.rightIndex = $scope.rightIndexOffset
      if ($index+1000) != $scope.rightIndexOffset
        angular.element(e.target).parents('li').addClass('left-half')
        $scope.compareFromSameSide = true

    $rootScope.doneComparing = ->
      $rootScope.compareMode = false
      $scope.rightIndexOffset = 1000
      $scope.leftIndex = -1
      $scope.rightIndex = -1
      $scope.leftComparison = false
      $scope.rightComparison = false
      $scope.compareFromSameSide = false
      $scope.counter = 0
    
    $scope.Excerpt = class ExcerptList
      constructor: (side)->
        @side = side
        @boxAttr = false
        @excerpts = []
        @excerptsLength
        @showGhost = false
        @forcedShowGhost = false
        @tempTag = ''
        @tempTags = []
        @tempExcerpt =
          content : ''
          author : ''
          studentId:''
          theme:''
          skills : []
          spotlight : false
          editMode : false

        @newExcerpt =
          content : ''
          author : ''
          studentId:''
          theme:''
          skills : []
          spotlight : false
          editMode : false

        @toggleSpotlight = (excerpt) ->
          thisSpotlightStatus = excerpt.spotlight
          thisExcerptId = excerpt.excerptId
      
          angular.forEach $scope.excerpts, ((value, key) ->
            angular.forEach value, ((value, key) ->
              if thisExcerptId is  value.excerptId
                excerpt.spotlight = !excerpt.spotlight
              else
                value.spotlight = false
            )
          )
          SessionsService.updateSession();

    $scope.leftColumn = new ExcerptList('left')
    $scope.rightColumn = new ExcerptList('right')
    
    $rootScope.$watch "userData", ((newVal, oldVal) ->
      if typeof newVal isnt "undefined"
        angular.forEach newVal[0].sessions, ((value, key) ->
          if parseInt(value.sessionId) is parseInt($routeParams.sessionId)
            $rootScope.currentSession = value
            wallName = value.wallName
            $scope.modifiedExcerpts = $scope.addAttribute($rootScope.currentSession.excerpts, 'editMode', false)
            $scope.leftColumn.excerpts = $scope.modifiedExcerpts['left']
            $scope.rightColumn.excerpts = $scope.modifiedExcerpts['right']
            $scope.excerpts = { 'left' : $scope.leftColumn.excerpts, 'right': $scope.rightColumn.excerpts}
        )
    ), true

    # loop thru array, add necessary attribute
    $scope.addAttribute = (arr, key, val) ->
      if arr
        for item in arr
          item[key] = val
      else
        arr = []
      return arr
