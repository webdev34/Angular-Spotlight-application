'use strict'

angular.module('pemappApp')
    .directive('annotable', () ->
        replace: true
        transclude: true
        template: '<div>
                    <div class="annotable-layer" ng-class="{\'hidden\': !enabled}">
                        <canvas></canvas>
                    </div>
                    <div class="annotable-transclude" ng-transclude></div>
                   </div>'
        restrict: 'A'
        link: (scope, element, attrs) ->
            canvasEl = element.find('canvas').eq(0)
            canvas = new fabric.Canvas(canvasEl[0], {
                isDrawingMode: true
            })
            canvas.freeDrawingBrush.width = 5
            canvas.freeDrawingBrush.color = 'yellow'
            scope.$on("annotable:toggle", (e,arg)->
                # HEIGHT = element.height()
                HEIGHT = (Math.max document.documentElement.clientHeight, window.innerHeight || 0) - 55
                WIDTH = element.width()
                if scope.enabled and !arg.annotateMode
                    console.log "clearing the layer"
                    canvas.clear()
                else
                    if HEIGHT >= element.height()
                        canvas.setHeight HEIGHT
                    else
                        canvas.setHeight element.height()
                    canvas.setWidth element.width()
                    canvas.renderAll()
                    canvas.on "after:render", ->
                        canvas.calcOffset()
                scope.enabled = arg.annotateMode
            )
            scope.$on("annotable:undo", (e, arg)->
                canvas.clear()
            )
            window.onresize = (evt)->
                #update canvas size
                HEIGHT = (Math.max document.documentElement.clientHeight, window.innerHeight || 0) - 55
                if element.height() > HEIGHT
                    canvas.setHeight element.height()
                else
                    canvas.setHeight HEIGHT
                canvas.setWidth element.width()
    )
