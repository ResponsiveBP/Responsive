/*
 * Responsive Dropdown 
 */
/*jshint expr:true*/
/*global jQuery*/
(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_DROPDOWN) {
        return;
    }

    // General variables.
    var supportTransition = w.getComputedStyle && $.support.transition,
        eready = "ready" + ns,
        eclick = "click" + ns,
        ekeyup = "keyup" + ns,
        eshow = "show" + ns,
        eshown = "shown" + ns,
        ehide = "hide" + ns,
        ehidden = "hidden" + ns;

    var keys = {
        SPACE: 32,
        LEFT: 37,
        RIGHT: 39
    };

    // Private methods.
    var transition = function (method, startEvent, completeEvent) {

        var self = this,
            doShow = method === "removeClass",
            complete = function () {

                // The event to expose.
                var eventToTrigger = $.Event(completeEvent);

                // Ensure the height/width is set to auto.
                self.$element.removeClass("trans")[self.options.dimension]("");

                self.transitioning = false;

                // Set the correct aria attributes.
                self.$element.attr({
                    "aria-hidden": !doShow,
                    "tabindex": doShow ? 0 : -1,
                });

                $("#" + self.$element.attr("aria-labelledby")).attr({
                    "aria-selected": doShow,
                    "aria-expanded": doShow,
                    "tabindex": self.options.parent ? doShow ? 0 : -1 : 0
                });

                self.$element.trigger(eventToTrigger);
            };

        if (this.transitioning || startEvent.isDefaultPrevented()) {
            return;
        }

        this.transitioning = true;

        // Remove or add the expand classes.
        this.$element.trigger(startEvent)[method]("collapse");
        this.$element[startEvent.type === "show" ? "addClass" : "removeClass"]("expand trans");

        this.$element.onTransitionEnd(complete);
    };

    // The Dropdown class definition
    var Dropdown = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            dimension: "height"
        };
        this.options = $.extend({}, this.defaults, options);
        this.$parent = null;
        this.transitioning = null;
        this.endSize = null;

        if (this.options.parent) {
            this.$parent = this.$element.closest(this.options.parent);
        }

        // Add accessibility features.
        if (this.$parent) {
            this.$parent.attr({ "role": "tablist", "aria-multiselectable": "true" })
                .find("div:not(.collapse,.accordion-body)").attr("role", "presentation");
        } else {
            $(".accordion").find("div:not(.collapse,.accordion-body)").addBack().attr("role", "presentation");
        }

        var $tab = $("[href=" + this.options.target + "], [data-dropdown-target=" + this.options.target + "]"),
            tabId = $tab.attr("id") || "dropdown-" + $.pseudoUnique(),
            paneId = this.$element.attr("id") || "dropdown-" + $.pseudoUnique(),
            active = !this.$element.hasClass("collapse");

        $tab.attr({
            "id": tabId,
            "role": "tab",
            "aria-controls": paneId,
            "aria-selected": active,
            "aria-expanded": active,
            "tabindex": this.options.parent ? active ? 0 : -1 : 0
        });

        this.$element.attr({
            "id": paneId,
            "role": "tabpanel",
            "aria-labelledby": tabId,
            "aria-hidden": !active,
            "tabindex": active ? 0 : -1
        });
    };

    Dropdown.prototype.show = function () {

        if (this.transitioning || this.$element.hasClass("expand")) {
            return;
        }

        var dimension = this.options.dimension,
            actives = this.$parent && this.$parent.find(".dropdown-group:not(.collapse)"),
            hasData;

        // Set the height/width to zero then to the height/width
        // so animation can take place.
        this.$element[dimension](0);

        if (supportTransition) {

            // Calculate the height/width.
            this.$element[dimension]("auto");
            this.endSize = w.getComputedStyle(this.$element[0])[dimension];

            // Reset to zero and force repaint.
            this.$element[dimension](0).redraw();
        }

        this.$element[dimension](this.endSize || "");

        transition.call(this, "removeClass", $.Event(eshow), eshown);

        if (actives && actives.length) {
            hasData = actives.data("r.dropdown");
            actives.dropdown("hide");

            if (!hasData) {
                actives.data("r.dropdown", null);
            }
        }

    };

    Dropdown.prototype.hide = function () {

        if (this.transitioning || this.$element.hasClass("collapse")) {
            return;
        }

        if (this.$parent) {

            var actives = this.$parent.find(".dropdown-group:not(.collapse)").not(this.$element);

            if (!actives.length) {
                return;
            }
        }

        // Reset the height/width and then reduce to zero.
        var dimension = this.options.dimension,
            size;

        if (supportTransition) {

            // Set the height to auto, calculate the height/width and reset.
            size = w.getComputedStyle(this.$element[0])[dimension];

            // Reset the size and force repaint.
            this.$element[dimension](size).redraw(); // Force reflow ;
        }

        this.$element.removeClass("expand");
        this.$element[dimension](0);
        transition.call(this, "addClass", $.Event(ehide), ehidden);
    };

    Dropdown.prototype.toggle = function () {
        // Run the correct command based on the presence of the class "collapse".
        this[this.$element.hasClass("collapse") ? "show" : "hide"]();
    };

    Dropdown.prototype.keyup = function (event) {

        var which = event.which;

        if (which === keys.SPACE || which === keys.LEFT || which === keys.RIGHT) {

            // Ignore anything but left and right.
            var $this = $(event.target),
                $parent = this.options.parent ? $this.closest("[role=tablist]") : $this.closest(".accordion"),
                $items = $parent.find("[role=tab]"),
                index = $items.index($items.filter(":focus")),
                length = $items.length;

            if (which === keys.SPACE) {
                $("#" + $items.eq(index).attr("aria-controls")).data("r.dropdown").toggle();
            }

            if (which === keys.LEFT) {
                index -= 1;
            } else if (which === keys.RIGHT) {
                index += 1;
            }

            // Ensure that the index stays within bounds.
            if (index === length) {
                index = 0;
            }

            if (index < 0) {
                index = length - 1;
            }

            $items.eq(index).focus();

            event.preventDefault();
            event.stopPropagation();

        }
    };


    // Plug-in definition 
    $.fn.dropdown = function (options, event) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("r.dropdown"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.dropdown", (data = new Dropdown(this, opts)));
            }

            // Run the appropriate function if a string is passed.
            if (typeof options === "string") {
                data[options](event);
            }
        });
    };

    // Set the public constructor.
    $.fn.dropdown.Constructor = Dropdown;

    // No conflict.
    var old = $.fn.dropdown;
    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };

    // Dropdown data api initialization.
    $(document).on(eready, function () {
        $(":attrStart(data-dropdown)").each(function () {
            var $this = $(this),
                data = $this.data("r.dropdownOptions"),
                options = data || $.buildDataOptions($this, {}, "dropdown", "r"),
                target = options.target || (options.target = $this.attr("href")),
                $target = $(target);

            // Run the dropdown method.
            $target.dropdown(options);
        });
    }).on(eclick, ":attrStart(data-dropdown)[role=tab]", function (event) {

        event.preventDefault();

        // Load this again on click to cater for dynamically added components.
        var $this = $(this),
            data = $this.data("r.dropdownOptions"),
            options = data || $.buildDataOptions($this, {}, "dropdown", "r"),
            target = options.target || (options.target = $this.attr("href")),
            $target = $(target);

        // Run the dropdown method.
        $target.dropdown("toggle");

    }).on(ekeyup, ":attrStart(data-dropdown)[role=tab]", function (event) {

        var $this = $(this),
            data = $this.data("r.dropdownOptions"),
            options = data || $.buildDataOptions($this, {}, "dropdown", "r"),
            target = options.target || (options.target = $this.attr("href")),
            $target = $(target);

        $target.dropdown("keyup", event);

    });

    w.RESPONSIVE_DROPDOWN = true;

}(jQuery, window, ".r.dropdown"));