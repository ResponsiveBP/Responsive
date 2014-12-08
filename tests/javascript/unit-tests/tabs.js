(function ($, w, d) {

    "use strict";

    module("tabs plugin");

    // Ensure the plugin is present and accounted for.
    test("Plugin should be defined on global jQuery object", function () {
        ok($(d.body).tabs, "tabs() method is defined.");
    });

    // Initialisation code.
    module("tabs", {
        setup: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveTabs = $.fn.tabs.noConflict();
        },
        teardown: function () {
            // Reassign and cleanup.
            $.fn.tabs = $.fn.responsiveTabs;
            delete $.fn.responsiveTabs;
        }
    });

    test("Plugin should provide noConflict() function.", function () {
        strictEqual($.fn.tabs, undefined, "tabs plugin was set to undefined.");
    });

}(jQuery, window, document))