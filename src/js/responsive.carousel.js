/*
 * Responsive Carousel
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_CAROUSEL) {
        return;
    }

    // General variables.
    var supportTransition = $.support.transition,
        vendorPrefixes = $.support.getVendorPrefix,
        emouseenter = "mouseenter" + ns,
        emouseleave = "mouseleave" + ns,
        eclick = "click" + ns,
        eready = "ready" + ns,
        eslide = "slide" + ns,
        eslid = "slid" + ns;

    // Private methods.
    var getActiveIndex = function () {

        var $activeItem = this.$element.find(".carousel-active");
        this.$items = $activeItem.parent().children();

        return this.$items.index($activeItem);
    },

    manageTouch = function () {

        this.$element.swipe({ namespace: "r.carousel", timeLimit: 0 })
            .on("swipemove.r.carousel", $.proxy(function (event) {

                if (this.options.mode !== "slide") {
                    return;
                }

                if (this.sliding) {
                    return;
                }

                this.pause();

                // Left is next.
                var isNext = event.delta.x < 0,
                    type = isNext ? "next" : "prev",
                    fallback = isNext ? "first" : "last",
                    activePosition = getActiveIndex.call(this),
                    $activeItem = $(this.$items[activePosition]),
                    $nextItem = $activeItem[type]();

                if (!$nextItem.length) {

                    if (!this.options.wrap) {
                        return;
                    }

                    $nextItem = this.$element.find(".carousel-item:not(.carousel-active)")[fallback]();
                }

                // Get the distance swiped as a percentage.
                var width = parseFloat($activeItem.width()),
                    percent = parseInt((event.delta.x / width) * 100, 10),
                    diff = isNext ? 100 : -100;

                // Shift the items but put a limit on sensitivity.
                if (percent > -100 && percent < 100 && (percent < -10 || percent > 10)) {
                    $activeItem.addClass("no-transition").css({ "transform": "translateX(" + percent + "%)" });
                    $nextItem.addClass("no-transition swipe").css({ "transform": "translateX(" + (percent + diff) + "%)" });
                }
            }, this))
            .on("swipeend.r.carousel", $.proxy(function (event) {

                if (this.sliding) {
                    return;
                }

                var direction = event.direction,
                    method = null;

                if (direction === "left") {
                    method = "next";
                } else if (direction === "right") {
                    method = "prev";
                }

                // Re-enable the transitions.
                this.$items.each(function () {
                    $(this).removeClass("no-transition");
                });

                if (supportTransition) {

                    // Trim the animation duration based on the current position.
                    var activePosition = getActiveIndex.call(this),
                        $activeItem = $(this.$items[activePosition]),
                        prop = vendorPrefixes.css + "transition-duration",
                        duration = $activeItem.css(prop),
                        // Get the transform matrix and pull the right value.
                        // index of 4 for translateX.
                        matrix = $activeItem.css(vendorPrefixes.css + "transform"),
                        translateX = (matrix.match(/-?[0-9\.]+/g))[4],

                    // Now turn that into a percentage.
                       width = parseFloat($activeItem.width()),
                       percent = parseInt((Math.abs(translateX) / width) * 100, 10),
                       newDuration = ((100 - percent) / 100) * parseFloat(duration);

                    // Set the new temporary duration.
                    this.$items.each(function () {
                        $(this).css(prop, newDuration + "s");
                    });
                }

                this.cycle();
                this[method]();

            }, this));
    };

    // AutoSize class definition
    var Carousel = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            interval: 5000,
            mode: "slide",
            pause: "hover",
            wrap: true,
            enabletouch: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.paused = null;
        this.interval = null;
        this.sliding = null;
        this.$items = null;

        if (this.options.pause === "hover") {
            // Bind the mouse enter/leave events
            this.$element.on(emouseenter, $.proxy(this.pause, this))
                         .on(emouseleave, $.proxy(this.cycle, this));
        }

        if (this.options.enabletouch && this.options.mode === "slide") {
            manageTouch.call(this);
        }
    };

    Carousel.prototype.cycle = function (event) {

        if (!event) {
            // Flag false when there's no event.
            this.paused = false;
        }

        if (this.interval) {
            w.clearInterval(this.interval);
        }

        if (this.options.interval && !this.paused) {

            // Cycle to the next item on the set interval
            this.interval = w.setInterval($.proxy(this.next, this), this.options.interval);
        }

        // Return the carousel for chaining.
        return this;
    };

    Carousel.prototype.to = function (position) {

        var activePosition = getActiveIndex.call(this),
            self = this;

        if (position > (this.$items.length - 1) || position < 0) {

            return false;
        }

        if (this.sliding) {

            // Fire the slid event.
            return this.$element.one(eslid, function () {
                // Reset the position.
                self.to(position);

            });
        }

        if (activePosition === position) {
            return this.pause().cycle();
        }

        return this.slide(position > activePosition ? "next" : "prev", $(this.$items[position]));

    };

    Carousel.prototype.pause = function (event) {

        if (!event) {
            // Mark as paused
            this.paused = true;
        }

        // Ensure that transition end is triggered.
        if (this.$element.find(".next, .prev").length && $.support.transition.end) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }

        // Clear the interval and return the carousel for chaining.
        this.interval = w.clearInterval(this.interval);

        return this;
    };

    Carousel.prototype.next = function () {

        if (this.sliding) {
            return false;
        }

        return this.slide("next");
    };

    Carousel.prototype.prev = function () {

        if (this.sliding) {
            return false;
        }

        return this.slide("prev");
    };

    Carousel.prototype.slide = function (type, next) {

        var $activeItem = this.$element.find(".carousel-active"),
            $nextItem = next || $activeItem[type](),
            isCycling = this.interval,
            isNext = type === "next",
            direction = isNext ? "left" : "right",
            fallback = isNext ? "first" : "last",
            self = this,
            slidEvent = $.Event(eslid),
            slideMode = this.options.mode === "slide",
            fadeMode = this.options.mode === "fade";

        if (isCycling) {
            // Pause if cycling.
            this.pause();
        }

        // Work out which item to slide to.
        if (!$nextItem.length) {

            if (!this.options.wrap) {
                return false;
            }

            $nextItem = this.$element.find(".carousel-item")[fallback]();
        }

        if ($nextItem.hasClass("carousel-active")) {
            return false;
        }

        if (this.interval) {
            this.pause();
        }

        // Trigger the slide event with positional data.
        var slideEvent = $.Event(eslide, { relatedTarget: $nextItem[0], direction: direction });
        this.$element.trigger(slideEvent);

        if (this.sliding || slideEvent.isDefaultPrevented()) {
            return false;
        }

        // Good to go? Then let's slide.
        this.sliding = true;

        // Highlight the correct indicator.
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");

            this.$element.one(eslid, function () {
                var $nextIndicator = $(self.$indicators.children()[getActiveIndex.call(self)]);
                if ($nextIndicator) {
                    $nextIndicator.addClass("active");
                }
            });
        }

        var complete = function () {

            if (slideMode && self.$items) {
                // Clear the transition properties if set.
                self.$items.each(function () {
                    $(this).css({ "transition": "" });
                });
            }

            $activeItem.removeClass(["carousel-active", direction].join(" "));
            $nextItem.removeClass([type, direction].join(" ")).addClass("carousel-active");

            self.sliding = false;
            self.$element.trigger(slidEvent);
        };

        // Force reflow.
        $nextItem.addClass(type).redraw();

        // Do the slide.
        $activeItem.addClass(direction);
        $nextItem.addClass(direction);

        if (slideMode && this.$items) {
            // Clear the added css.
            this.$items.each(function () {
                $(this).removeClass("swipe").css({ "transform": "" });
            });
        }

        supportTransition && (slideMode || fadeMode) ? $activeItem.one(supportTransition.end, complete) : complete();

        // Restart the cycle.
        if (isCycling) {

            this.cycle();
        }

        return this;
    };

    // Plug-in definition 
    var old = $.fn.carousel;

    $.fn.carousel = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("r.carousel"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.carousel", (data = new Carousel(this, opts)));
            }

            if (typeof options === "number") {
                // Cycle to the given number.
                data.to(options);

            } else if (typeof options === "string" || (options = opts.slide)) {

                data[options]();

            } else if (data.options.interval) {
                data.cycle();
            }
        });
    };

    // Set the public constructor.
    $.fn.carousel.Constructor = Carousel;

    // No conflict.
    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old;
        return this;
    };

    // Data API
    $(document).on(eclick, ":attrStart(data-carousel-slide)", function (event) {

        event.preventDefault();

        var $this = $(this),
            data = $this.data("r.carouselOptions"),
            options = data || $.buildDataOptions($this, {}, "carousel", "r"),
            $target = $(options.target || (options.target = $this.attr("href"))),
            slideIndex = options.slideTo,
            carousel = $target.data("r.carousel");

        if (carousel) {
            typeof slideIndex === "number" ? carousel.to(slideIndex) : carousel[options.slide]();
        }
    }).on(eready, function () {

        $(".carousel").each(function () {

            var $this = $(this),
                data = $this.data("r.carouselOptions"),
                options = data || $.buildDataOptions($this, {}, "carousel", "r");

            $this.carousel(options);
        });
    });

    w.RESPONSIVE_CAROUSEL = true;

}(jQuery, window, ".r.carousel"));