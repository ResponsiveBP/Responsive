(function ($, w, d) {

    module("tablelist");

    var tableListHtml = "<table>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th>Title</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td/>" +
                                "</tr>" +
                            "</tbody>" +
                        "</table>";


    // Ensure the plugin is present and accounted for.
    test("Tablelist plugin should be defined on global jQuery object", function () {
        ok($(d.body).tablelist, "tablelist() method is defined.");
    });

    // Initialisation code.
    module("tablelist.plugin", {
        beforeEach: function () {
            // Run all tests in noConflict mode. This allows us to test the reassignment functionality.
            $.fn.responsiveTablelist = $.fn.tablelist.noConflict();
        },
        afterEach: function () {
            // Reassign and cleanup.
            $.fn.tablelist = $.fn.responsiveTablelist;
            delete $.fn.responsiveTablelist;
        }
    });

    // No conflict.
    test("Tablelist plugin should provide noConflict() function.", function () {
        strictEqual($.fn.tablelist, undefined, "tablelist plugin was set to undefined.");
    });

    // Data
    test("Tablelist plugin should assign data to target element.", function () {
        var $tableList = $(tableListHtml).appendTo("#qunit-fixture")
                                         .responsiveTablelist();

        notEqual($tableList.data("r.tablelist"), undefined, "Tablelist target has data assigned.");
        equal(typeof ($tableList.data("r.tablelist")), "object", "Tablelist target has data assigned.");
        equal($tableList.data("r.tablelist").constructor, $.fn.responsiveTablelist.Constructor, "Tablelist target has data assigned with the correct type.");
    });

    // Events
    test("Tablelist plugin should fire add and added events.", function (assert) {

        var done = assert.async();
        $(tableListHtml).appendTo("#qunit-fixture")
            .on("add.r.tablelist", function () {
                ok(true, "Add event fired.");
            })
            .on("added.r.tablelist", function () {
                ok(true, "Added event fired.");
                done();
            })
            .responsiveTablelist();
    });

    test("Tablelist plugin should not fire added event when add event is prevented.", function (assert) {

        var done = assert.async();
        $(tableListHtml).appendTo("#qunit-fixture")
            .on("add.r.tablelist", function (event) {
                event.preventDefault();
                ok(true, "Add event fired.");
                done();
            })
            .on("added.r.tablelist", function () {
                ok(false, "Added event fired.");
            })
            .responsiveTablelist();
    });

    // Attributes
    test("Table header tab should have data-thead attribute assigned.", function () {
        var $tableList = $(tableListHtml).appendTo("#qunit-fixture")
                                         .responsiveTablelist();

        equal($tableList.find("td").attr("data-thead"), "Title", "Table cell has attribute data-thead = Title.");
    });

}(jQuery, window, document))