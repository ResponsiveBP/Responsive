(function ($, w, d) {

    "use strict";

    var autoSizeHtml = "<textarea class=\"autosize\"/>";

    var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum diam sit amet nibh vehicula consequat nec sit amet enim. " +
               "Morbi venenatis iaculis magna, placerat aliquam mauris feugiat ultricies. Aliquam nunc diam, vulputate id velit faucibus, tincidunt fermentum eros." +
               "Vestibulum ut condimentum ligula. Ut rutrum consectetur ultricies. Curabitur mattis ex nec porttitor scelerisque. Donec mattis consequat augue quis vestibulum." +
               "Quisque et quam ut nisi consequat placerat faucibus et mauris. Vivamus lobortis arcu id lobortis elementum. Cras ultricies libero enim, quis dapibus quam ornare at. " +
               "Integer accumsan lorem ac lectus malesuada auctor. Curabitur pulvinar non ex ac hendrerit. Nulla facilisi. Duis sagittis libero ac lorem luctus placerat. " +
               "Nullam sed blandit augue. Donec turpis lectus, condimentum non bibendum et, dapibus vel lorem." +
               "Suspendisse sed tincidunt ipsum. Nunc tempus, nisl et sodales aliquet, enim est gravida arcu, ut molestie metus magna id lorem. Mauris volutpat massa quis nunc ullamcorper " +
               "blandit. Nunc nec urna turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nunc auctor, libero quis aliquet dictum, " +
               "massa neque viverra nisi, in varius massa leo et eros. Morbi fermentum libero enim, id volutpat est sagittis eu. Nulla augue purus, iaculis nec fermentum blandit, " +
               "porta pharetra massa. Integer neque ipsum, feugiat at mi eget, hendrerit rhoncus tellus. Suspendisse potenti.";

    module("autoSize");

    // Ensure the plugin is present and accounted for.
    test("AutoSize plugin should be defined on global jQuery object", function () {
        ok($(d.body).autoSize, "autoSize() method is defined.");
    });

    // Initialisation code.
    module("autoSize.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveAutoSize = $.fn.autoSize.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.autoSize = $.fn.responsiveAutoSize;
            delete $.fn.responsiveAutoSize;

            // qunit is throwing when resizing outside test.
            // Uncaught Error: assertion outside test context.
            $(w).off("resize.r.autosize orientationchange.r.autosize");
        }
    });

    // No conflict.
    test("AutoSize plugin should provide noConflict() function.", function () {
        strictEqual($.fn.autoSize, undefined, "AutoSize plugin was set to undefined.");
    });

    // Data
    test("AutoSize plugin should assign data to target element.", function () {
        var $autoSize = $(autoSizeHtml).appendTo("#qunit-fixture")
                                       .responsiveAutoSize();

        notEqual($autoSize.data("r.autosize"), undefined, "AutoSize target has data assigned.");
        equal(typeof ($autoSize.data("r.autosize")), "object", "AutoSize target has data assigned.");
        equal($autoSize.data("r.autosize").constructor, $.fn.responsiveAutoSize.Constructor, "AutoSize target has data assigned with the correct type.");
    });

    // Events
    test("AutoSize plugin should fire size and sized events.", function (assert) {

        var done = assert.async();
        $(autoSizeHtml).appendTo("#qunit-fixture")
            .one("size.r.autosize", function () {
                ok(true, "Size event fired.");
            })
            .one("sized.r.autosize", function () {
                ok(true, "Sized event fired.");
                done();
            })
            .responsiveAutoSize().val(text);
    });

    test("AutoSize plugin should not fire sized event when size event is prevented.", function (assert) {

        var done = assert.async();
        $(autoSizeHtml).appendTo("#qunit-fixture")
            .one("size.r.autosize", function (event) {
                event.preventDefault();
                ok(true, "Size event fired.");
                done();
            })
            .one("sized.r.autosize", function () {
                ok(false, "Sized event fired.");
            })
            .responsiveAutoSize().val(text);
    });

}(jQuery, window, document))