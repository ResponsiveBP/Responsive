(function ($, w, d) {

    "use strict";

    var carouselHtml = "<div id=\"carousel\" class=\"carousel\">" +
                       "<ol><li></li><li></li><li></li></ol>" +
                       "<figure class=\"carousel-active\"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p></figure>" +
                       "<figure><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p></figure>" +
                       "<figure><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</p></figure>" +
                       "<button>&lt;</button>" +
                       "<button class=\"forward\">&gt;</button>" +
                       "</div>";

    module("carousel");

    // Ensure the plugin is present and accounted for.
    test("Carousel plugin should be defined on global jQuery object", function () {
        ok($(d.body).carousel, "carousel() method is defined.");
    });

    // Initialisation code.
    module("carousel.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveCarousel = $.fn.carousel.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.carousel = $.fn.responsiveCarousel;
            delete $.fn.responsiveCarousel;
        }
    });

    // No conflict.
    test("Carousel plugin should provide noConflict() function.", function () {
        strictEqual($.fn.carousel, undefined, "Carousel plugin was set to undefined.");
    });

    // Data
    test("Carousel plugin should assign data to target element.", function () {
        var $carousel = $(carouselHtml).appendTo("#qunit-fixture")
                                       .responsiveCarousel();

        notEqual($carousel.data("r.carousel"), undefined, "Carousel target has data assigned.");
        equal(typeof ($carousel.data("r.carousel")), "object", "Carousel target has data assigned.");
        equal($carousel.data("r.carousel").constructor, $.fn.responsiveCarousel.Constructor, "Carousel target has data assigned with the correct type.");
    });

    // Events
    test("Carousel plugin should fire slide and slid events.", function (assert) {

        var done = assert.async();
        $(carouselHtml).appendTo("#qunit-fixture")
            .one("slide.r.carousel", function () {
                ok(true, "Slide event fired.");
            })
            .one("slid.r.carousel", function () {
                ok(true, "Slid event fired.");
                done();
            })
            .responsiveCarousel({ interval: 1 });
    });

    test("Carousel plugin should not fire slid event when slide event is prevented.", function (assert) {

        var done = assert.async();
        $(carouselHtml).appendTo("#qunit-fixture")
            .one("slide.r.carousel", function (event) {
                event.preventDefault();
                ok(true, "Slide event fired.");
                done();
            })
            .one("slid.r.carousel", function () {
                ok(false, "Slid event fired.");
            })
            .responsiveCarousel({ interval: 1 });
    });

}(jQuery, window, document))