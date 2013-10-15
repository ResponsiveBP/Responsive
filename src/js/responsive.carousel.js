/*
 * Responsive Carousel
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w) {

    "use strict";

    // General variables.
    var supportTransition = $.support.transition,

    // The Carousel object that contains our methods.
        Carousel = function (element, options) {

            this.$element = $(element);
            this.options = $.extend({}, $.fn.carousel.defaults, options);
            this.paused = null;
            this.interval = null;
            this.sliding = null;

            // Bind the trigger click event.
            this.$element.on("click.carousel.responsive", "[data-carousel-slide]", function (event) {

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

            if (this.interval) {
                w.clearInterval(this.interval);
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
                return this.$element.one("slid.carousel.responsive", function () {
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
            this.interval = w.clearInterval(this.interval);

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
                slideEvent = $.Event("slide.carousel.responsive"),
                slidEvent = $.Event("slid.carousel.responsive"),
                slideMode = this.options.mode === "slide",
                fadeMode = this.options.mode === "fade",
                index,
                $thumbnails;

            if (isCycling) {
                // Pause if cycling.
                this.pause();
            }

            // Work out which item to slide to.
            $nextItem = $nextItem.length ? $nextItem : this.$element.find(".carousel-item")[fallback]();

            if ($nextItem.hasClass("carousel-active")) {
                return false;
            }

            if (this.interval) {
                this.pause();
            }

            // Trigger the slide event.
            this.$element.trigger(slideEvent);

            if (this.sliding || slideEvent.isDefaultPrevented()) {
                return false;
            }

            // Mark as sliding.
            this.sliding = true;

            var complete = function () {

                $nextItem.removeClass([type, direction].join(" ")).addClass("carousel-active");
                $activeItem.removeClass(["carousel-active", direction].join(" "));

                self.sliding = false;
                self.$element.trigger(slidEvent);
            };

            // Tag the thumbnails.
            index = $nextItem.index();
            $thumbnails = this.$element.find("[data-carousel-slide]").parent("li").removeClass("on");
            $thumbnails.eq(index).addClass("on");

            // Good to go? Then let's slide.
            $nextItem.addClass(type)[0].offsetWidth; // Force reflow.

            // Do the slide.
            $activeItem.addClass(direction);
            $nextItem.addClass(direction);

            supportTransition && (slideMode || fadeMode) ? $activeItem.one(supportTransition.end, complete) : complete();

            // Callback.
            this.$element.one(supportTransition.end, function () {

                $nextItem.removeClass([type, direction].join(" ")).addClass("carousel-active");
                $activeItem.removeClass(["carousel-active", direction].join(" "));

                self.sliding = false;
                self.$element.trigger(slidEvent);

            });


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

    $(w).on("load.carousel.responsive", function () {

        $(".carousel").each(function () {

            var $this = $(this),
                data = $this.data("carouselOptions"),
                options = data || $.buildDataOptions($this, {}, "carousel");

            $this.carousel(options);

        });

    });

}(jQuery, window));