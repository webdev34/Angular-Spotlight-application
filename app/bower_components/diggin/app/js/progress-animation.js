'use strict';

angular
    .module('diggin')
    .directive('tunnel', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                progress: '=',
            },
            template: '<div><svg width="250" height="50"></svg></div>',
            link: function (scope, containingEl) {

                var element = $('svg', containingEl);
                var startPoint = {x: 20, y: 0};
                var endPoint = {x: 209, y: 0};
                var tunnelDepth = 25;
                var arcRadius = 15;

                var svgPathD = ['M', startPoint.x, startPoint.y];
                svgPathD = svgPathD.concat([
                    'L', startPoint.x, startPoint.y + tunnelDepth - arcRadius,
                    'A', arcRadius, arcRadius, 0, 0, 0, startPoint.x + arcRadius, startPoint.y + tunnelDepth,
                    'L', endPoint.x - arcRadius, endPoint.y + tunnelDepth,
                    'A', arcRadius, arcRadius, 0, 0, 0, endPoint.x, endPoint.y + tunnelDepth - arcRadius,
                    'L', endPoint.x, endPoint.y,
                ]);

                var pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathNode.setAttribute('d', svgPathD.join(' '));
                element.append(pathNode);

                var tunnelLength = pathNode.getTotalLength();
                scope.$watch('progress', function (progress) {

                    var progressLength = tunnelLength * progress;
                    pathNode.setAttribute('style', 'stroke-dasharray: ' + tunnelLength + '; stroke-dashoffset: ' + (tunnelLength - progressLength));
                });
            },
        };
    })
    .directive('sherlock', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                progress: '=',
                from: '&',
                to: '&',
            },
            template: '<div><div class="sherlock" style="right: {{ right }}%;"></div></div>',
            link: function (scope) {

                scope.$watch('progress', function (progress) {
                    console.log(progress);
                    scope.right = 90 * progress;
                });
            },
        };
    });
