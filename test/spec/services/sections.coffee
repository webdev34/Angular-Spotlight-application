'use strict'

describe 'Service: sections', ->

  # load the service's module
  beforeEach module 'pemappApp'

  # instantiate service
  sections = {}
  beforeEach inject (_sections_) ->
    sections = _sections_

