(function ($, w, d) {

    "use strict";

    var modalHtml = "<button>Trigger</button>";

    var modalTargetHtml = "<div id=\"modal-target\">" +
                             "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temporincididunt " +
                             "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrudexercitation ullamco " +
                             "laboris nisi ut aliquip ex ea commodo consequat. Duis auteirure dolor in reprehenderit in voluptate " +
                             "velit esse cillum dolore eu fugiat nullapariatur. Excepteur sint occaecat cupidatat non proident, sunt " +
                             "in culpa qui officiadeserunt mollit anim id est laborum.</p>" +
                             "</div>";

    module("modal");

    // Ensure the plugin is present and accounted for.
    test("Modal plugin should be defined on global jQuery object", function () {
        ok($(d.body).modal, "modal() method is defined.");
    });

    // Initialisation code.
    module("modal.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveModal = $.fn.modal.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.modal = $.fn.responsiveModal;
            delete $.fn.responsiveModal;

            $(".modal-overlay").remove();
            $("html").removeClass("modal-on").removeAttr("style");
        }
    });

    // No conflict.
    test("Modal plugin should provide noConflict() function.", function () {
        strictEqual($.fn.modal, undefined, "Modal plugin was set to undefined.");
    });

    // Data
    test("Modal plugin should assign data to target element.", function () {
        $(modalTargetHtml).appendTo("#qunit-fixture");
        var $modal = $(modalHtml).prependTo("#qunit-fixture")
                                 .responsiveModal({ target: "#modal-target" });

        notEqual($modal.data("r.modal"), undefined, "Modal target has data assigned.");
        equal(typeof ($modal.data("r.modal")), "object", "Modal target has data assigned.");
        equal($modal.data("r.modal").constructor, $.fn.responsiveModal.Constructor, "Modal target has data assigned with the correct type.");
    });

    // Events
    test("Modal plugin should fire show and shown events.", function (assert) {

        var done = assert.async();
        $(modalTargetHtml).appendTo("#qunit-fixture");
        $(modalHtml).prependTo("#qunit-fixture")
            .on("show.r.modal", function () {
                ok(true, "Show event fired.");
            })
            .on("shown.r.modal", function () {
                ok(true, "Shown event fired.");
                done();
            })
            .responsiveModal({ target: "#modal-target" }).responsiveModal("show");
    });

    test("Modal plugin should not fire shown event when show event is prevented.", function (assert) {

        var done = assert.async();
        $(modalTargetHtml).appendTo("#qunit-fixture");
        $(modalHtml).prependTo("#qunit-fixture")
            .on("show.r.modal", function (event) {
                event.preventDefault();
                ok(true, "Show event fired.");
                done();
            })
            .on("shown.r.modal", function () {
                ok(false, "Shown event fired.");
            })
            .responsiveModal({ target: "#modal-target" }).responsiveModal("show");
    });

    test("Modal plugin should fire hide and hidden events.", function (assert) {

        var done = assert.async();
        $(modalTargetHtml).appendTo("#qunit-fixture");
        $(modalHtml).prependTo("#qunit-fixture")
             .on("shown.r.modal", function () {
                 $(this).responsiveModal("hide");
             })
            .on("hide.r.modal", function () {
                ok(true, "Hide event fired.");
            })
            .on("hidden.r.modal", function () {
                ok(true, "Hidden event fired.");
                done();
            })
            .responsiveModal({ target: "#modal-target" })
            .responsiveModal("show");
    });

    test("Modal plugin should not fire hidden event when hide event is prevented.", function (assert) {

        var done = assert.async();
        $(modalTargetHtml).appendTo("#qunit-fixture");
        $(modalHtml).prependTo("#qunit-fixture")
             .on("shown.r.modal", function () {
                 $(this).responsiveModal("hide");
             })
            .on("hide.r.modal", function (event) {
                event.preventDefault();
                ok(true, "Hide event fired.");
                done();
            })
            .on("hidden.r.modal", function () {
                ok(false, "Hidden event fired.");
            })
            .responsiveModal({ target: "#modal-target" })
            .responsiveModal("show");
    });

    // Accessibility
    test("Modal plugin should have role applied.", function () {

        $(modalTargetHtml).appendTo("#qunit-fixture");
        $(modalHtml).prependTo("#qunit-fixture")
                    .responsiveModal({ target: "#modal-target" }).responsiveModal("show");

        equal($(".modal-overlay").attr("role"), "document", "Modal overlay has role = document.");
    });

    test("Modal plugin should have aria-labelledby applied.", function () {

        $(modalTargetHtml).appendTo("#qunit-fixture");
        $(modalHtml).prependTo("#qunit-fixture")
                    .responsiveModal({
                        target: "#modal-target",
                        title: "test"
                    })
                    .responsiveModal("show");

        var id = $(".modal-header h2").attr("id");

        equal($(".modal-overlay").attr("aria-labelledby"), id, "Modal overlay has correct label.");
    });
}(jQuery, window, document))