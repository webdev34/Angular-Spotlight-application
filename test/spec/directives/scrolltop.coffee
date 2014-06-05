'use strict'

describe 'Directive: scrolltop', ->

  # load the directive's module
  beforeEach module 'pemappApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it "must add two numbers", ->
    expect(true).not.toBe(false)
    expect(true).toBe(true)