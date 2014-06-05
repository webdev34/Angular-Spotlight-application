var scaleViewport = (function (window) {
    'use strict';

    return function (contentWidth) {

        var viewportNode = window.document.querySelector('meta[name="viewport"]');

        var adjustScale = function () {

            var deviceWidth  = window.innerWidth;
            var initialScale = deviceWidth / contentWidth;
            viewportNode.content = viewportNode.content.replace(/(initial-scale=)[0-9.]+/, '$1' + initialScale);
        };

        window.document.addEventListener('orientationchange', adjustScale, false);
        adjustScale();
    };

})(window);
