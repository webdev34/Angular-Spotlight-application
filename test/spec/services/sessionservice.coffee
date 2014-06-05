'use strict'

describe 'Service: SessionService', ->

  # load the service's module
  beforeEach module 'pemappApp'

  # instantiate service
  SessionService = {}
  beforeEach inject (_Sessionservice_) ->
    SessionService = _Sessionservice_

  ###
  it 'should do something', ->
    expect(!!SessionService).toBe true
  ###
