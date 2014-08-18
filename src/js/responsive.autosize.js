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
    var eready = "ready" + ns,
        echanged = ["domchanged" + ns, "shown.r.modal"].join(" "),
        eresize = "resize orientationchange",
        ekeyup = "keyup",
        epaste = "paste",
        ecut = "cut",
        esize = "size" + ns,
        esized = "sized" + ns;

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
        this.clone();

        // Bind events
        this.$element.on([ekeyup, epaste, ecut].join(" "), $.proxy(this.change, this));
        var onResize = $.debounce($.proxy(this.size, this), 50);
        $(w).off(eresize).on(eresize, onResize);
    };

    AutoSize.prototype.clone = function () {

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

    AutoSize.prototype.size = function () {

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

    AutoSize.prototype.change = function (event) {

        var self = this,
            delay = 0;

        if (event.type === "paste" || event.type === "cut") {
            delay = 5;
        }

        w.setTimeout(function () {

            // Run the size method.
            self.size();

        }, delay);
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

            if (options === "size") {
                data.size();
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

    // Data API
    var init = function () {
        $("textarea[data-autosize]").each(function () {

            var $this = $(this).addClass("autosize"),
                data = $this.data("r.autosizeOptions"),
                options = data || $.buildDataOptions($this, {}, "autosize", "r");

            $this.autoSize(options);
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([eready, echanged].join(" "), function (event) {
        event.type === "ready" ? init() : debouncedInit();
    });

    w.RESPONSIVE_AUTOSIZE = true;

}(jQuery, window, ".r.autosize"));