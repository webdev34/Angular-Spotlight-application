'use strict'

angular.module('pemappApp')
  .directive('pemaDatepicker', ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.attr("readOnly", true)
      element.datepicker({ format:"D, d MM, yyyy",  pickTime: false}).on('changeDate', (ev) ->
        element.datepicker('hide');
      )  
  )
