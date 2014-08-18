/*
 * Responsive Conditional
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_CONDITIONAL) {
        return;
    }

    // General variables and methods.
    var eready = "ready" + ns,
        echanged = ["domchanged" + ns, "shown.r.modal"].join(" "),
        eresize = ["resize", "orientationchange"].join(".conditional "),
        eloaded = "loaded" + ns,
        eerror = "error" + ns;

    // AutoSize class definition
    var Conditional = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            xs: null,
            s: null,
            m: null,
            l: null,
            fallback: null,
            errorHint: "<p>An error has occured.</p>"
        };
        this.options = $.extend({}, this.defaults, options);
        this.currentGrid = null;
        this.sizing = null;

        // Bind events.
        var onResize = $.debounce($.proxy(this.resize, this), 50);
        $(w).off(eresize).on(eresize, onResize);

        // First Run
        this.resize();
    };

    Conditional.prototype.resize = function () {

        var grid = $.support.currentGrid().grid;

        if (this.currentGrid !== grid) {
            this.currentGrid = grid;

            var self = this,
                target = this.options[grid] || this.options.fallback;

            if (target) {
                this.$element.empty().load(target, null, function (responseText, textStatus) {
                    if (textStatus === "error") {
                        self.$element.trigger($.Event(eerror, { relatedTarget: self.$element[0], loadTarget: target, grid: grid }));
                        self.$element.html(self.options.errorHint);
                        return;
                    }

                    self.$element.trigger($.Event(eloaded, { relatedTarget: self.$element[0], loadTarget: target, grid: grid }));
                });
            }
        }
    };

    // Plug-in definition 
    $.fn.conditional = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.conditional"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.conditional", (data = new Conditional(this, opts)));
            }

            if (options === "resize") {
                data.resize();
            }
        });
    };

    // Set the public constructor.
    $.fn.conditional.Constructor = Conditional;

    // No conflict.
    var old = $.fn.conditional;
    $.fn.conditional.noConflict = function () {
        $.fn.conditional = old;
        return this;
    };

    // Data API
    var init = function () {
        $(":attrStart(data-conditional)").each(function () {

            var $this = $(this).addClass("conditional"),
                data = $this.data("r.conditionalOptions"),
                options = data || $.buildDataOptions($this, {}, "conditional", "r");

            $this.conditional(options);
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([eready, echanged].join(" "), function (event) {
        event.type === "ready" ? init() : debouncedInit();
    });

    w.RESPONSIVE_CONDITIONAL = true;

}(jQuery, window, ".r.conditional"));