'use strict'

angular.module('pemappApp')
  .controller 'SessionCtrl', ($scope, $rootScope, $routeParams, UserDataService) ->
    
    UserDataService.getUserData();

    $scope.annotable = true
    $scope.showRoster = false
    $scope.currentEditSide = ''
    $scope.newSkillTags = []
    $scope.newSkillTag = ''
    $scope.editingAllowed = true
    $scope.editExcerpt = false
    $scope.attributedStudentId = null
    $scope.attributedStudentName = ''
    $scope.selectedSection
    $rootScope.mode = 'session'
    $rootScope.currentPageTitle = 'Build Wall'
    $rootScope.compareMode = false
    $rootScope.disableNav = false
    $scope.onDrag = false
    $rootScope.studentData = []
    $rootScope.newerExcerpts = []
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
          excerptId:''
          excerptDate: 0
          skills : []
          spotlight : false
          editMode : false

        @newExcerpt =
          content : ''
          author : ''
          studentId:''
          excerptId:''
          excerptDate: 0
          skills : [
            {
              'value': 'Focus on moment'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Focus in text'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Showing'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Evidence'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Logical Structure'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Transition'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Lead'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Complex sentences'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Simple sentences'
              'checked' :false
              'predefined' :true
            }
            {
              'value' : 'Compound sentences'
              'checked' :false
              'predefined' :true
            }
          ]
          spotlight : false
          editMode : false
        @newTag =
          value : ''
          checked : true #highlighted for newly added tag
          predefined : false

        #toggle the editMode attribute in each excerpt item
        @toggleEdit = (excerpt, $event) ->
          if $scope.editingAllowed
            @setSideFlag(@side)
            @tempExcerpt = $scope.clone(excerpt)
            $scope.editExcerpt = true
            $scope.attributedStudentId = excerpt.studentId
            excerpt.editMode = !excerpt.editMode
            $scope.editingAllowed = false
            $rootScope.disableNav = true

        @cancelEdit = (excerpt) ->
          # revert to the state before edit
          $scope.showRoster = false #hide roster
          excerpt.content = @tempExcerpt.content
          excerpt.author = @tempExcerpt.author
          excerpt.studentId = @tempExcerpt.studentId
          excerpt.skills = @tempExcerpt.skills
          excerpt.spotlight = @tempExcerpt.spotlight
          @newTag.value = null
          @saveEdit(excerpt) #right now just do the same as saveEdit

        @saveEdit = (excerpt)->
          excerpt.editMode = !excerpt.editMode
          $rootScope.newerExcerpts.push excerpt
          @removeSideFlag()
          $scope.showRoster = false
          $scope.editExcerpt = false
          $scope.attributedStudentId = null
          $scope.editingAllowed = true
          $rootScope.disableNav = false

        @showGhostBox = ->
          @showGhost = true
          @forcedShowGhost = true
        @hideGhostBox = ->
          @showGhost = false

        @showAttr = (currentside)->
          if $scope.editingAllowed
            @boxAttr = true #need to find a way to set the other box.boxAttr = false
            @setSideFlag(currentside)
            $scope.editingAllowed = false
            $rootScope.disableNav = true

        @setSideFlag = (currentside) ->
          #side flag adds 'left' or 'right' class to student roster container
          $scope.currentEditSide = currentside

        @removeSideFlag = ->
          $scope.currentEditSide = null

        @delete = (excerpt)->
          @excerpts.splice @excerpts.indexOf(excerpt), 1
          excerptHolder = []
          angular.forEach $rootScope.newerExcerpts, ((value, key) ->
            if parseInt(excerpt.excerptId) isnt parseInt(value.excerptId)
              excerptHolder.push value
          )
          $rootScope.newerExcerpts = excerptHolder
          $scope.editingAllowed = true
          $rootScope.disableNav = false
          $scope.editExcerpt = false
          @resetForm(excerpt)
          @removeSideFlag()

        @saveExcerpt = (newExcerpt)->
          newExcerpt.excerptId = $scope.excerpts.left.length + $scope.excerpts.right.length + 1
          newExcerpt.excerptDate = Date.parse(new Date)

          $rootScope.newerExcerpts.push angular.copy(newExcerpt)

          if typeof @excerpts is "undefined"
            @newExcerpt.push angular.copy(newExcerpt)
            $scope.excerpts = newExcerpt
          else
            @excerpts.push angular.copy(newExcerpt)
          angular.forEach $rootScope.userData.sessions, ((value, key) ->
            if parseInt(value.sessionId) is parseInt($rootScope.currentSession.sessionId)
              $rootScope.userData.sessions[key].excerpts = $scope.excerpts
          )
          @resetForm(newExcerpt)

        @resetForm = (newExcerpt) ->
          @clearNewExcerpt (newExcerpt)
          $scope.showRoster = false #hide the roster
          $scope.newSkillTags = []
          $scope.editingAllowed = true
          $rootScope.disableNav = false
          $scope.attributedStudentId = null
          @boxAttr = false
          @newTag.value = null
          @removeSideFlag() #clear the side flag

        @clearNewExcerpt = (newExcerpt) ->
          newExcerpt.content = null
          newExcerpt.author = null
          newExcerpt.studentId = null
          newExcerpt.spotlight = false
          newExcerpt.editMode = false
          newExcerpt.skills
          $scope.resetProp newExcerpt.skills, 'checked'

        @discardNewExcerpt = (newExcerpt) ->
          @resetForm newExcerpt
          $scope.showRoster = false #hide the roster
          #hide ghost box on cancel if user manually add a new ghost
          if @forcedShowGhost
            @showGhost = false
            @forcedShowGhost = false

        @addTag = (excerpt)->
          #trim special characters
          @newTag.value = @newTag.value.trim().replace(/[^\w\s]/gi, '')
          if @newTag.value.length isnt 0
            excerpt.skills.push angular.copy @newTag
            @newTag.value = ''

    $scope.leftColumn = new ExcerptList('left')
    $scope.rightColumn = new ExcerptList('right')

    $rootScope.$watch "userData", ((newVal, oldVal) ->
      if typeof newVal isnt "undefined"
        angular.forEach newVal[0].sessions, ((value, key) ->
          if parseInt(value.sessionId) is parseInt($routeParams.sessionId)
            $rootScope.currentSession = value
            console.log value
            wallName = value.wallName
            $scope.modifiedExcerpts = $scope.addAttribute($rootScope.currentSession.excerpts, 'editMode', false)
            $scope.leftColumn.excerpts = $scope.modifiedExcerpts['left']
            $scope.rightColumn.excerpts = $scope.modifiedExcerpts['right']
            $scope.excerpts = { 'left' : $scope.leftColumn.excerpts, 'right': $scope.rightColumn.excerpts}
        )
    ), true

    $rootScope.$watch "userSections", ((newVal, oldVal) ->
      #applies roster to current section
      if $rootScope.currentSession
        angular.forEach newVal, ((value, key) ->
          if value.id is $rootScope.currentSession.sectionKey
            $rootScope.currentRoster = value.roster
        )

        angular.forEach $rootScope.currentRoster, ((currentStudent, studentKey) ->
          currentStudent.isActiveClass = false
        )
    ), true
        
    #set property of each item in array to false
    $scope.resetProp = (arr, prop) ->
      for item in arr
        item[prop] = false

    # loop thru array, add necessary attribute
    $scope.addAttribute = (arr, key, val) ->
      if arr
        for item in arr
          item[key] = val
      else
        arr = []
      return arr
    
    #deep copy
    $scope.clone = (obj) ->
      return obj  if obj is null or typeof (obj) isnt "object"
      temp = new obj.constructor()
      for key of obj
        temp[key] = $scope.clone(obj[key])
      temp

    $scope.$watch "rightColumn.excerpts.length", ((newVal, oldVal) ->
      $scope.rightColumnExcerptLength = $scope.rightColumn.excerpts.length if $scope.rightColumn.excerpts
      if $scope.rightColumnExcerptLength > $scope.leftColumnExcerptLength
        $scope.leftColumn.showGhost = true
        $scope.rightColumn.showGhost = false
      else
        $scope.leftColumn.showGhost = false
        $scope.rightColumn.showGhost = true
    ), true

    $scope.$watch "leftColumn.excerpts.length", ((newVal, oldVal) ->

      $scope.leftColumnExcerptLength = $scope.leftColumn.excerpts.length if $scope.leftColumn.excerpts
      if $scope.leftColumnExcerptLength > $scope.rightColumnExcerptLength
        $scope.leftColumn.showGhost = false
        $scope.rightColumn.showGhost = true
      else
        $scope.leftColumn.showGhost = true
        $scope.rightColumn.showGhost = false
    ), true

    $scope.selectedStudent = (currentStudent) ->
      if currentStudent is 'anonymous'
          currentStudent = {
            firstName : 'anonymous'
            lastName : ''
            key :'anonymous'
          }
      if !$scope.editExcerpt
        if $scope.currentEditSide is 'left'
          $scope.leftColumn.newExcerpt.author = currentStudent.firstName+' '+currentStudent.lastName
          $scope.leftColumn.newExcerpt.studentId = currentStudent.key

        if $scope.currentEditSide is 'right'
          $scope.rightColumn.newExcerpt.author = currentStudent.firstName+' '+currentStudent.lastName
          $scope.rightColumn.newExcerpt.studentId = currentStudent.key
        $scope.attributedStudentId = currentStudent.key #save the current attributed student ID
      else
        if $scope.currentEditSide is 'left'
          for excerpt in $scope.leftColumn.excerpts
            if excerpt.editMode is true
              excerpt.author = currentStudent.firstName+' '+currentStudent.lastName
              excerpt.studentId = currentStudent.key
        if $scope.currentEditSide is 'right'
          for excerpt in $scope.rightColumn.excerpts
            if excerpt.editMode is true

              excerpt.author = currentStudent.firstName+' '+currentStudent.lastName
              excerpt.studentId = currentStudent.key
        $scope.attributedStudentId = currentStudent.key

    $scope.toggleTag = (tag) ->
      tag.checked = !tag.checked

    $scope.toggleStudentName = (showRoster) ->
      $scope.showRoster = !$scope.showRoster

    $scope.deleteTag = (skills, $index) ->
      skills.splice $index, 1

    $rootScope.disableScroll = false
    $scope.disableFixed = ->
      $rootScope.disableFixed = true
    $scope.enableFixed = ->
      $rootScope.disableFixed = false
      $rootScope.disableScroll = false
    $scope.disablePageScroll = ->
      $rootScope.disableScroll = true

    $scope.sortable_cross_option =
      allow_cross: true
      handle: ".drag-handle"
      stop: (list, dropped_index, extra_data, drag_extra_data) ->
        # if in the same colum
        if extra_data == drag_extra_data
         
          return
        dropped_excerpt = list[dropped_index]
        #drag_extra_data = ng-extra-sortable in view, in this case, it is 'left' or 'right'
        find_index = $scope.excerpts[drag_extra_data].indexOf dropped_excerpt
        if find_index != -1
          $scope.excerpts[drag_extra_data].splice find_index, 1
