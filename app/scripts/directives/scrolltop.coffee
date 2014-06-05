'use strict'

angular.module('pemappApp')
  .directive('scrollTop', ($rootScope)->
    restrict: 'A'
    link: (scope, element, attrs) ->
      $body = angular.element('body')
      element.on "click" , (e) ->
        #disable page scroll during edit mode
        $body.animate({scrollTop: 0}, 400)
      return
  )
