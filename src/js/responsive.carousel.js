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
        supportTouch = $.support.touch,
        emouseenter = "mouseenter" + ns,
        emouseleave = "mouseleave" + ns,
        etouchstart = "touchstart" + ns,
        etouchmove = "touchmove" + ns,
        etouchend = "touchend" + ns,
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

            var move = function (event) {

                var original = event.originalEvent;

                // Ensure swiping with one touch and not pinching.
                if (original.touches.length > 1 || original.scale && original.scale !== 1) {
                    return;
                }

                var touches = original.touches[0];

                // Measure change in x and y.
                this.touchDelta = {
                    x: touches.pageX - this.touchStart.x,
                    y: touches.pageY - this.touchStart.y
                };

            }, end = function () {

                // Measure duration
                var duration = +new Date - this.touchStart.time;

                // Determine if slide attempt triggers next/previous slide.
                // If slide duration is less than 1000ms
                // and if slide amt is greater than 20px
                // or if slide amt is greater than half the width
                var isValidSlide = Number(duration) < 1000 && Math.abs(this.touchDelta.x) > 20 || Math.abs(this.touchDelta) > this.$element[0].clientWidth / 2;

                if (isValidSlide) {

                    // Set the direction.
                    var direction = this.touchDelta.x < 0 ? "next" : "prev";

                    // Disable the touch events till next time.
                    this.$element.off(etouchmove).off(etouchend);

                    this[direction]();
                }
            };

            this.$element.on(etouchstart, $.proxy(function (event) {

                var original = event.originalEvent,
                    touches = original.touches[0];

                // Measure start values.
                this.touchStart = {
                    // Get initial touch coordinates.
                    x: touches.pageX,
                    y: touches.pageY,

                    // Store time to determine touch duration.
                    time: +new Date
                };

                // Reset delta and end measurements.
                this.touchDelta = {};

                // Attach touchmove and touchend listeners.
                this.$element.on(etouchmove, $.proxy(move, this))
                             .on(etouchend, $.proxy(end, this));

            }, this));
        };

    // AutoSize class definition
    var Carousel = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            interval: 5000,
            mode: "slide",
            pause: "hover",
            wrap: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.paused = null;
        this.interval = null;
        this.sliding = null;
        this.$items = null;
        this.touchDelta = {};
        this.touchStart = {};

        if (this.options.pause === "hover") {
            // Bind the mouse enter/leave events
            this.$element.on(emouseenter, $.proxy(this.pause, this))
                         .on(emouseleave, $.proxy(this.cycle, this));
        }

        if (supportTouch) {
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