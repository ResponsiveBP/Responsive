/*
 * Responsive Tables
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_TABLE) {
        return;
    }

    // General variables and methods.
    var eready = "ready" + ns + da,
        echanged = ["domchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eadd = "add" + ns,
        eadded = "added" + ns;

    // Table class definition.
    var Table = function (element) {

        this.$element = $(element).addClass("table-list");
        this.$thead = this.$element.find("thead");
        this.$tfoot = this.$element.find("tfoot");
        this.$tbody = this.$element.find("tbody");
        this.$headerColumns = this.$thead.find("th");
        this.$footerColumns = this.$tfoot.find("th");
        this.$bodyRows = this.$tbody.find("tr");
        this.isAdded = null;

        this.add();
    };

    Table.prototype.add = function () {

        if (this.isAdded) {
            return;
        }

        var self = this,
            addEvent = $.Event(eadd),
            complete = function () {
                self.$element.trigger($.Event(eadded));
            };

        this.$element.trigger(addEvent);

        if (addEvent.isDefaultPrevented()) {

            return;
        }

        this.isAdded = true;

        $.each(this.$bodyRows, function () {

            $(this).find("th, td").each(function (index) {
                var $this = $(this),
                    theadAttribute = $(self.$headerColumns[index]).text();

                $this.attr("data-thead", theadAttribute);

                if (self.$tfoot.length) {

                    var tfootAttribute = $(self.$footerColumns[index]).text();
                    $this.attr("data-tfoot", tfootAttribute);
                }
            });
        });

        this.$element.redraw().addClass("fade-in");

        // Do our callback
        this.$element.onTransitionEnd(complete);
    };

    // No conflict.
    var old = $.fn.tablelist;

    // Plug-in definition 
    $.fn.tablelist = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.tablelist"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.tablelist", (data = new Table(this, opts)));
            }

            // Run the appropriate function is a string is passed.
            if (typeof options === "string") {
                data[options]();
            }
        });
    };

    // Set the public constructor.
    $.fn.tablelist.Constructor = Table;

    $.fn.tablelist.noConflict = function () {
        $.fn.tablelist = old;
        return this;
    };

    // Data API
    var init = function () {
        $("table[data-table-list]").each(function () {
            var $this = $(this),
                loaded = $this.data("r.tableLoaded");
            if (!loaded) {
                $this.data("r.tableLoaded", true);
                $this.tablelist($.getDataOptions($this, {}, "tablelist", "r"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([eready, echanged].join(" "), function (event) {
        event.type === "ready" ? init() : debouncedInit();
    });

    w.RESPONSIVE_TABLE = true;

}(jQuery, window, ".r.tablelist", ".data-api"));