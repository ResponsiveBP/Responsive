/*
 * Responsive AutoSize
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_AUTOSIZE) {
        return;
    }

    // General variables and methods.
    var einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eresize = ["resize" + ns, "orientationchange" + ns].join(" "),
        einput = "input",
        ekeyup = "keyup",
        esize = "size" + ns,
        esized = "sized" + ns;

    (function (oldVal) {
        /// <summary>Override the core val method in the jQuery object to fire an input event on autosize plugins whenever it is called.</summary>
        /// <param name="old" type="Function">
        ///      The jQuery function being overridden.
        /// </param>
        /// <returns type="jQuery">The jQuery object for chaining.</returns>

        $.fn.val = function () {
            // Execute the original val() method using the augmented arguments collection.
            var result = oldVal.apply(this, arguments);

            if (this.data("r.autosize") && arguments.length) {
                this.trigger($.Event(einput));
            }

            return result;
        };
    })($.fn.val);

    // AutoSize class definition
    var AutoSize = function (element, options) {

        this.$element = $(element);
        this.element = element,
        this.options = $.extend({}, this.defaults, options);
        this.sizing = null;
        this.difference = 0;
        this.height = this.$element.height();

        // Initial setup.
        this.init();

        // Bind events. Keyup is required for IE9.
        this.$element.on([einput, ekeyup].join(" "), $.debounce($.proxy(this.size, this), 100));
        $(w).on(eresize, $.debounce($.proxy(this.size, this), 100));
    };

    AutoSize.prototype.init = function () {
        var height = this.$element.outerHeight();
        this.difference = parseFloat(this.$element.css("paddingBottom")) +
                          parseFloat(this.$element.css("paddingTop"));

        // Firefox: scrollHeight isn't full height on border-box
        if (this.element.scrollHeight + this.difference <= height) {
            this.difference = 0;
        }

        // Only set the height if textarea has value.
        if (this.element.value.replace(/\s/g, "").length > 0) {
            this.$element.height(this.element.scrollHeight);
        }
    };

    AutoSize.prototype.size = function () {

        var self = this,
            $element = this.$element,
            element = this.element,
            sizeEvent = $.Event(esize);

        if (this.sizing) {
            return;
        }

        // Check and get the height
        $element.height("auto");
        var scrollHeight = element.scrollHeight - this.difference,
            different = this.height !== scrollHeight;

        $element.height(this.height);

        // Trigger events if need be.
        if (different) {
            $element.trigger(sizeEvent);
        }

        if (this.sizing || sizeEvent.isDefaultPrevented()) {
            return;
        }

        this.sizing = true;

        $element.height(scrollHeight);

        if (different) {
            // Do our callback
            $element.onTransitionEnd(function() {
                self.sizing = false;
                self.height = scrollHeight;
                $element.trigger($.Event(esized));
            });
            return;
        }

        this.sizing = false;
    };

    // No conflict.
    var old = $.fn.autoSize;

    // Plug-in definition 
    $.fn.autoSize = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.autosize"),
                opts = typeof options === "object" ? $.extend({}, options) : null;

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

    $.fn.autoSize.noConflict = function () {
        $.fn.autoSize = old;
        return this;
    };

    // Data API
    var init = function () {
        $("textarea[data-autosize]").each(function () {
            var $this = $(this),
                loaded = $this.data("r.autosizeLoaded");
            if (!loaded) {
                $this.data("r.autosizeLoaded", true);
                $this.addClass("autosize").autoSize($.getDataOptions($this, "autosize"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_AUTOSIZE = true;

}(jQuery, window, ".r.autosize", ".data-api"));