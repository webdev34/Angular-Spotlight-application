'use strict'

angular.module('pemappApp')
  .directive('toggleDraggable', ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on('click', (ev) ->
        if attrs.toggleDraggable is "false"
          angular.element('.hidden-modal').removeClass('disable');
        else
          angular.element('.hidden-modal').addClass('disable');
      )  
  )
