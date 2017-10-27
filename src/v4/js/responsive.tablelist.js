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
    var einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eadd = "add" + ns,
        eadded = "added" + ns;

    // Table class definition.
    var Table = function (element) {

        this.$element = $(element).addClass("table-list").attr("aria-role", "grid");
        this.$thead = this.$element.find("thead");
        this.$tfoot = this.$element.find("tfoot");
        this.$tbody = this.$element.find("tbody");
        this.$headerColumns = this.$thead.find("th");
        this.hasHeader = true;
        if (!this.$headerColumns.length) {
            this.hasHeader = false;
            this.$element.addClass(".no-thead");
            this.$headerColumns = this.$tbody.find("[scope=row]");
        }

        this.$headerColumns.attr({ "aria-role": "columnheader", "aria-hidden": "false" });
        this.$footerColumns = this.$tfoot.find("th").attr({ "aria-role": "columnheader", "aria-hidden": "false" });
        this.$bodyRows = this.$tbody.find("tr").attr("aria-role", "row");
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

        self.$element.trigger(addEvent);

        if (addEvent.isDefaultPrevented()) {

            return;
        }

        self.isAdded = true;

        $.each(self.$bodyRows, function () {

            var selector = self.hasHeader ? "th, td" : "td";
    
            $(this).find(selector).each(function (index) {

                var $this = $(this),
                    $headerColumn = selector === "td" ? $this.prev("[scope=row]") : $(self.$headerColumns[index]),
                    theadAttribute = $headerColumn.text(),
                    headerId = $headerColumn.attr("id") || "tablelist-" + $.pseudoUnique();

                $headerColumn.attr("id", headerId);
                $this.attr("data-thead", theadAttribute);
                $this.attr({ "aria-role": "gridcell", "aria-describedby": headerId });

                if (self.$tfoot.length) {
                    var $footerColumn = $(self.$footerColumns[index]),
                        tfootAttribute = $footerColumn.text(),
                        footerId = $footerColumn.attr("id") || "tablelist-" + $.pseudoUnique();

                    $this.attr("data-tfoot", tfootAttribute);
                    $this.attr({ "aria-role": "gridcell", "aria-describedby": footerId });
                }

                return true;
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

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_TABLE = true;

}(jQuery, window, ".r.tablelist", ".data-api"));