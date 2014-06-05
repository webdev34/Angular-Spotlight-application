'use strict'

describe 'Controller: NavCtrl', () ->

  # load the controller's module
  beforeEach module 'pemappApp'

  NavCtrl = {}
  scope = {}
  injectables = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope, $location, $routeParams) ->
    injectables.$rootScope = $rootScope
    injectables.$location = $location
    injectables.$routeParams = $routeParams
    scope = $rootScope.$new()
    NavCtrl = $controller 'NavCtrl', {
      $scope: scope
    }

  describe "goToWall function", ->
    beforeEach ->
      spyOn(injectables.$rootScope, 'resetAnnotation')
      spyOn(injectables.$location, 'path')


    it "must be defined", ->
      expect(injectables.$rootScope.goToWall).toBeDefined()

    it "must call resetAnnotation() method", ->
      injectables.$rootScope.goToWall()
      expect(injectables.$rootScope.resetAnnotation).toHaveBeenCalled()

    it "must redirect to the wall", ->
      injectables.$routeParams.sectionName = 'abc'
      injectables.$routeParams.sessionId = 1
      injectables.$rootScope.goToWall()
      expect(injectables.$location.path).toHaveBeenCalledWith('/section/' + injectables.$routeParams.sectionName + '/session/' + injectables.$routeParams.sessionId + '/wall/')