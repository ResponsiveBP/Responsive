/*
 * Responsive Carousel
 */

/*global jQuery*/
/*jshint expr:true*/
(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_CAROUSEL) {
        return;
    }

    // General variables.
    var supportTransition = $.support.transition,
        rtl = $.support.rtl,
        emouseenter = "mouseenter",
        emouseleave = "mouseleave",
        ekeydown = "keydown",
        eclick = "click",
        einit = "RBPinit" + ns + da,
        echanged = ["RBPchanged" + ns + da, "shown.r.modal" + da].join(" "),
        eslide = "slide" + ns,
        eslid = "slid" + ns;

    var keys = {
        SPACE: 32,
        ENTER: 13,
        LEFT: 37,
        RIGHT: 39
    };

    // Carousel class definition
    var Carousel = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            interval: 0, // Better for a11y
            mode: "slide",
            pause: "hover",
            wrap: true,
            keyboard: true,
            touch: true,
            lazyImages: true,
            lazyOnDemand: true,
            nextTrigger: null,
            nextHint: "Next (" + (rtl ? "Left" : "Right") + " Arrow)",
            previousTrigger: null,
            previousHint: "Previous (" + (rtl ? "Right" : "Left") + " Arrow)",
            indicators: null
        };
        this.options = $.extend({}, this.defaults, options);
        this.paused = null;
        this.interval = null;
        this.sliding = null;
        this.$items = null;
        this.keyboardTriggered = null;
        this.translationDuration = null;
        this.$nextTrigger = this.options.nextTrigger ? $(this.options.nextTrigger) : this.$element.children("button.forward");
        this.$previousTrigger = this.options.previousTrigger ? $(this.options.previousTrigger) : this.$element.children("button:not(.forward)");
        this.$indicators = this.options.indicators ? $(this.options.indicators) : this.$element.find("> ol > li");
        this.id = this.$element.attr("id") || "carousel-" + $.pseudoUnique();

        var self = this,
            activeIndex = this.activeindex();

        // Hide the previous button if no wrapping.
        if (!this.options.wrap) {
            if (activeIndex === 0) {
                this.$previousTrigger.attr({ "aria-hidden": true, "hidden": true });
            }
        }

        // Hide both if one item.
        if (this.$items.length === 1) {
            this.$previousTrigger.attr({ "aria-hidden": true, "hidden": true });
            this.$nextTrigger.attr({ "aria-hidden": true, "hidden": true });
        }

        // Add the css class to support fade.
        this.options.mode === "fade" && this.$element.addClass("carousel-fade");

        if (this.options.lazyImages && !this.options.lazyOnDemand) {
            $(w).on("load", $.proxy(this.lazyimages), this);
        }

        // Add a11y features.
        this.$element.attr({ "role": "listbox", "aria-live": "polite", "id": this.id });

        this.$element.children("figure").each(function (index) {
            var active = index === activeIndex;
            $(this).attr({
                "role": "option",
                "aria-selected": active,
                "tabindex": active ? 0 : -1
            });
        });

        // Find and add a11y to controls.
        var $controls = this.$nextTrigger.add(this.$previousTrigger);
        $controls.each(function () {
            var $this = $(this).attr({ "tabindex": 0, "aria-controls": self.id });
            !$this.is("button") ? $this.attr({ "role": "button" }) : $this.attr({ "type": "button" });
            if (!$this.find(".visuallyhidden").length) {
                $("<span/>").addClass("visuallyhidden")
                            .html(this === self.$nextTrigger.get(0) ? self.options.nextHint : self.options.previousHint)
                            .appendTo($this);
            }
        });

        // Find and a11y indicators.
        this.$indicators.attr({ "role": "button", "aria-controls": self.id }).eq(activeIndex).addClass("active");

        // Bind events
        // Not namespaced as we want to keep behaviour when not using data api.
        if (this.options.pause === "hover") {
            // Bind the mouse enter/leave events.
            if (!$.support.touchEvents && !$.support.pointerEvents) {
                this.$element.on(emouseenter, $.proxy(this.pause, this))
                    .on(emouseleave, $.proxy(this.cycle, this));
            }
        }

        if (this.options.touch) {
            // You always have to pass the third parameter if setting data.
            this.$element.on("swipe.carousel", { touchAction: "pan-y" }, function(){return true;})
                         .on("swipemove.carousel", $.proxy(this.swipemove, this))
                         .on("swipeend.carousel", $.proxy(this.swipeend, this));
        }

        if (this.options.keyboard) {
            this.$element.on(ekeydown, $.proxy(this.keydown, this));
        }

        $(document).on(this.options.keyboard ? [eclick, ekeydown].join(" ") : eclick, "[aria-controls=" + this.id + "]", $.proxy(this.click, this));
    };

    Carousel.prototype.activeindex = function () {
        var $activeItem = this.$element.find(".carousel-active");
        this.$items = $activeItem.parent().children("figure");

        return this.$items.index($activeItem);
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

        var activePosition = this.activeindex(),
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
            return (this.sliding = false);
        }

        // Trigger the slide event with positional data.
        slideEvent = $.Event(eslide, { relatedTarget: $nextItem[0], direction: direction });
        this.$element.trigger(slideEvent);

        if (slideEvent.isDefaultPrevented()) {
            return false;
        }

        if (this.options.lazyImages && this.options.lazyOnDemand) {
            // Load the next image.
            this.lazyimages.call($nextItem);
        }

        // Good to go? Then let's slide.
        this.sliding = true;

        if (isCycling) {
            this.pause();
        }

        this.$element.one(eslid, function () {

            // Hide the correct trigger if necessary.
            if (!self.options.wrap) {
                var activePosition = self.activeindex();
                if (self.$items && activePosition === self.$items.length - 1) {
                    self.$nextTrigger.attr({ "aria-hidden": true, "hidden": true });
                    self.$previousTrigger.removeAttr("aria-hidden").removeAttr("hidden");
                    if (self.keyboardTriggered) { self.$previousTrigger.focus(); self.keyboardTriggered = false; }
                }
                else if (self.$items && activePosition === 0) {
                    self.$previousTrigger.attr({ "aria-hidden": true, "hidden": true });
                    self.$nextTrigger.show().removeAttr("aria-hidden").removeAttr("hidden");
                    if (self.keyboardTriggered) { self.$nextTrigger.focus(); self.keyboardTriggered = false; }
                } else {
                    self.$nextTrigger.removeAttr("aria-hidden").removeAttr("hidden");
                    self.$previousTrigger.removeAttr("aria-hidden").removeAttr("hidden");
                    self.keyboardTriggered = false;
                }
            }

            // Highlight the correct indicator.
            self.$indicators.removeClass("active")
                .eq(self.activeindex()).addClass("active");
        });

        var complete = function () {

            if (self.$items) {
                // Clear the transition properties if set.
                self.$items.removeClass("swiping").css({ "transition-duration": "" });
            }

            $activeItem.removeClass(["carousel-active", direction].join(" "))
                       .attr({ "aria-selected": false, "tabIndex": -1 });
            $nextItem.removeClass([type, direction].join(" ")).addClass("carousel-active")
                     .attr({ "aria-selected": true, "tabIndex": 0 });

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
                $(this).removeClass("swipe swipe-next").css({ "left": "", "right": "", "opacity": "" });
            });
        }

        // We use ensure here as IOS7 can sometimes not fire 
        // the event if a scroll is accidentally triggered.
        $activeItem.onTransitionEnd(complete).ensureTransitionEnd();

        // Restart the cycle.
        if (isCycling) {

            this.cycle();
        }

        return this;
    };

    Carousel.prototype.keydown = function (event) {

        if (/input|textarea/i.test(event.target.tagName)) {
            return;
        }

        var which = event && event.which;

        if (which === keys.LEFT || which === keys.RIGHT) {

            this.keyboardTriggered = true;

            event.preventDefault();
            event.stopPropagation();

            // Seek out the correct direction indicator, shift, and focus.
            switch (which) {
                case keys.LEFT:
                    if (rtl) {
                        this.next();
                        this.$nextTrigger.focus();
                    } else {
                        this.prev();
                        this.$previousTrigger.focus();
                    }
                    break;
                case keys.RIGHT:
                    if (rtl) {
                        this.prev();
                        this.$previousTrigger.focus();
                    } else {
                        this.next();
                        this.$nextTrigger.focus();
                    }
                    break;
            }
        }
    };

    Carousel.prototype.click = function (event) {

        if (!event) {
            return;
        }

        var which = event.which;

        if (which && which !== 1) {
            if (which === keys.SPACE || which === keys.ENTER) {
                this.keyboardTriggered = true;
            } else {
                return;
            }
        }

        event.preventDefault();
        event.stopPropagation();
        var $this = $(event.target);

        if ($this.hasClass("forward")) {
            this.next();
        }
        else if ($this.is("button")) {
            this.prev();
        } else {
            this.to($this.index());
        }
    };

    Carousel.prototype.swipemove = function (event) {

        if (this.sliding) {
            return;
        }

        this.pause();

        // Left is next.
        var isNext = event.delta.x < 0,
            type = isNext ? (rtl ? "prev" : "next") : (rtl ? "next" : "prev"),
            fallback = isNext ? (rtl ? "last" : "first") : (rtl ? "first" : "last"),
            activePosition = this.activeindex(),
            $activeItem = this.$items.eq(activePosition),
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

        this.$items.not($activeItem).not($nextItem).removeClass("swipe swiping swipe-next").css({ "left": "", "right": "", "opacity": "" });

        if ($nextItem.hasClass("carousel-active")) {
            return;
        }

        if (this.options.lazyImages && this.options.lazyOnDemand) {
            // Load the next image.
            this.lazyimages.call($nextItem);
        }

        // Get the distance swiped as a percentage.
        var width = $activeItem.width(),
            percent = parseFloat((event.delta.x / width) * 100),
            diff = isNext ? 100 : -100;

        if (rtl) {
            percent *= -1;
        }

        // This is crazy complicated. Basically swipe behaviour change direction in rtl
        // So you need to handle that.
        this.$element.addClass("no-transition");
        if (this.options.mode === "slide") {
            if (rtl) {
                $activeItem.addClass("swiping").css({ "right": percent + "%" });
                $nextItem.addClass("swipe swipe-next").css({ "right": (percent - diff) + "%" });
            } else {
                $activeItem.addClass("swiping").css({ "left": percent + "%" });
                $nextItem.addClass("swipe swipe-next").css({ "left": (percent + diff) + "%" });
            }
        } else {
            $activeItem.addClass("swipe").css({ "opacity": 1 - Math.abs((percent / 100)) });
            $nextItem.addClass("swipe swipe-next");
        }
    };

    Carousel.prototype.swipeend = function (event) {

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
            var activePosition = this.activeindex(),
                $activeItem = this.$items.eq(activePosition);

            if (!this.translationDuration) {
                this.translationDuration = parseFloat($activeItem.css("transition-duration"));
            }

            // Get the distance and turn it into a percentage
            // to calculate the duration. Whichever is lowest is used.
            var width = $activeItem.width(),
                percentageTravelled = (Math.abs(event.delta.x) / width) * 100,
                swipeDuration = (((event.duration / 1000) * 100) / percentageTravelled),
                newDuration = (((100 - percentageTravelled) / 100) * (Math.min(this.translationDuration, swipeDuration)));

            // Set the new temporary duration.
            this.$items.each(function () {
                $(this).css({ "transition-duration": newDuration + "s" });
            });
        }

        this.cycle();
        this.slide(method, $(this.$items.filter(".swipe-next")));
    };

    Carousel.prototype.lazyimages = function () {
        if (!this.data("lazyLoaded")) {

            this.find("img[data-src]").each(function () {
                if (this.src.length === 0) {
                    this.src = this.getAttribute("data-src");
                }
            });

            this.data("lazyLoaded", true);
        }
    };

    // No conflict.
    var old = $.fn.carousel;

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

            } else if (typeof options === "string" && /(cycle|pause|next|prev)/.test(options) || (options = opts && opts.slide)) {

                data[options]();

            } else if (data.options.interval) {
                data.pause().cycle();
            }
        });
    };

    // Set the public constructor.
    $.fn.carousel.Constructor = Carousel;

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old;
        return this;
    };

    // Data API
    var init = function () {
        $(".carousel").each(function () {
            var $this = $(this),
                loaded = $this.data("r.carouselLoaded");
            if (!loaded) {
                $this.data("r.carouselLoaded", true);
                $this.carousel($.getDataOptions($this, "carousel"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([einit, echanged].join(" "), function (event) {
        event.type === "RBPinit" ? init() : debouncedInit();
    }).ready(function(){$(this).trigger(einit);});

    w.RESPONSIVE_CAROUSEL = true;

}(jQuery, window, ".r.carousel", ".data-api"));