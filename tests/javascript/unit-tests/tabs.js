(function ($, w, d) {

    "use strict";

    var tabsHtml = "<div class=\"tabs\">" +
                        "<ul>" +
                            "<li><a href=\"#\">tab1</a></li>" +
                            "<li><a href=\"#\">tab2</a></li>" +
                            "<li><a href=\"#\">tab3</a></li>" +
                        "</ul>" +
                        "<section/>" +
                        "<section/>" +
                        "<section/>" +
                    "</div>";

    module("tabs");

    // Ensure the plugin is present and accounted for.
    test("Tabs plugin should be defined on global jQuery object", function () {
        ok($(d.body).tabs, "tabs() method is defined.");
    });

    // Initialisation code.
    module("tabs.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveTabs = $.fn.tabs.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.tabs = $.fn.responsiveTabs;
            delete $.fn.responsiveTabs;
        }
    });

    // No conflict.
    test("Tabs plugin should provide noConflict() function.", function () {
        strictEqual($.fn.tabs, undefined, "tabs plugin was set to undefined.");
    });

    // Data
    test("Tabs plugin should assign data to target element.", function () {
        var $tabs = $(tabsHtml).appendTo("#qunit-fixture")
                               .responsiveTabs();

        notEqual($tabs.data("r.tabs"), undefined, "Tabs target has data assigned.");
        equal(typeof ($tabs.data("r.tabs")), "object", "Tabs target has data assigned.");
        equal($tabs.data("r.tabs").constructor, $.fn.responsiveTabs.Constructor, "Tabs target has data assigned with the correct type.");
    });

    // Events
    test("Tabs plugin should fire show and shown events.", function (assert) {

        var done = assert.async();
        $(tabsHtml).appendTo("#qunit-fixture")
            .on("show.r.tabs", function () {
                ok(true, "Show event fired.");
            })
            .on("shown.r.tabs", function () {
                ok(true, "Shown event fired.");
                done();
            })
            .responsiveTabs(1);
    });

    test("Tabs plugin should not fire shown event when show event is prevented.", function (assert) {

        var done = assert.async();
        $(tabsHtml).appendTo("#qunit-fixture")
            .on("show.r.tabs", function (event) {
                event.preventDefault();
                ok(true, "Show event fired.");
                done();
            })
            .on("shown.r.tab", function () {
                ok(false, "Shown event fired.");
            })
            .responsiveTabs(2);
    });

    // Accessibility
    test("Selected tab should have aria-selected equal to true.", function () {
        var $tabs = $(tabsHtml).appendTo("#qunit-fixture")
                               .responsiveTabs();

        $tabs.find("li:last a").click();
        equal($tabs.find("li:last a").attr("aria-selected"), "true", "Shown tab has aria-selected = true.");
        equal($tabs.find("li:not(:last) a").attr("aria-selected"), "false", "Hidden tab has aria-selected = false.");
    });

    test("Selected tab pane should have tabIndex equal to 0.", function () {
        var $tabs = $(tabsHtml).appendTo("#qunit-fixture")
                               .responsiveTabs();

        $tabs.find("li:last a").click();
        equal($tabs.find("section:last").attr("tabIndex"), "0", "Shown tab has tabIndex = 0.");
        equal($tabs.find("section:not(:last)").attr("tabIndex"), "-1", "Hidden tab has tabIndex = -1.");
    });

    test("Tab pane and tabs should have aria connected id's.", function () {
        var $tabs = $(tabsHtml).appendTo("#qunit-fixture")
                               .responsiveTabs();

        var tabId = $tabs.find("li:last a").attr("id"),
            paneId = $tabs.find("section:last").attr("id");

        equal($tabs.find("section:last").attr("aria-labelledby"), tabId, "Tab pane is labelled by tab via aria-labelledby.");
        equal($tabs.find("li:last a").attr("aria-controls"), paneId, "Tab controls tab pane via aria-controls.");
    });
}(jQuery, window, document))