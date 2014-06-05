'use strict'

angular.module('pemappApp').directive "fixSelect", ->
  require: "ngModel"
  link: ($scope, $element, $attrs, controller) ->
    #allows you to access sub-properties with dot notation (data.subproperty)
    getDescendantProp = (obj, desc) ->
      arr = desc.split(".")
      continue  while arr.length and (obj = obj[arr.shift()])
      obj
    
    #if any of the options match the value, replace the ngModel value
    setValueIfSame = ->
      options = getDescendantProp($scope, optionsProperty)
      angular.forEach options, (option) ->
        controller.$setViewValue option  if angular.equals(option, controller.$viewValue)
        return

      return
    optionsProperty = $attrs.fixSelect
    
    #watch when the options change
    $scope.$watch $attrs.fixSelect, setValueIfSame
    
    #watch when ng-model changes
    $scope.$watch (->
      controller.$viewValue
    ), setValueIfSame
    return

