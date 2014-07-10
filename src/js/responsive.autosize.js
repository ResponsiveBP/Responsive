/*
 * Responsive AutoSize
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_AUTOSIZE) {
        return;
    }

    // General variables and methods.
    var resisizeTimer,
        eready = "ready" + ns,
        eresize = "resize orientationchange",
        ekeyup = "keyup",
        epaste = "paste",
        ecut = "cut",
        esize = "size" + ns,
        esized = "sized" + ns;

    // Private methods.
    var bindEvents = function () {

        // Not namespaced we want to keep the events when not using data-api.
        this.$element.on([ekeyup, epaste, ecut].join(" "), function (event) {

            var $this = $(this),
                delay = 0;

            if (event.type === "paste" || event.type === "cut") {
                delay = 5;
            }

            w.setTimeout(function () {

                // Run the size method.
                $this.autoSize("size");

            }, delay);
        });
    },
        createClone = function () {

            var self = this,
                attributes = this.options.removeAttributes,
                classes = this.options.removeClasses,
                $element = this.$element,
                clone = function () {

                    // Create a clone and offset it removing all specified attributes classes and data.
                    self.$clone = self.$element.clone()
                                      .attr({ "tabindex": -1, "rows": 2, "aria-hidden": true })
                                      .removeAttr("id name data-autosize " + attributes)
                                      .removeClass(classes)
                                      .removeClass(classes)
                                      .addClass("autosize-clone")
                                      .insertAfter($element);

                    // jQuery goes spare if you try to remove null data.
                    if (classes) {
                        self.$clone.removeData(classes);
                    }
                };

            $.when(clone()).then(this.size());
        };

    // AutoSize class definition
    var AutoSize = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            removeAttributes: null,
            removeClasses: null
        };
        this.options = $.extend({}, this.defaults, options);
        this.$clone = null;
        this.sizing = null;

        // Initial setup.
        bindEvents.call(this);
        createClone.call(this);
    };

    AutoSize.prototype.size = function () {

        console.log("sizing");

        var self = this,
            $element = this.$element,
            element = this.$element[0],
            $clone = this.$clone,
            clone = $clone[0],
            heightComparer = 0,
            startHeight,
            endHeight,
            sizeEvent = $.Event(esize),
            complete = function () {
                self.sizing = false;
                $element.trigger($.Event(esized));
            };

        // Set the width of the clone to match.
        $clone.width($element.width());

        // Copy the text across.
        $clone.val($element.val());

        // Set the height so animation will work.
        startHeight = $clone.height();
        $element.height(startHeight);

        console.log(startHeight);

        // Shrink
        while (clone.rows > 1 && clone.scrollHeight < clone.offsetHeight) {
            clone.rows -= 1;
        }

        // Grow
        while (clone.scrollHeight > clone.offsetHeight && heightComparer !== clone.offsetHeight) {
            heightComparer = element.offsetHeight;
            clone.rows += 1;
        }
        clone.rows += 1;

        endHeight = $clone.height();

        if (startHeight !== endHeight) {

            $element.trigger($.Event(esize));

            if (this.sizing || sizeEvent.isDefaultPrevented()) {
                return;
            }

            this.sizing = true;

            // Reset the height
            $element.height($clone.height());

            // Do our callback
            $element.onTransitionEnd(complete);
        }
    };

    // Plug-in definition 
    $.fn.autoSize = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.autosize"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.autosize", (data = new AutoSize(this, opts)));
            }

            // Run the appropriate function is a string is passed.
            if (typeof options === "string") {
                data[options]();
            }
        });
    };

    // Set the public constructor.
    $.fn.autoSize.Constructor = AutoSize;

    // No conflict.
    var old = $.fn.autoSize;
    $.fn.autoSize.noConflict = function () {
        $.fn.autoSize = old;
        return this;
    };

    $(w).on(eresize, function () {

        if (resisizeTimer) {
            w.clearTimeout(resisizeTimer);
        }

        var resize = function () {

            $("textarea.autosize").each(function () {

                var autosize = $(this).data("r.autosize");

                if (autosize) { autosize.size(); }
            });
        };

        resisizeTimer = w.setTimeout(resize, 5);
    });

    // Data API
    $(document).on(eready, function () {

        $("textarea[data-autosize]").each(function () {

            var $this = $(this).addClass("autosize"),
                data = $this.data("r.autosizeOptions"),
                options = data || $.buildDataOptions($this, {}, "autosize", "r");

            // Run the autosize method.
            $this.autoSize(options);
        });
    });

    w.RESPONSIVE_AUTOSIZE = true;

}(jQuery, window, ".r.autosize"));