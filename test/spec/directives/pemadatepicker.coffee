'use strict'

describe 'Directive: pemaDatepicker', ->

  # load the directive's module
  beforeEach module 'pemappApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  ###
  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<pema-datepicker></pema-datepicker>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the pemaDatepicker directive'
  ###
