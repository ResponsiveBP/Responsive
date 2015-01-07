(function ($, w, d) {

    "use strict";
    var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
    var conditionalHtml = "<div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div>";

    var conditionalOptions = {
        xxs: "../../css/ltr/grid/standard-xxs.html #grid",
        xs: "../../css/ltr/grid/standard-xs.html #grid",
        s: "../../css/ltr/grid/standard-s.html #grid",
        m: "../../css/ltr/grid/standard-m.html #grid",
        l: "../../css/ltr/grid/standard-l.html #grid",
    };

    module("conditional");

    // Ensure the plugin is present and accounted for.
    test("Conditional plugin should be defined on global jQuery object", function () {
        ok($(d.body).conditional, "conditional() method is defined.");
    });

    // Initialisation code.
    module("conditional.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveConditional = $.fn.conditional.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.conditional = $.fn.responsiveConditional;
            delete $.fn.responsiveConditional;

            // qunit is throwing when resizing outside test.
            // Uncaught Error: assertion outside test context.
            $(w).off("resize.r.conditional orientationchange.r.conditional");
        }
    });

    // No conflict.
    test("Conditional plugin should provide noConflict() function.", function () {
        strictEqual($.fn.conditional, undefined, "conditional plugin was set to undefined.");
    });

    // Data
    test("Conditional plugin should assign data to target element.", function () {
        var $autoSize = $(conditionalHtml).appendTo("#qunit-fixture")
                                          .responsiveConditional();

        notEqual($autoSize.data("r.conditional"), undefined, "Conditional target has data assigned.");
        equal(typeof ($autoSize.data("r.conditional")), "object", "Conditional target has data assigned.");
        equal($autoSize.data("r.conditional").constructor, $.fn.responsiveConditional.Constructor, "Conditional target has data assigned with the correct type.");
    });

    // Don't run in file system. TODO: Build a way to fix this.
    if (!rlocalProtocol.test(w.location.protocol)) {

        // Events
        test("Conditional plugin should fire load and loaded events when not local.", function (assert) {

            var done = assert.async();
            $(conditionalHtml).appendTo("#qunit-fixture")
                .on("load.r.conditional", function () {
                    ok(true, "Load event fired.");
                })
                .on("loaded.r.conditional", function () {
                    ok(true, "Loaded event fired.");
                    done();

                })
                .responsiveConditional(conditionalOptions);
        });

        test("Conditional plugin should not fire loaded event when load event is prevented.", function (assert) {

            var done = assert.async();
            $(conditionalHtml).appendTo("#qunit-fixture")
                .on("load.r.conditional", function (event) {
                    event.preventDefault();
                    ok(true, "Load event fired.");
                    done();
                })
                .on("loaded.r.conditional", function () {
                    ok(false, "Loaded event fired.");
                })
                .responsiveConditional(conditionalOptions);
        });
    }
}(jQuery, window, document))