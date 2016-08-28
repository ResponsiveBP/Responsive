/*
 * Responsive Conditional
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_CONDITIONAL) {
        return;
    }

    // General variables and methods.
    var einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eresize = ["resize" + ns, "orientationchange" + ns].join(" "),
        eload = "load" + ns,
        eloaded = "loaded" + ns,
        eerror = "error" + ns;

    // AutoSize class definition
    var Conditional = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            xxs: null,
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
        this.loading = null;

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

                var loadEvent = $.Event(eload);

                this.$element.trigger(loadEvent);

                if (this.loading || loadEvent.isDefaultPrevented()) {
                    return;
                }

                this.loading = true;

                // First check the cache.
                if (this.cache[this.currentGrid]) {
                    this.$element.empty().html(this.cache[this.currentGrid]);
                    this.loading = false;
                    this.$element.trigger($.Event(eloaded, { relatedTarget: self.$element[0], loadTarget: target, grid: this.currentGrid }));

                } else {
                    this.$element.empty().load(target, null, function (responseText, textStatus) {

                        // Handle errors.
                        if (textStatus === "error") {
                            self.$element.trigger($.Event(eerror, { relatedTarget: self.$element[0], loadTarget: target, grid: self.currentGrid }));
                            self.$element.html(self.options.errorHint);
                            self.loading = false;
                            return;
                        }

                        var selector, off = target.indexOf(" ");
                        if (off >= 0) {
                            selector = $.trim(target.slice(off));
                        }

                        // Cache the result so no further requests are made. This uses the internal `parseHTML`
                        // method so be aware that could one day change.
                        self.cache[grid] = selector ? $("<div>").append($.parseHTML(responseText)).find(selector).wrap("<div>").parent().html()
                                                    : responseText;
                        self.loading = false;
                        self.$element.trigger($.Event(eloaded, { relatedTarget: self.$element[0], loadTarget: target, grid: self.currentGrid }));
                    });
                }
            }
        }
    };

    // No conflict.
    var old = $.fn.conditional;

    // Plug-in definition 
    $.fn.conditional = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.conditional"),
                opts = typeof options === "object" ? $.extend({}, options) : null;

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

    $.fn.conditional.noConflict = function () {
        $.fn.conditional = old;
        return this;
    };

    // Data API
    var init = function () {
        $(":attrStart(data-conditional)").each(function () {
            var $this = $(this),
                loaded = $this.data("r.conditionalLoaded");
            if (!loaded) {
                $this.data("r.conditionalLoaded", true);
                $this.conditional($.getDataOptions($this, "conditional"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_CONDITIONAL = true;

}(jQuery, window, ".r.conditional", ".data-api"));