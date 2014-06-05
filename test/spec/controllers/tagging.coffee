'use strict'

describe 'Controller: TaggingctrlCtrl', ->

  # load the controller's module
  beforeEach module 'pemappApp'

  TaggingctrlCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    TaggingctrlCtrl = $controller 'TaggingctrlCtrl', {
      $scope: scope
    }

