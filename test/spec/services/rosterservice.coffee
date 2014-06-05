'use strict'

describe 'Service: RosterService', ->

  # load the service's module
  beforeEach module 'pemappApp'

  # instantiate service
  RosterService = {}
  beforeEach inject (_Rosterservice_) ->
    RosterService = _Rosterservice_

    ###
  it 'should do something', ->
    expect(!!RosterService).toBe true
    ###
