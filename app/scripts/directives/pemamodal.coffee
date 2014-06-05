'use strict'

angular.module('pemappApp').directive "pemaModal", ->
  (scope, element, attr, $rootScope) ->
    
    #Fixes ipad keyboard bug for datepicker position
    if navigator.userAgent.match(/iPhone|iPad|iPod/i)
      $(".modal").on "show.bs.modal", ->
        # Position modal absolute and bump it down to the scrollPosition
        $(this).css
          position: "absolute"
          marginTop: $(window).scrollTop() + "px"
          bottom: "auto"

        if  $('.modal').hasClass "in"
          $('.modal').css
            marginTop: "0%"
        
        # Position backdrop absolute and make it span the entire page
        #
        # Also dirty, but we need to tap into the backdrop after Boostrap 
        # positions it but before transitions finish.
        #
        setTimeout (->
          $(".modal").css
            position: "absolute"
            top: 0
            left: 0
            width: "100%"
            height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) + "px"

          return
        ), 0
        return

    element.bind "click", ->
      if !element.hasClass('disabled')
        if attr.modalHidden is 'false'
        #Should be a better way to trigger this modal
          angular.element( '#' + attr.pemaModal ).modal() 
        else
          angular.element( '#' + attr.pemaModal ).modal('hide')  
          angular.element( '.modal-backdrop' ).hide()
      
      
