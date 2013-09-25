/*
 * Responsive Carousel
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns) {

    "use strict";

    // Prevents ajax requests from reloading everything and
    // rebinding events.
    if (w.RESPONSIVE_CAROUSEL) {
        return;
    }

    // General variables.
    var supportTransition = $.support.transition,
        eclick = "click" + ns,
        eload = "load" + ns,
        efocus = "focus" + ns,
        eblur = "blur" + ns,
        eslide = "slide" + ns,
        eslid = "slid" + ns,

    // The Carousel object that contains our methods.
        Carousel = function (element, options) {

            this.$element = $(element);
            this.options = $.extend({}, $.fn.carousel.defaults, options);
            this.paused = null;
            this.interval = null;
            this.sliding = null;

            // Bind the trigger click event.
            this.$element.on(eclick, "[data-carousel-slide]", function (event) {

                event.preventDefault();

                var $this = $(this),
                    opts = $this.data("carouselSlide"),
                    $target = $(event.delegateTarget),
                    $trigger = $this.parent("li");

                if (opts) {

                    // Flag that the carousel slider has been triggered.
                    $target.find("[data-carousel-slide]").parent("li").not($trigger).removeClass("on");

                    $trigger.addClass("on");

                    // Run the carousel method.
                    $target.carousel(opts);
                }

            });

            if (this.options.pause === "hover") {
                // Bind the mouse enter/leave events
                this.$element.on("mouseenter", $.proxy(this.pause, this))
                             .on("mouseleave", $.proxy(this.cycle, this));
            }

            if (this.options.slide && this.$element.is(":visible")) {

                // Handle a slide instruction.
                this.slide(this.options.slide);
            }

        };

    Carousel.prototype = {
        constructor: Carousel,
        cycle: function (event) {

            if (!event) {
                // Flag false when there's no event.
                this.paused = false;
            }

            if (this.options.interval && !this.paused) {

                // Cycle to the next item on the set interval
                (this.interval = w.setInterval($.proxy(this.next, this), this.options.interval));
            }

            // Return the carousel for chaining.
            return this;
        },
        goTo: function (position) {

            var $activeItem = this.$element.find(".carousel-active"),
                $children = $activeItem.parent().children(),
                activePosition = $children.index($activeItem),
                self = this;

            // Since the index is zero based we need to subtract one.
            position -= 1;

            if (position > ($children.length) || position < 0) {

                return false;
            }

            if (this.sliding) {

                // Fire the slid event.
                return this.$element.one(eslid, function () {
                    // Reset the position.
                    self.goTo(position + 1);

                });
            }

            if (activePosition === position) {
                return this.pause().cycle();
            }

            return this.slide(position > activePosition ? "next" : "prev", $($children[position]));

        },
        pause: function (event) {

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
            w.clearInterval(this.interval);
            this.interval = null;

            return this;

        },
        next: function () {

            if (this.sliding) {
                return false;
            }

            return this.slide("next");
        },
        prev: function () {

            if (this.sliding) {
                return false;
            }

            return this.slide("prev");
        },
        slide: function (type, next) {

            var $activeItem = this.$element.find(".carousel-active"),
                $nextItem = next || $activeItem[type](),
                isCycling = this.interval,
                isNext = type === "next",
                direction = isNext ? "left" : "right",
                fallback = isNext ? "first" : "last",
                self = this,
                slideEvent = $.Event(eslide),
                slidEvent = $.Event(eslid),
                slideMode = this.options.mode === "slide",
                fadeMode = this.options.mode === "fade",
                index,
                $thumbnails;

            // Mark as sliding.
            this.sliding = true;

            if (isCycling) {
                // Pause if cycling.
                this.pause();
            }

            // Work out which item to slide to.
            $nextItem = $nextItem.length ? $nextItem : this.$element.find(".carousel-item")[fallback]();

            if ($nextItem.hasClass("carousel-active")) {
                return false;
            }

            if (supportTransition && (slideMode || fadeMode)) {

                // Trigger the slide event.
                this.$element.trigger(slideEvent);

                if (slideEvent.isDefaultPrevented()) {
                    return false;
                }

                // Good to go? Then let's slide.
                $nextItem.addClass(type)[0].offsetWidth; // Force reflow.

                // Do the slide.
                $activeItem.addClass(direction);
                $nextItem.addClass(direction);

                // Tag the thumbnails.
                index = $nextItem.index();
                $thumbnails = this.$element.find("[data-carousel-slide]").parent("li").removeClass("on");
                $thumbnails.eq(index).addClass("on");

                // Callback.
                this.$element.one(supportTransition.end, function () {

                    $nextItem.removeClass([type, direction].join(" ")).addClass("carousel-active");
                    $activeItem.removeClass(["carousel-active", direction].join(" "));

                    self.sliding = false;
                    self.$element.trigger(slidEvent);

                });
            } else {

                // Trigger the slide event.
                this.$element.trigger(slideEvent);

                if (slideEvent.isDefaultPrevented()) {
                    return false;
                }

                $activeItem.removeClass("carousel-active");
                $nextItem.addClass("carousel-active");

                // Tag the thumbnails.
                index = $nextItem.index();
                $thumbnails = this.$element.find("[data-carousel-slide]").parent("li").removeClass("on");
                $thumbnails.eq(index).addClass("on");

                self.sliding = false;
                self.$element.trigger(slidEvent);
            }

            // Restart the cycle.
            if (isCycling) {

                this.cycle();
            }

            return this;
        }
    };

    /* Plugin definition */
    $.fn.carousel = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("carousel"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("carousel", (data = new Carousel(this, opts)));
            }

            if (typeof options === "number") {
                // Cycle to the given number.
                data.goTo(options);

            } else if (typeof options === "string" || (options = opts.slide)) {

                data[options]();

            } else if (data.options.interval) {
                data.cycle();
            }

        });

    };

    // Define the defaults.
    $.fn.carousel.defaults = {
        interval: 5e3,
        mode: "slide",
        pause: "hover"
    };

    // Set the public constructor.
    $.fn.carousel.Constructor = Carousel;

    $(w).on(eload, function () {

        $(".carousel").each(function () {

            var $this = $(this),
                data = $this.data("carouselOptions"),
                options = data || $.buildDataOptions($this, {}, "carousel");

            $this.carousel(options);

        });

    }).on(efocus + " " + eblur, function (event) {
        // Restart the carousel when Firefox fails to.

        var $this = $(this),
             prevType = $this.data("prevType"),
             action;

        //  Reduce double fire issues
        if (prevType !== event.type) {
            switch (event.type) {
                case "blur":
                    action = "pause";
                    break;
                case "focus":
                    action = "cycle";
                    break;
            }
        }

        $this.data("prevType", event.type);

        if (action === "pause" || action === "cycle") {
            $(".carousel").each(function () {

                var $self = $(this),
                    carousel = $self.data("carousel");

                if (carousel && carousel[action]) {
                    // It has data so perform the given action.
                    carousel[action]();
                }

            });
        }
    });

    w.RESPONSIVE_CAROUSEL = true;

}(jQuery, window, ".carousel.r"));