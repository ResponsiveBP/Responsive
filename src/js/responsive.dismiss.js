/*
 * Responsive Dismiss 
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_DISMISS) {
        return;
    }

    // General variables and methods.
    var eclick = "click" + ns,
        edismiss = "dismiss" + ns,
        edismissed = "dismissed" + ns;

    var Dismiss = function (element, target) {

        this.$element = $(element);
        this.$target = this.$element.parents(target);
        this.dismissing = null;
    };

    // Dismiss class definition
    Dismiss.prototype.close = function () {

        var supportTransition = $.support.transition,
            dismissEvent = $.Event(edismiss),
            $target = this.$target,
            self = this,
            complete = function () {

                self.dismissing = false;
                $target.addClass("hidden").trigger($.Event(edismissed));
            };

        $target.trigger(dismissEvent);

        if (this.dismissing || dismissEvent.isDefaultPrevented()) {
            return;
        }

        this.dismissing = true;

        $target.addClass("fade-in fade-out")
               .redraw()
               .removeClass("fade-in");

        // Do our callback
        supportTransition ? this.$target.one(supportTransition.end, complete) : complete();
    };

    // Plug-in definition 
    var old = $.fn.dismiss;

    $.fn.dismiss = function (target) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("dismiss");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("dismiss", (data = new Dismiss(this, target + ":first")));
            }

            // Close the element.
            data.close();
        });
    };

    // Set the public constructor.
    $.fn.dismiss.Constructor = Dismiss;

    // No conflict.
    $.fn.dismiss.noConflict = function () {
        $.fn.dismiss = old;
        return this;
    };

    // Data API
    $("body").on(eclick, ":attrStart(data-dismiss)", function (event) {

        event.preventDefault();

        var $this = $(this),
            data = $this.data("r.dismissOptions"),
            options = data || $.buildDataOptions($this, {}, "dismiss", "r"),
            target = options.target || (options.target = $this.attr("href"));

        // Run the dismiss method.
        if (target) {
            $(this).dismiss(options.target);
        }
    });

    w.RESPONSIVE_DISMISS = true;

}(jQuery, window, ".r.dismiss"));