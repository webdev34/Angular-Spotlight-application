'use strict'

angular.module('pemappApp')
  .directive('slider', ($timeout, SessionsService)->
    templateUrl: '/views/slider.html'
    restrict: 'A'
    scope: {
      excerpts: "="
    }
    link: (scope, element, attrs) ->

      scope.toggleSpotlight = (excerpt) ->
        thisSpotlightStatus = excerpt.spotlight
        thisExcerptId = excerpt.excerptId
        angular.forEach scope.excerpts, ((value, key) ->
            if thisExcerptId is  value.excerptId
              value.spotlight = !value.spotlight
            else
              value.spotlight = false
        )
        SessionsService.updateSession();
      scope.hidePrevArrow = true
      scope.hideNextArrow = false
      scope.$watch 'excerpts', (newval, oldval)->
        if newval
          swiped = element.swiper({
            mode:'horizontal'
            createPagination: false
            loop: false
            keyboardControl: true
            resizeReinit: true
            onSlideChangeStart: ->
              if swiped.activeIndex == 0
                scope.hidePrevArrow = true
              else if swiped.activeIndex == swiped.slides.length-1
                scope.hideNextArrow = true
              else
                scope.hideNextArrow = false
                scope.hidePrevArrow = false

              #update chnages needed if using keyboard control
              # scope.$apply ->
              #   scope.hidePrevArrow
              #   scope.hideNextArrow
          })
          scope.nextSlide = ->
            swiped.swipeNext()
          scope.previousSlide =->
            swiped.swipePrev()
  )
