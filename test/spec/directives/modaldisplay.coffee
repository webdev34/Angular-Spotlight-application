'use strict'

describe 'Directive: modalDisplay', ->

  # load the directive's module
  beforeEach module 'pemappApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  ###
  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<modal-display></modal-display>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the modalDisplay directive'
  ###
