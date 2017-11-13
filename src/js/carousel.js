import $d from "./dum"
import Swiper from "./swiper"
import RbpBase from "./base"
import RbpCore from "./core"

const RbpCarousel = (($d, swiper, core, base, w, d) => {

    const rhint = /\((\w+)\|(\w+)\)/;

    const defaults = {
        interval: 0, // Better for a11y
        mode: "slide",
        pause: "hover",
        wrap: true,
        keyboard: true,
        touch: true,
        lazyImages: true,
        lazyOnDemand: true,
        nextTrigger: null,
        nextHint: "Next: (Left|Right) Arrow",
        prevTrigger: null,
        prevHint: "Previous: (Right|Left) Arrow",
        indicators: null
    };

    class RbpCarousel extends base {
        constructor(element, options) {
            super(element, defaults, options, "carousel");

            this.eslide = "slide.rbp";
            this.eslid = "slid.rbp";

            this.paused = null;
            this.sliding = null;
            this.keyboardTriggered = null;
            this.translationDuration = null;

            const rtl = core.isRtl(this.element);
            this.nextHint = this.options.nextHint.replace(rhint, rtl ? "$1" : "$2");
            this.prevHint = this.options.prevHint.replace(rhint, rtl ? "$1" : "$2");

            this.nextTrigger = this.options.nextTrigger ? $d.query(this.options.nextTrigger) : $d.children(this.element, "button.forward")[0];
            this.prevTrigger = this.options.prevTrigger ? $d.query(this.options.prevTrigger) : $d.children(this.element, "button:not(.forward)")[0];
            this.indicators = this.options.indicators ? $d.query(this.options.indicators) : $d.children($d.children(this.element, "ol")[0], "li");
            this.options.mode === "fade" && $d.addClass(this.element, "carousel-fade");
            this.items = $d.children(this.element, "figure, .slide");
            this.interval = parseInt(this.options.interval, 10);

            const activeIndex = this.activeIndex();

            // Hide the previous button if no wrapping.
            const hidden = { "aria-hidden": true, "hidden": true };
            if (!this.options.wrap) {
                if (activeIndex === 0) {
                    $d.setAttr(this.prevTrigger, hidden);
                }
            }

            // Hide both if one item.
            if (this.items.length === 1) {
                $d.setAttr(this.prevTrigger, hidden);
                $d.setAttr(this.nextTrigger, hidden);
            }

            // Add a11y features.
            $d.setAttr(this.element, { "role": "listbox", "aria-live": "polite" });

            // Slides
            this.items.forEach((p, i) => {
                const active = i === activeIndex;
                $d.setAttr(p, { "role": "option", "aria-selected": active, "tabindex": active ? 0 : -1 });
            });

            // Controls.
            [this.nextTrigger, this.prevTrigger].forEach(t => {
                $d.setAttr(t, { "tabindex": 0, "aria-controls": this.element.id });
                if (!t.tagName === "BUTTON") { $d.setAttr(t, { "role": "button" }); }
                if (!$d.query(".vhidden", t)) {
                    let span = $d.create("span");
                    $d.addClass(span, "vhidden");
                    span.innerHTML = t === this.nextTrigger ? this.nextHint : this.prevHint;
                    $d.append(t, span);
                }
            });

            // Indicators.
            $d.setAttr(this.indicators, { "role": "button", "aria-controls": this.element.id });
            this.indicators.forEach((i, idx) => { idx === activeIndex && $d.addClass(i, "active"); });

            // Bind events
            if (this.options.lazyImages && !this.options.lazyOnDemand) {
                $d.on(w, "load", null, this.lazyimages.bind(this));
            }

            if (this.options.pause === "hover") {
                // Bind the mouse enter/leave events.
                if (!core.support.touchEvents && !core.support.pointerEvents) {
                    $d.on(this.element, "mouseenter", null, this.pause.bind(this));
                    $d.on(this.element, "mouseleave", null, this.cycle.bind(this));
                }
            }

            if (this.options.touch) {
                this.swiper = new swiper(`#${this.element.id}`, "carousel", "pan-y");
                this.swiper.onSwipeMove(this.swipemove.bind(this))
                    .onSwipeEnd(this.swipeend.bind(this));
            }

            if (this.options.keyboard) {
                $d.on(this.element, "keydown", null, this.keydown.bind(this));
            }

            $d.on(d, this.options.keyboard
                ? ["click", "keydown"]
                : "click", `[aria-controls=${this.element.id}]`, this.click.bind(this));

            if (this.interval) {
                this.pause().cycle();
            }
        }

        activeIndex() {
            return this.items.findIndex(i => $d.hasClass(i, "carousel-active"));
        }

        pause(event) {
            if (!event) {
                // Mark as paused
                this.paused = true;
            }

            // Ensure that transition end is triggered.
            if ($d.queryAll(".next, .prev", this.element).length && core.support.transition) {
                $d.trigger(this.element, core.support.transition);
                this.cycle(true);
            }

            // Clear the interval and return the carousel for chaining.
            this.interval = core.clearInterval(this.interval);

            return this;
        }

        cycle(event) {
            if (!event) {
                // Flag false when there's no event.
                this.paused = false;
            }

            if (this.interval) {
                core.clearInterval(this.interval);
            }

            if (this.options.interval && !this.paused) {
                // Cycle to the next item on the set interval
                this.interval = core.setInterval(this.next.bind(this), this.options.interval);
            }

            return this;
        }

        to(index) {
            const activeIndex = this.activeIndex();

            if (index > (this.items.length - 1) || index < 0) {
                return;
            }

            if (this.sliding) {
                $d.one(this.element, this.eslid, null, () => { this.to(index); });
                return;
            }

            if (activeIndex === index) {
                this.pause().cycle();
                return;
            }

            this.slide(index > activeIndex ? "next" : "prev", this.items[index]);
        }

        next() {

            if (this.sliding) {
                return false;
            }

            return this.slide("next");
        }

        prev() {

            if (this.sliding) {
                return false;
            }

            return this.slide("prev");
        }

        swipemove() { }

        swipeend() { }

        keydown() { }

        click(event) {

            if (!event) {
                return;
            }

            const which = event.which;
            if (which && which !== 1) {
                if (which === core.keys.SPACE || which === core.keys.ENTER) {
                    this.keyboardTriggered = true;
                } else {
                    return;
                }
            }

            event.preventDefault();
            event.stopPropagation();

            if (event.target === this.nextTrigger) {
                this.next();
            }
            else if (event.target === this.prevTrigger) {
                this.prev();
            } else {
                this.to(this.indicators.findIndex(i => i === event.target));
            }
        }

        slide(type, next) {
            let activeItem = this.items[this.activeIndex()],
                nextItem = next || $d[type](activeItem, "figure, .slide"),
                isCycling = this.interval,
                isNext = type === "next",
                direction = isNext ? "left" : "right",
                fallback = isNext ? 0 : this.items.length - 1;

            if (isCycling) {
                // Pause if cycling.
                this.pause();
            }

            // Work out which item to slide to.
            if (!nextItem) {

                if (!this.options.wrap) {
                    return;
                }

                nextItem = this.items[fallback];
            }

            if ($d.hasClass(nextItem, "carousel-active")) {
                return (this.sliding = false);
            }

            if (!$d.trigger(this.element, this.eslide, { relatedTarget: nextItem, direction: direction })) {
                return;
            }

            // if (this.options.lazyImages && this.options.lazyOnDemand) {
            //     // Load the next image.
            //     this.lazyimages.call(nextItem);
            // }

            // Good to go? Then let's slide.
            this.sliding = true;

            if (isCycling) {
                this.pause();
            }

            $d.one(this.element, this.eslid, null, () => {
                if (!this.options.wrap) {
                    const activeindex = this.activeIndex();
                    if (this.items && activeindex === this.items.length - 1) {
                        $d.setAttr(this.nextTrigger, { "aria-hidden": true, "hidden": true });
                        $d.removeAttr(this.prevTrigger, ["aria-hidden", "hidden"]);
                        if (this.keyboardTriggered) { this.prevTrigger.focus(); this.keyboardTriggered = false; }
                    }
                    else if (this.items && activeindex === 0) {
                        $d.setAttr(this.prevTrigger, { "aria-hidden": true, "hidden": true });
                        $d.removeAttr(this.nextTrigger, ["aria-hidden", "hidden"]);
                        if (this.keyboardTriggered) { this.nextTrigger.focus(); this.keyboardTriggered = false; }
                    } else {
                        $d.removeAttr(this.prevTrigger, ["aria-hidden", "hidden"]);
                        $d.removeAttr(this.nextTrigger, ["aria-hidden", "hidden"]);
                        this.keyboardTriggered = false;
                    }
                }

                // Highlight the correct indicator.
                $d.removeClass(this.indicators, "active");
                $d.addClass(this.indicators[this.activeIndex()], "active");
            });

            const complete = () => {

                if (this.items) {
                    // Clear the transition properties if set.
                    $d.removeClass(this.items, "swiping");
                    $d.setStyle(this.items, { "transition-duration": "" });
                }

                $d.removeClass(activeItem, ["carousel-active", direction]);
                $d.setAttr(activeItem, { "aria-selected": false, "tabIndex": -1 });

                $d.removeClass(nextItem, [type, direction]);
                $d.addClass(nextItem, "carousel-active");
                $d.setAttr(nextItem, { "aria-selected": true, "tabIndex": 0 });

                this.sliding = false;
                $d.trigger(this.element, this.eslid, { relatedTarget: nextItem, direction: direction })
            };

            // Force reflow.
            $d.addClass(nextItem, type);
            core.redraw(nextItem);

            // Do the slide.
            $d.addClass(activeItem, direction);
            $d.addClass(nextItem, direction);

            // Clear the added css.
            if (this.items) {
                this.items.forEach(i => {
                    $d.removeClass(i, "swipe swipe-next");
                    $d.setStyle(i, { "left": "", "right": "", "opacity": "" });
                });
            }

            core.onTransitionEnd(activeItem, complete);
            core.redraw(activeItem);

            // Restart the cycle.
            if (isCycling) {

                this.cycle();
            }

            return this;
        }
    }

    // Register plugin and data-api event handler
    core.fn.carousel = (e, o) => $d.queryAll(e).forEach(i => core.data(i).carousel || (core.data(i).carousel = new RbpCarousel(i, o)));
    core.fn.on["carousel.data-api"] = $d.on(d, core.einit, null, () => {
        core.fn.carousel(`${["interval", "mode", "pause", "wrap", "keyboard"].map(x => `[data-carousel-${x}]`).join(", ")}`);
    });

    $d.ready().then(() => { $d.trigger(d, core.einit); });

    return RbpCarousel;

})($d, Swiper, RbpCore, RbpBase, window, document);

export default RbpCarousel;