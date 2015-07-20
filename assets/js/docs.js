(function ($, w, d) {

    "use strict";

    var initCookie = function () {
        // Get/Set cookie determining text direction. 
        var key = "responsive.direction",
            direction = Cookies.get(key),
            $html = $("html"),
            $trigger = $(".direction-trigger"),
            $icon = $trigger.children("i");

        if (direction === "rtl") {
            $html.attr("dir", direction);
            $icon.removeClass("fa-long-arrow-right").addClass("fa-long-arrow-left");
        }
        $trigger.on("click", function () {
            if (direction === "rtl") {
                direction = undefined;
                $html.attr("dir", "ltr");
                Cookies.remove(key);
                $icon.removeClass("fa-long-arrow-left").addClass("fa-long-arrow-right");
            } else {
                direction = "rtl";
                $html.attr("dir", direction);
                Cookies.set(key, direction);
                $icon.removeClass("fa-long-arrow-right").addClass("fa-long-arrow-left");
            }
        });
    }

    var initScroll = function () {
        // Back to Top scroll
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
    };

    var initBodyLock = function () {
        // Bind to body lock events.
        $("html").on("lock.r.bodylock", function (event) {
            var rtl = $.support.rtl;
            $(".nav-bar").css(rtl ? "padding-left" : "padding-right", event.padding);
        }).on("unlock.r.bodylock", function () {
            var rtl = $.support.rtl;
            $(".nav-bar").css(rtl ? "padding-left" : "padding-right", "");
        });
    };

    $(d).ready(function () {
        initCookie();
        initScroll();
        initBodyLock();
    });

}(jQuery, window, document));