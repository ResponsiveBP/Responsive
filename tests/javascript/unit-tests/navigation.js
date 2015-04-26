(function ($, w, d) {

    "use strict";

    var navHtml = "<nav>" +
                    "<button>Menu</button>" +
                    "<ul><li><a href=\"#\">Link 1</a></li></ul>" +
                  "</nav>";

    module("navigation");

    // Ensure the plugin is present and accounted for.
    test("Navigation plugin should be defined on global jQuery object", function () {
        ok($(d.body).navigation, "navigation() method is defined.");
    });

    // Initialisation code.
    module("navigation.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveNavigation = $.fn.navigation.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.navigation = $.fn.responsiveNavigation;
            delete $.fn.responsiveNavigation;
            $("nav").remove();
        }
    });

    // No conflict.
    test("Navigation plugin should provide noConflict() function.", function () {
        strictEqual($.fn.navigation, undefined, "navigation plugin was set to undefined.");
    });

    // Data
    test("Navigation plugin should assign data to target element.", function () {
        var $navigation = $(navHtml).appendTo("#qunit-fixture")
                                    .responsiveNavigation();

        notEqual($navigation.data("r.navigation"), undefined, "Navigation target has data assigned.");
        equal(typeof ($navigation.data("r.navigation")), "object", "Navigation target has data assigned.");
        equal($navigation.data("r.navigation").constructor, $.fn.responsiveNavigation.Constructor, "Navigation target has data assigned with the correct type.");
    });

    // Events
    test("Navigation plugin should fire show and shown events.", function (assert) {

        var done = assert.async();
        $(navHtml).appendTo("#qunit-fixture")
            .on("show.r.navigation", function () {
                ok(true, "Show event fired.");
            })
            .on("shown.r.navigation", function () {
                ok(true, "Shown event fired.");
                done();
            })
            .responsiveNavigation("show");
    });

    test("Navigation plugin should not fire shown event when show event is prevented.", function (assert) {

        var done = assert.async();
        $(navHtml).appendTo("#qunit-fixture")
            .on("show.r.navigation", function (event) {
                event.preventDefault();
                ok(true, "Show event fired.");
                done();
            })
            .on("shown.r.navigation", function () {
                ok(false, "Shown event fired.");
            })
            .responsiveNavigation("show");
    });

    test("Navigation plugin should fire hide and hidden events.", function (assert) {

        var done = assert.async();
        $(navHtml).prependTo("#qunit-fixture")
             .on("shown.r.navigation", function () {
                 $(this).responsiveNavigation("hide");
             })
            .on("hide.r.navigation", function () {
                ok(true, "Hide event fired.");
            })
            .on("hidden.r.navigation", function () {
                ok(true, "Hidden event fired.");
                done();
            })
            .responsiveNavigation("show");
    });

    test("Navigation plugin should not fire hidden event when hide event is prevented.", function (assert) {

        var done = assert.async();
        $(navHtml).prependTo("#qunit-fixture")
             .on("shown.r.navigation", function () {
                 $(this).responsiveNavigation("hide");
             })
            .on("hide.r.navigation", function (event) {
                event.preventDefault();
                ok(true, "Hide event fired.");
                done();
            })
            .on("hidden.r.navigation", function () {
                ok(false, "Hidden event fired.");
            })
            .responsiveNavigation("show");
    });

    // Accessibility
    test("Navigation plugin should have role applied.", function () {
        var $navHtml = $(navHtml);
        $navHtml.prependTo("#qunit-fixture")
                .responsiveNavigation();

        equal($navHtml.attr("role"), "navigation", "Navigation nav has role = navigation.");
    });

    test("Navigation plugin button should have aria-controls applied.", function () {
        var $navHtml = $(navHtml);
        $navHtml.prependTo("#qunit-fixture")
                .responsiveNavigation();

        var id = $navHtml.attr("id");

        equal($navHtml.children("button").attr("aria-controls"), id, "Navigation button has correct label.");
    });
}(jQuery, window, document))