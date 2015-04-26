(function ($, w, d) {

    "use strict";

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