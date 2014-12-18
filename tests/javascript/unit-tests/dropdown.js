(function ($, w, d) {

    "use strict";

    var dropdownHtml = "<button>Click me to toggle</button>";

    var dropdownTargetHtml = "<div class=\"collapse\" id=\"collapse\">" +
                             "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temporincididunt " +
                             "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco " +
                             "laboris nisi ut aliquip ex ea commodo consequat. Duis auteirure dolor in reprehenderit in voluptate " +
                             "velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt " +
                             "in culpa qui officiadeserunt mollit anim id est laborum.</p>" +
                             "</div>";

    module("dropdown");

    // Ensure the plugin is present and accounted for.
    test("Dropdown plugin should be defined on global jQuery object", function () {
        ok($(d.body).dropdown, "dropdown() method is defined.");
    });

    // Initialisation code.
    module("dropdown.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveDropdown = $.fn.dropdown.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.dropdown = $.fn.responsiveDropdown;
            delete $.fn.responsiveDropdown;
        }
    });

    // No conflict.
    test("Dropdown plugin should provide noConflict() function.", function () {
        strictEqual($.fn.dropdown, undefined, "dropdown plugin was set to undefined.");
    });

    // Data
    test("Dropdown plugin should assign data to target element.", function () {
        $(dropdownTargetHtml).appendTo("#qunit-fixture");
        var $dropdown = $(dropdownHtml).prependTo("#qunit-fixture")
                                       .responsiveDropdown({ target: "#collapse1" });

        notEqual($dropdown.data("r.dropdown"), undefined, "Dropdown target has data assigned.");
        equal(typeof ($dropdown.data("r.dropdown")), "object", "Dropdown target has data assigned.");
        equal($dropdown.data("r.dropdown").constructor, $.fn.responsiveDropdown.Constructor, "Dropdown target has data assigned with the correct type.");
    });

    // Events
    test("Dropdown plugin should fire show and shown events.", function (assert) {

        var done = assert.async();
        $(dropdownTargetHtml).appendTo("#qunit-fixture");
        $(dropdownHtml).prependTo("#qunit-fixture")
            .on("show.r.dropdown", function () {
                ok(true, "Show event fired.");
            })
            .on("shown.r.dropdown", function () {
                ok(true, "Shown event fired.");
                done();
            })
            .responsiveDropdown({ target: "#collapse" }).responsiveDropdown("show");
    });

    test("Dropdown plugin should not fire shown event when show event is prevented.", function (assert) {

        var done = assert.async();
        $(dropdownTargetHtml).appendTo("#qunit-fixture");
        $(dropdownHtml).prependTo("#qunit-fixture")
            .on("show.r.dropdown", function (event) {
                event.preventDefault();
                ok(true, "Show event fired.");
                done();
            })
            .on("shown.r.dropdown", function () {
                ok(false, "Shown event fired.");
            })
            .responsiveDropdown({ target: "#collapse" }).responsiveDropdown("show");
    });

    test("Dropdown plugin should fire hide and hidden events.", function (assert) {

        var done = assert.async();
        $(dropdownTargetHtml).removeClass("collapse").appendTo("#qunit-fixture");
        $(dropdownHtml).prependTo("#qunit-fixture")
            .on("hide.r.dropdown", function () {
                ok(true, "Hide event fired.");
            })
            .on("hidden.r.dropdown", function () {
                ok(true, "Hidden event fired.");
                done();
            })
            .responsiveDropdown({ target: "#collapse" }).responsiveDropdown("hide");
    });

    test("Dropdown plugin should not fire hidden event when hide event is prevented.", function (assert) {

        var done = assert.async();
        $(dropdownTargetHtml).removeClass("collapse").appendTo("#qunit-fixture");
        $(dropdownHtml).prependTo("#qunit-fixture")
            .on("hide.r.dropdown", function (event) {
                event.preventDefault();
                ok(true, "Hide event fired.");
                done();
            })
            .on("hidden.r.dropdown", function () {
                ok(false, "Hidden event fired.");
            })
            .responsiveDropdown({ target: "#collapse" }).responsiveDropdown("hide");
    });

}(jQuery, window, document))