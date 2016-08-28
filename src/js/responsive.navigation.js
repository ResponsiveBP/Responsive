/*
 * Responsive Navigation
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_NAVIGATION) {
        return;
    }

    // General variables and methods.
    var $window = $(w),
        einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        emodalShow = "show.r.modal" + da,
        eclick = "click" + ns,
        efocusin = "focusin" + ns,
        ekeydown = "keydown" + ns,
        eshow = "show" + ns,
        eshown = "shown" + ns,
        ehide = "hide" + ns,
        ehidden = "hidden" + ns;

    var keys = {
        SPACE: 32,
        ESCAPE: 27
    };

    // The Navigation class definition
    var Navigation = function (element) {
        this.$element = $(element).addClass("navigation");
        this.defaults= {
            start: "xxs",
            end: "l"
        };
        this.$button = this.$element.children().first();
        this.isShown = null;
        this.lastScroll = 0;

        if (!this.$button.length) {
            this.$button = $("<button/>").text("Menu").prependTo(this.$element);
        }

        var id = this.$element.attr("id") || "navigation-" + $.pseudoUnique();

        this.$element.attr({
            "id": id,
            "role": "navigation"
        });

        this.$button.attr({
            "aria-controls": id,
            "aria-expanded": false
        });

        // Clone and add the nav to the body so it is accessible.
        this.$clone = this.$element.clone().removeAttr("id data-navigation")
            .removeClass("canvas-navigation")
            .addClass("visuallyhidden");

        this.$clone.children("button").first().remove();

        this.$clone.appendTo("body");

        // Bind events.
        this.$button.on(eclick, this.click.bind(this));
        $(document).on(efocusin, this.focus.bind(this)).on(emodalShow, function () { this.hide(true); }.bind(this));
    };

    Navigation.prototype.toggle = function () {
        this[this.$element.hasClass("open") ? "hide" : "show"]();
    };

    Navigation.prototype.show = function () {

        if (this.isShown) {
            return;
        }

        var showEvent = $.Event(eshow),
            shownEvent = $.Event(eshown);

        this.$element.trigger(showEvent);

        if (showEvent.isDefaultPrevented()) {
            return;
        }
        
        this.isShown = true;

        var complete = function () {
            this.transitioning = false;
            this.$button.attr({
                "aria-expanded": true
            });

            $(document).on(ekeydown, this.keydown.bind(this));

            this.$element.trigger(shownEvent);

        }.bind(this);

        this.lastScroll = $window.scrollTop();
        $.toggleBodyLock();

        // Do our callback
        this.$element.addClass("open visible").onTransitionEnd(complete);
    };

    Navigation.prototype.hide = function (noLock) {

        if (!this.isShown) {
            return;
        }

        var hideEvent = $.Event(ehide),
            hiddenEvent = $.Event(ehidden);

        this.$element.trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
            return;
        }
        
        this.isShown = false;

        var complete = function () {
            this.$element.removeClass("visible");
            this.$button.attr({
                "aria-expanded": false
            });
            this.transitioning = false;

            // Unbind the handlers
            $(document).off(ekeydown);

            this.$element.trigger(hiddenEvent);

        }.bind(this);

        if (!noLock) {
            $.toggleBodyLock();
            $window.scrollTop(this.lastScroll);
        }

        // Do our callback
        this.$element.removeClass("open")
            .onTransitionEnd(complete)
            .ensureTransitionEnd();
    };

    Navigation.prototype.click = function () {
        this.toggle();
    };

    Navigation.prototype.keydown = function (event) {

        if (event.which === keys.ESCAPE && this.$element.hasClass("open")) {
            this.hide();
        }
    };

    Navigation.prototype.focus = function (event) {

        // Ensure that focus is maintained within the menu.
        if (this.$element.hasClass("open")) {

            if (!event.shiftKey && event.target !== this.$element[0] && !$.contains(this.$element[0], event.target)) {
                this.$button.focus();
                return false;
            }
        } else {
            // Ensure that focus is moved from the clone to the menu.
            if (!event.shiftKey && (event.target === this.$clone[0] || $.contains(this.$clone[0], event.target))) {
                this.$button.focus().click();
                return false;
            }
        }
        return true;
    };

    // No conflict.
    var old = $.fn.navigation;

    // Plug-in definition 
    $.fn.navigation = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.navigation");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.navigation", (data = new Navigation(this)));
            }

            // Run the appropriate function is a string is passed.
            if (typeof options === "string" && /(show|hide)/.test(options)) {
                data[options]();
            }
        });
    };

    // Set the public constructor.
    $.fn.navigation.Constructor = Navigation;

    $.fn.navigation.noConflict = function () {
        $.fn.navigation = old;
        return this;
    };

    // Data API
    var init = function () {
        $("nav[data-navigation]").each(function () {
            var $this = $(this),
                loaded = $this.data("r.navigationLoaded");
            if (!loaded) {
                $this.data("r.navigationLoaded", true);
                $this.navigation();
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_NAVIGATION = true;

}(jQuery, window, ".r.navigation", ".data-api"));