/*
 * Responsive tabs
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_TABS) {
        return;
    }

    // General variables.
    var eready = "ready" + ns,
        eclick = "click" + ns,
        ekeydown = "keydown" + ns,
        eshow = "show" + ns,
        eshown = "shown" + ns;

    var keys = {
        LEFT: 37,
        RIGHT: 39
    };

    // Private methods.
    var tab = function (activePosition, postion, callback) {

        var showEvent = $.Event(eshow),
            $element = this.$element,
            $childTabs = $element.children("ul").find("li"),
            $childPanes = $element.children(":not(ul)"),
            $nextTab = $childTabs.eq(postion),
            $currentPane = $childPanes.eq(activePosition),
            $nextPane = $childPanes.eq(postion);

        $element.trigger(showEvent);

        if (this.tabbing || showEvent.isDefaultPrevented()) {
            return;
        }

        this.tabbing = true;

        $childTabs.removeClass("tab-active").children("a").attr({ "aria-selected": false, "tabIndex": -1 });
        $nextTab.addClass("tab-active").children("a").attr({ "aria-selected": true, "tabIndex": 0 }).focus();

        // Do some class shuffling to allow the transition.
        $currentPane.addClass("fade-out fade-in");
        $nextPane.attr({ "tabIndex": 0 }).addClass("tab-pane-active fade-out");
        $childPanes.filter(".fade-in").attr({ "tabIndex": -1 }).removeClass("tab-pane-active fade-in");

        // Force redraw.
        $nextPane.redraw().addClass("fade-in");

        // Do the callback
        callback.call(this, $nextPane);

    };

    // Tabs class definition
    var Tabs = function (element) {

        this.$element = $(element);
        this.tabbing = null;

        // Add accessibility features.
        var $tablist = this.$element.children("ul:first").attr("role", "tablist"),
            $triggers = $tablist.children().attr("role", "presentation"),
            $panes = this.$element.children(":not(ul)"),
            id = $.pseudoUnique();

        $triggers.each(function (index) {
            var $this = $(this),
                $tab = $this.children("a");

            $tab.attr({
                "role": "tab",
                "id": "tab-" + id + "-" + index,
                "aria-controls": "pane-" + id + "-" + index,
                "aria-selected": $this.hasClass("tab-active") ? true : false,
                "tabIndex": $this.hasClass("tab-active") ? 0 : -1
            });

            $panes.eq(index).attr({
                "role": "tabpanel",
                "id": "pane-" + id + "-" + index,
                "aria-labelledby": "tab-" + id + "-" + index,
                "tabIndex": $this.hasClass("tab-active") ? 0 : -1
            });
        });
    };

    Tabs.prototype.show = function (position) {

        var $activeItem = this.$element.find(".tab-active"),
            $children = $activeItem.parent().children(),
            activePosition = $children.index($activeItem),
            self = this;

        if (position > ($children.length - 1) || position < 0) {

            return false;
        }

        if (activePosition === position) {
            return false;
        }

        // Call the function with the callback
        return tab.call(this, activePosition, position, function ($item) {

            var complete = function () {

                self.tabbing = false;
                self.$element.trigger($.Event(eshown));
            };

            // Do our callback
            $item.onTransitionEnd(complete);
        });
    };

    Tabs.prototype.keydown = function (event) {

        var which = event.which;

        // Ignore anything but left and right.
        if (which === keys.LEFT || which === keys.RIGHT) {

            var $this = $(event.target),
                $li = $this.parent(),
                $all = $li.siblings().addBack(),
                length = $all.length,
                index = $li.index();

            // Ensure that the index stays within bounds.
            index = which === keys.LEFT ? index - 1 : index + 1;

            if (index === length) {
                index = 0;
            }

            if (index < 0) {
                index = length - 1;
            }

            this.show(index);
        }

    };

    // Plug-in definition 
    $.fn.tabs = function (options, event) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.tabs");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.tabs", (data = new Tabs(this)));
            }

            // Show the given number.
            if (typeof options === "number") {
                data.show(options);
            }

            if (options === "keydown") {
                data.keydown(event);
            }

        });
    };

    // Set the public constructor.
    $.fn.tabs.Constructor = Tabs;

    // No conflict.
    var old = $.fn.tabs;
    $.fn.tabs.noConflict = function () {
        $.fn.tabs = old;
        return this;
    };

    // Data API
    $(document).on(eready, function () {
        $("[data-tabs]").tabs();
    });

    $(document).on(eclick, "ul[role=tablist] [role=tab]", function (event) {

        event.preventDefault();

        var $this = $(this),
            $li = $this.parent(),
            $tabs = $this.closest("[data-tabs], .tabs"),
            index = $li.index();

        $tabs.tabs(index);

    }).on(ekeydown, "ul[role=tablist] [role=tab]", function (event) {

        $(this).closest("[data-tabs], .tabs").tabs("keydown", event);

    });

    w.RESPONSIVE_TABS = true;

}(jQuery, window, ".r.tabs"));