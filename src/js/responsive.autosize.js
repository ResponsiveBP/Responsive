/*
 * Responsive AutoSize
 */

/*global jQuery*/
(function ($, w, ns) {

    "use strict";

    // Prevents ajax requests from reloading everything and
    // rebinding events.
    if (w.RESPONSIVE_AUTOSIZE) {
        return;
    }

    var resisizeTimer,
        eready = "ready" + ns,
        eresize = "resize" + ns,
        ekeyup = "keyup" + ns,
        epaste = "paste" + ns,
        ecut = "cut" + ns,
        esize = "size" + ns,
        esized = "sized" + ns,

    // The AutoSize object that contains our methods.
        AutoSize = function (element, options) {

            this.$element = $(element);
            this.$clone = null;
            this.options = null;

            // Initial setup.
            if ($.isPlainObject(options)) {

                this.options = $.extend({}, $.fn.autoSize.defaults, options);

                this.$element.on(ekeyup + " " + epaste + " " + ecut, function (event) {

                    var $this = $(this),
                        delay = 0;

                    if (event.type === "paste" || event.type === "cut") {
                        delay = 5;
                    }

                    w.setTimeout(function () {

                        // Run the autosize method.
                        $this.autoSize("size");

                    }, delay);
                });

                var self = this,
                    attributes = this.options.removeAttributes,
                    classes = this.options.removeClasses,
                    $element = this.$element,
                    createClone = function () {

                        // Create a clone and offset it removing all specified attributes classes and data.
                        self.$clone = self.$element.clone()
                                          .css({ "position": "absolute", "top": "-99999px", "left": "-99999px", "visibility": "hidden", "overflow": "hidden" })
                                          .attr({ "tabindex": -1, "rows": 2 })
                                          .removeAttr("id name data-autosize " + attributes)
                                          .removeClass(classes)
                                          .insertAfter($element);

                        // jQuery goes spare if you try to remove
                        // null data.
                        if (classes) {
                            self.$clone.removeData(classes);
                        }

                    };

                $.when(createClone()).then(this.size());
            }
        };

    AutoSize.prototype = {
        constructor: AutoSize,
        size: function () {

            var transition = $.support.transition,
                $element = this.$element,
                element = this.$element[0],
                $clone = this.$clone,
                clone = $clone[0],
                height = 0,
                sizeEvent = $.Event(esize),
                sizedEvent = $.Event(esized),
                complete = function () {
                    $element.trigger(sizedEvent);
                };

            $element.trigger(sizeEvent);

            // Set the width of the clone to match.
            $clone.width($element.width());

            // Copy the text across.
            $clone.val($element.val());

            // Set the height so animation will work.
            $element.height($clone.height());

            // Shrink
            while (clone.rows > 1 && clone.scrollHeight < clone.offsetHeight) {
                clone.rows -= 1;
            }

            // Grow
            while (clone.scrollHeight > clone.offsetHeight && height !== clone.offsetHeight) {
                height = element.offsetHeight;
                clone.rows += 1;
            }
            clone.rows += 1;

            // Reset the height
            $element.height($clone.height());

            // Do our callback
            if (transition) {

                $element.one(transition.end, complete);

            } else {

                complete();

            }
        }
    };

    /* Plugin definition */
    $.fn.autoSize = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("autosize"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("autosize", (data = new AutoSize(this, opts)));
            }

            // Run the appropriate function is a string is passed.
            if (typeof options === "string") {
                data[options]();
            }

        });
    };

    // Define the defaults. 
    $.fn.autoSize.defaults = {
        removeAttributes: null,
        removeClasses: null
    };

    // Set the public constructor.
    $.fn.autoSize.Constructor = AutoSize;

    // Autosize data API initialisation.
    $(document).on(eready, function () {

        $("textarea[data-autosize]").each(function () {

            var $this = $(this),
                data = $this.data("autosizeOptions"),
                options = data || $.buildDataOptions($this, {}, "autosize");

            // Run the autosize method.
            $this.autoSize(options);

        });
    });

    $(w).on(eresize, function () {

        if (resisizeTimer) {
            w.clearTimeout(resisizeTimer);
        }

        var resize = function () {

            $("textarea[data-autosize]").each(function () {

                var $this = $(this),
                    autosize = $this.data("autosize");

                if (autosize) {
                    autosize.size();
                }

            });

        };

        resisizeTimer = w.setTimeout(resize, 50);
    });

    w.RESPONSIVE_AUTOSIZE = true;

}(jQuery, window, ".autosize.r"));
