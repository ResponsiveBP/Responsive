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
        this.cache = {};
        this.options = $.extend({}, this.defaults, options);
        this.currentGrid = null;
        this.currentTarget = null;
        this.sizing = null;

        // Bind events.
        $(w).on(eresize, $.debounce($.proxy(this.resize, this), 50));

        // First Run
        this.resize();
    };

    Conditional.prototype.resize = function () {

        var current = $.support.currentGrid(),
            grid = current.grid,
            range = current.range;

        // Check to see if we need to cache the current content.
        if (!this.options.fallback) {
            for (var level in range) {
                if (range.hasOwnProperty(level)) {
                    var name = range[level];
                    if (!this.options[name]) {
                        this.options[name] = "fallback";
                        this.cache[name] = this.$element.html();
                    }
                }
            }
        }

        if (this.currentGrid !== grid) {
            this.currentGrid = grid;

            var self = this,
                target = this.options[grid] || this.options.fallback;

            if (target && target !== this.currentTarget) {
                this.currentTarget = target;

                // First check the cache.
                if (this.cache[this.currentGrid]) {
                    this.$element.empty().html(this.cache[this.currentGrid]);
                    this.$element.trigger($.Event(eloaded, { relatedTarget: self.$element[0], loadTarget: target, grid: this.currentGrid }));

                } else {
                    this.$element.empty().load(target, null, function (responseText, textStatus) {

                        // Handle errors.
                        if (textStatus === "error") {
                            self.$element.trigger($.Event(eerror, { relatedTarget: self.$element[0], loadTarget: target, grid: self.currentGrid }));
                            self.$element.html(self.options.errorHint);
                            return;
                        }

                        var selector, off = target.indexOf(" ");
                        if (off >= 0) {
                            selector = $.trim(target.slice(off));
                        }

                        // Cache the result so no further requests are made. This uses the internal `parseHTML`
                        // method so be aware that could one day change.
                        self.cache[grid] = selector
                            ? jQuery("<div>").append($.parseHTML(responseText)).find(selector).wrap("<div>").parent().html()
                            : responseText;

                        self.$element.trigger($.Event(eloaded, { relatedTarget: self.$element[0], loadTarget: target, grid: self.currentGrid }));
                    });
                }
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
            var $this = $(this),
                options = $this.data("r.conditionalOptions");
            if (!options) {
                $this.conditional($.buildDataOptions($this, {}, "conditional", "r"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([eready, echanged].join(" "), function (event) {
        event.type === "ready" ? init() : debouncedInit();
    });

    w.RESPONSIVE_CONDITIONAL = true;

}(jQuery, window, ".r.conditional"));