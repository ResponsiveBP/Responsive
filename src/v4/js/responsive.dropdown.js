/*
 * Responsive Dropdown 
 */
/*jshint expr:true*/
/*global jQuery*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_DROPDOWN) {
        return;
    }

    // General variables.
    var supportTransition = w.getComputedStyle && $.support.transition,
        rtl = $.support.rtl,
        einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eclick = "click",
        ekeydown = "keydown",
        eshow = "show" + ns,
        eshown = "shown" + ns,
        ehide = "hide" + ns,
        ehidden = "hidden" + ns;

    var keys = {
        SPACE: 32,
        LEFT: 37,
        RIGHT: 39
    };

    // The Dropdown class definition
    var Dropdown = function (element, options) {

        this.$element = $(element);
        this.$target = $(options.target);
        this.defaults = {
            dimension: "height"
        };
        this.options = $.extend({}, this.defaults, options);
        this.$parent = null;
        this.transitioning = null;
        this.endSize = null;

        if (this.options.parent) {
            this.$parent = this.$target.closest(this.options.parent);
        }

        // Add accessibility features.
        var id = this.$element.attr("id") || "dropdown-" + $.pseudoUnique(),
            paneId = this.$target.attr("id") || "dropdown-" + $.pseudoUnique(),
            active = !this.$target.hasClass("collapse");

        this.$element.attr({
            "id": id,
            "role": "tab",
            "aria-controls": paneId,
            "aria-selected": active,
            "aria-expanded": active,
            "tabindex": 0
        });

        if (this.$parent) {
            this.$parent.attr({ "role": "tablist", "aria-multiselectable": "true" });

            // We're safe to add the attribute here since if it's not used then
            // data-api is disabled.
            this.$element.attr({
                "data-dropdown-parent": this.options.parent
            });

        }

        this.$target.attr({
            "id": paneId,
            "role": "tabpanel",
            "aria-labelledby": id,
            "aria-hidden": !active,
            "hidden": !active,
            "tabindex": active ? 0 : -1
        });

        // Bind events.
        this.$element.on(eclick, $.proxy(this.click, this));
        this.$element.on(ekeydown, $.proxy(this.keydown, this));
    };

    Dropdown.prototype.show = function () {

        if (this.transitioning || this.$target.hasClass("expand")) {
            return;
        }

        this.transitioning = true;

        var self = this,
            dimension = this.options.dimension,
            size,
            $actives = [];

        if (this.$parent) {
            // Get all the related open panes.
            $actives = this.$parent.find("[data-dropdown-parent=\"" + this.options.parent + "\"]");

            $actives = $.grep($actives, function (a) {
                var data = $(a).data("r.dropdown"),
                    $target = data && data.$target;

                return $target && !$target.hasClass("collapse") && data.$parent && data.$parent[0] === self.$parent[0];
            });
        }

        // Set the height/width to zero then to the height/width
        // so animation can take place.
        this.$target[dimension](0);

        if (supportTransition) {

            // Calculate the height/width.
            this.$target[dimension]("auto").attr({ "aria-hidden": false, "hidden": false });
            this.$target.find("[tabindex]:not(.collapse)").attr({ "aria-hidden": false, "hidden": false });

            size = w.getComputedStyle(this.$target[0])[dimension];

            // Reset to zero and force repaint.
            this.$target[dimension](0).redraw();
        }

        this.$target[dimension](size || "");

        this.transition("removeClass", $.Event(eshow, { relatedTarget: this.options.target }), eshown);

        if ($actives && $actives.length) {
            $.each($actives, function () {
                $(this).dropdown("hide");
            });
        }
    };

    Dropdown.prototype.hide = function () {

        if (this.transitioning || this.$target.hasClass("collapse")) {
            return;
        }

        this.transitioning = true;

        // Reset the height/width and then reduce to zero.
        var dimension = this.options.dimension,
            size;

        if (supportTransition) {

            // Set the height to auto, calculate the height/width and reset.
            size = w.getComputedStyle(this.$target[0])[dimension];

            // Reset the size and force repaint.
            this.$target[dimension](size).redraw(); // Force reflow ;
        }

        this.$target.removeClass("expand");
        this.$target[dimension](0);
        this.transition("addClass", $.Event(ehide, { relatedTarget: this.options.target }), ehidden);
    };

    Dropdown.prototype.toggle = function () {

        if (this.transitioning) {
            return;
        }

        // Run the correct command based on the presence of the class "collapse".
        this[this.$target.hasClass("collapse") ? "show" : "hide"]();
    };

    Dropdown.prototype.transition = function (method, startEvent, completeEvent) {

        var self = this,
            doShow = method === "removeClass",
            complete = function () {

                // The event to expose.
                var eventToTrigger = $.Event(completeEvent, { relatedTarget: self.options.target });

                // Ensure the height/width is set to auto.
                self.$target.removeClass("trans")[self.options.dimension]("");

                // Set the correct aria attributes.
                self.$target.attr({
                    "aria-hidden": !doShow,
                    "hidden": !doShow,
                    "tabindex": doShow ? 0 : -1
                });

                var $tab = $("#" + self.$target.attr("aria-labelledby")).attr({
                    "aria-selected": doShow,
                    "aria-expanded": doShow
                });

                if (doShow) {
                    $tab.focus();
                }

                // Toggle any children.
                self.$target.find("[tabindex]:not(.collapse)").attr({
                    "aria-hidden": !doShow,
                    "hidden": !doShow,
                    "tabindex": doShow ? 0 : -1
                });

                self.transitioning = false;

                self.$element.trigger(eventToTrigger);
            };

        this.$element.trigger(startEvent);

        if (startEvent.isDefaultPrevented()) {
            return;
        }

        // Remove or add the expand classes.
        this.$target[method]("collapse");
        this.$target[startEvent.type === "show" ? "addClass" : "removeClass"]("trans expand");

        this.$target.onTransitionEnd(complete);
    };

    Dropdown.prototype.click = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
    };

    Dropdown.prototype.keydown = function (event) {

        if (/input|textarea/i.test(event.target.tagName)) {
            return;
        }

        var which = event.which;

        if (which === keys.SPACE || which === keys.LEFT || which === keys.RIGHT) {

            event.preventDefault();
            event.stopPropagation();

            var $this = $(event.target);

            if (which === keys.SPACE) {
                this.toggle();
                return;
            }

            var $parent = this.options.parent ? $this.closest("[role=tablist]") : $this.closest(".accordion"),
                $items = $parent.find("[data-dropdown-parent=\"" + this.options.parent + "\"]"),
                index = $items.index($items.filter(":focus")),
                length = $items.length;

            if (which === keys.LEFT) {
                rtl ? index += 1 : index -= 1;
            } else if (which === keys.RIGHT) {
                rtl ? index -= 1 : index += 1;
            }

            // Ensure that the index stays within bounds.
            if (index === length) {
                index = 0;
            }

            if (index < 0) {
                index = length - 1;
            }

            var data = $($items.eq(index)).data("r.dropdown");
            data && data.show();
        }
    };

    // No conflict.
    var old = $.fn.dropdown;

    // Plug-in definition 
    $.fn.dropdown = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("r.dropdown"),
                opts = typeof options === "object" ? $.extend({}, options) : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.dropdown", (data = new Dropdown(this, opts)));
            }

            // Run the appropriate function if a string is passed.
            if (typeof options === "string" && /(show|hide|toggle)/.test(options)) {
                data[options]();
            }
        });
    };

    // Set the public constructor.
    $.fn.dropdown.Constructor = Dropdown;

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };

    // Data API
    var init = function () {
        $(":attrStart(data-dropdown)").each(function () {
            var $this = $(this),
                loaded = $this.data("r.dropdownLoaded");
            if (!loaded) {
                $this.data("r.dropdownLoaded", true);
                $this.dropdown($.getDataOptions($this, "dropdown"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_DROPDOWN = true;

}(jQuery, window, ".r.dropdown", ".data-api"));