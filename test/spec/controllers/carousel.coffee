'use strict'

describe 'Controller: CarouselCtrl', ->

  # load the controller's module
  beforeEach module 'pemappApp'

  CarouselCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    CarouselCtrl = $controller 'CarouselCtrl', {
      $scope: scope
    }

