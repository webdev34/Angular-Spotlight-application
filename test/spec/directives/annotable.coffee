'use strict'

describe 'Directive: annotatable', () ->

  # load the directive's module
  beforeEach module 'pemappApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it "Must hold self-evident truths, true", ->
    expect(true).toBe(true)