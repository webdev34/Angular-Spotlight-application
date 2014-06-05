'use strict'

describe 'Controller: SessionCtrl', ->

  # load the controller's module
  beforeEach module 'pemappApp'

  SessionCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ExcerptformCtrl = $controller 'SessionCtrl', {
      $scope: scope
    }

  it 'should do something', ->
    expect(true).toBe true
