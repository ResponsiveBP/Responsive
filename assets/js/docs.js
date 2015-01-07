(function ($, w, d) {

    "use strict";

    // Ensure the navigation is accessible.
    var $navigation = $("#navigation"),
        resize = function () {
            var currentIndex = $.support.currentGrid().index;

            // Small.
            if (currentIndex >= 2) {
                $navigation.attr({
                    "aria-hidden": false,
                    "tabindex": ""
                });
            } else if ($navigation.hasClass("collapse")) {
                $navigation.attr({
                    "aria-hidden": true,
                    "tabindex": -1
                });
            }
        },
         debouncedResize = $.debounce(resize, 50);;

    $(w).on("resize orientationchange", function () {
        debouncedResize();
    });

    $(d).on("ready", function () {
        resize();
    });

    //Back to Top scroll
    $("button.to-top").on("click", function (event) {
        event.preventDefault();

        // Normalize the velocity. Lets's say 100ms to travel 1000px.
        var baseVelocity = 1000 / 100,
            distance = $(this).offset().top,
            relativeTime = (distance / baseVelocity);

        $("html, body").animate({
            scrollTop: 0
        }, relativeTime);

    });
}(jQuery, window, document));