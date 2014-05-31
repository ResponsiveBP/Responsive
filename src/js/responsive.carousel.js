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
        emouseenter = "mouseenter" + ns,
        emouseleave = "mouseleave" + ns,
        eclick = "click" + ns,
        eready = "ready" + ns,
        eslide = "slide" + ns,
        eslid = "slid" + ns;

    // Private methods.
    var getActiveIndex = function () {

        var $activeItem = this.$element.find(".carousel-active");
        this.$items = $activeItem.parent().children("figure");

        return this.$items.index($activeItem);
    },

        manageLazyImages = function () {
            if (!this.data("lazyLoaded")) {

                this.find("img[data-src]").each(function () {
                    if (this.src.length === 0) {
                        this.src = this.getAttribute("data-src");
                    }
                });

                this.data("lazyLoaded", true);
            }
        },

        manageTouch = function () {

            this.$element.swipe({ namespace: "r.carousel", touchAction: "pan-y" })
                .on("swipemove.r.carousel", $.proxy(function (event) {

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
                        $nextItem = $activeItem[type]("figure");

                    if (this.$items.length === 1) {
                        return;
                    }

                    if (!$nextItem.length) {

                        if (!this.options.wrap) {
                            return;
                        }

                        $nextItem = this.$element.children("figure")[fallback]();
                    }

                    if ($nextItem.hasClass("carousel-active")) {
                        return;
                    }

                    if (this.options.lazyLoadImages && this.options.lazyOnDemand) {
                        // Load the next image.
                        manageLazyImages.call($nextItem);
                    }

                    // Get the distance swiped as a percentage.
                    var width = $activeItem.width(),
                        percent = parseFloat((event.delta.x / width) * 100),
                        diff = isNext ? 100 : -100;

                    // Shift the items but put a limit on sensitivity.
                    if (Math.abs(percent) < 100 && Math.abs(percent) > 5) {
                        this.$element.addClass("no-transition");
                        if (this.options.mode === "slide") {
                            $activeItem.css({ "transform": "translate(" + percent + "%, 0)" });
                            $nextItem.addClass("swipe").css({ "transform": "translate(" + (percent + diff) + "%, 0)" });
                        } else {
                            $activeItem.addClass("swipe").css({ "opacity": 1 - Math.abs((percent / 100)) });
                            $nextItem.addClass("swipe");
                        }
                    }

                }, this))
                .on("swipeend.r.carousel", $.proxy(function (event) {

                    if (this.sliding || !this.$element.hasClass("no-transition")) {
                        return;
                    }

                    var direction = event.direction,
                        method = "next";

                    if (direction === "right") {
                        method = "prev";
                    }

                    // Re-enable the transitions.
                    this.$element.removeClass("no-transition");

                    if (supportTransition) {

                        // Trim the animation duration based on the current position.
                        var activePosition = getActiveIndex.call(this),
                            $activeItem = $(this.$items[activePosition]);

                        if (!this.translationDuration) {
                            this.translationDuration = parseFloat($activeItem.css("transition-duration"));
                        }

                        // Get the distance and turn it into into a percentage
                        // to calculate the duration. Whichever is lowest is used.
                        var width = $activeItem.width(),
                            percentageTravelled = parseInt((Math.abs(event.delta.x) / width) * 100, 10),
                            swipeDuration = (((event.duration / 1000) * 100) / percentageTravelled),
                            newDuration = (((100 - percentageTravelled) / 100) * (Math.min(this.translationDuration, swipeDuration)));

                        // Set the new temporary duration.
                        this.$items.each(function () {
                            $(this).css({ "transition-duration": newDuration + "s" });
                        });
                    }

                    this.cycle();
                    this[method]();

                }, this));
        };

    // Carousel class definition
    var Carousel = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            interval: 5000,
            mode: "slide",
            pause: "hover",
            wrap: true,
            enabletouch: true,
            lazyLoadImages: true,
            lazyOnDemand: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.paused = null;
        this.interval = null;
        this.sliding = null;
        this.$items = null;
        this.$indicators = [];
        this.translationDuration = null;

        if (this.options.pause === "hover") {
            // Bind the mouse enter/leave events
            if (!$.support.touchEvents && $.support.pointerEvents) {
                this.$element.on(emouseenter, $.proxy(this.pause, this))
                    .on(emouseleave, $.proxy(this.cycle, this));
            }
        }

        // Add the css class to support fade.
        this.options.mode === "fade" && this.$element.addClass("carousel-fade");

        if (this.options.enabletouch) {
            manageTouch.call(this);
        }

        var self = this;
        if (this.options.lazyLoadImages && !this.options.lazyOnDemand) {
            $(w).on("load", function () {
                manageLazyImages.call(self.$element);
            });
        }

        // Find and bind indicators.
        $("[data-carousel-slide-to]").each(function () {
            var $this = $(this),
                $target = $($this.attr("data-carousel-target") || $this.attr("href"));

            if ($target[0] === element) {
                var $parent = $this.parents("ol:first");
                if ($.inArray($parent[0], self.$indicators) === -1) {
                    self.$indicators.push($parent[0]);
                }
            }
        });
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
        if (this.$element.find(".next, .prev").length && $.support.transition) {
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

        var $activeItem = this.$element.children("figure.carousel-active"),
            $nextItem = next || $activeItem[type]("figure"),
            isCycling = this.interval,
            isNext = type === "next",
            direction = isNext ? "left" : "right",
            fallback = isNext ? "first" : "last",
            self = this,
            slideEvent,
            slidEvent;

        if (isCycling) {
            // Pause if cycling.
            this.pause();
        }

        // Work out which item to slide to.
        if (!$nextItem.length) {

            if (!this.options.wrap) {
                return false;
            }

            $nextItem = this.$element.children("figure")[fallback]();
        }

        if ($nextItem.hasClass("carousel-active")) {
            return false;
        }

        // Trigger the slide event with positional data.
        slideEvent = $.Event(eslide, { relatedTarget: $nextItem[0], direction: direction });
        this.$element.trigger(slideEvent);

        if (this.sliding || slideEvent.isDefaultPrevented()) {
            return false;
        }

        if (this.options.lazyLoadImages && this.options.lazyOnDemand) {
            // Load the next image.
            manageLazyImages.call($nextItem);
        }

        // Good to go? Then let's slide.
        this.sliding = true;

        if (isCycling) {
            this.pause();
        }

        // Highlight the correct indicator.
        if (this.$indicators.length) {
            $.each(this.$indicators, function () {
                var $this = $(this);
                $this.find(".active").removeClass("active");
                self.$element.one(eslid, function () {
                    var $nextIndicator = $($this.children()[getActiveIndex.call(self)]);
                    if ($nextIndicator) {
                        $nextIndicator.addClass("active");
                    }
                });
            });
        }

        var complete = function () {

            if (self.$items) {
                // Clear the transition properties if set.
                self.$items.each(function () {
                    $(this).css({ "transition": "", "opacity": "" });
                });
            }

            $activeItem.removeClass(["carousel-active", direction].join(" "));
            $nextItem.removeClass([type, direction].join(" ")).addClass("carousel-active");

            self.sliding = false;
            slidEvent = $.Event(eslid, { relatedTarget: $nextItem[0], direction: direction });
            self.$element.trigger(slidEvent);
        };

        // Force reflow.
        $nextItem.addClass(type).redraw();

        // Do the slide.
        $activeItem.addClass(direction);
        $nextItem.addClass(direction);

        // Clear the added css.
        if (this.$items) {
            this.$items.each(function () {
                $(this).removeClass("swipe").css({ "transform": "", "opacity": "" });
            });
        }

        $activeItem.onTransitionEnd(complete);

        // Restart the cycle.
        if (isCycling) {

            this.cycle();
        }

        return this;
    };

    // Plug-in definition 
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
    var old = $.fn.carousel;
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