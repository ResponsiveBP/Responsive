/*
 * Responsive Dismiss 
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_DISMISS) {
        return;
    }

    // General variables.
    var einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eclick = "click",
        edismiss = "dismiss" + ns,
        edismissed = "dismissed" + ns;

    // Dismiss class definition
    var Dismiss = function (element, options) {

        this.defaults = {
            closeHint: "Click to close"
        };

        this.options = $.extend({}, this.defaults, options);

        this.$element = $(element).attr({ "type": "button" });
        this.$target = this.$element.closest(options.target);
        this.dismissing = null;

        // A11y goodness.
        if (this.$element.is("button")) {
            $(element).attr({ "type": "button" });
        }

        if (this.$target.hasClass("alert")) {
            this.$target.attr({ "role": "alert" });
        }

        if (!this.$element.find(".visuallyhidden").length) {
            $("<span/>").addClass("visuallyhidden")
                        .html(this.options.closeHint)
                        .appendTo(this.$element);
        }

        // Bind events
        this.$element.on(eclick, $.proxy(this.click, this));
    };

    Dismiss.prototype.close = function () {

        var dismissEvent = $.Event(edismiss),
            $target = this.$target,
            self = this,
            complete = function () {
                self.dismissing = false;
                $target.removeClass("fade-out").attr({ "aria-hidden": true, "hidden": true, "tabindex": -1 });
                self.$element.trigger($.Event(edismissed));
            };

        this.$element.trigger(dismissEvent);

        if (this.dismissing || dismissEvent.isDefaultPrevented()) {
            return;
        }

        this.dismissing = true;

        $target.addClass("fade-in fade-out")
               .redraw()
               .removeClass("fade-in");

        // Do our callback
        this.$target.onTransitionEnd(complete);
    };

    Dismiss.prototype.click = function (event) {
        event.preventDefault();
        this.close();
    };

    // No conflict.
    var old = $.fn.dismiss;

    // Plug-in definition 
    $.fn.dismiss = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("dismiss");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("dismiss", (data = new Dismiss(this, options)));
            }

            // Close the element.
            if (options === "close") {
                data.close();
            }
        });
    };

    // Set the public constructor.
    $.fn.dismiss.Constructor = Dismiss;

    $.fn.dismiss.noConflict = function () {
        $.fn.dismiss = old;
        return this;
    };

    // Data API
    var init = function () {
        $("button[data-dismiss-target]").each(function () {
            var $this = $(this),
                loaded = $this.data("r.dismissLoaded");
            if (!loaded) {
                $this.data("r.dismissLoaded", true);
                $this.dismiss($.getDataOptions($this, "dismiss"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_DISMISS = true;

}(jQuery, window, ".r.dismiss", ".data-api"));