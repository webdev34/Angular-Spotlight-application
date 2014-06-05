'use strict'

angular.module('pemappApp')
  .service "dateParser", () ->
    thisDate = ''
    @currentDate = ->
      thisDate = new Date()
      thisDate = thisDate.toDateString();
    
    return thisDate
 
    