'use strict'

describe 'Service: mode', ->

  # load the service's module
  beforeEach module 'pemappApp'

  # instantiate service
  mode = {}
  beforeEach inject (_mode_) ->
    mode = _mode_

  ###
  it 'should do something', ->
    expect(!!mode).toBe true
  ###
