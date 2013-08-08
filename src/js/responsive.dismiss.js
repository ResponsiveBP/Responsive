/*
 * Responsive Dismiss 
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($) {

    "use strict";

    var Dismiss = function (element, target) {

        this.$element = $(element);
        this.$target = this.$element.parents(target);

    };

    Dismiss.prototype = {
        constructor: Dismiss,
        close: function () {

            var supportTransition = $.support.transition,
                closeEvent = $.Event("close.dismiss.responsive"),
                closedEvent = $.Event("closed.dismiss.responsive"),
                $target = this.$target,
                self = this,
                complete = function () {

                    self.transitioning = false;
                    $target.addClass("hidden").trigger(closedEvent);

                };

            if (this.transitioning || closeEvent.isDefaultPrevented()) {
                return;
            }

            this.transitioning = true;

            $target.addClass("fade-in fade-out");

            $target[0].offsetWidth; // reflow

            $target.removeClass("fade-in");

            // Do our callback
            supportTransition ? this.$target.one(supportTransition.end, complete)
                              : complete();

        }
    };

    /* Plug-in definition */
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

    // Dismiss data api initialisation.
    $(function () {
        $(document.body).on("click.dismiss.responsive", ":attrStart(data-dismiss)", function (event) {

            event.preventDefault();

            var $this = $(this),
                data = $this.data("dismissOptions"),
                options = data || $.buildDataOptions($this, {}, "dismiss"),
                target = options.target || (options.target = $this.attr("href"));

            // Run the dismiss method.
            if (target) {
                $(this).dismiss(options.target);
            }

        });
    });

}(jQuery));