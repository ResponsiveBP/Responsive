import $d from "./dum"
import RbpBase from "./base"
import RbpCore from "./core"

const RbpCarousel = (($d, core, base) => {

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
            super(element, defaults, options, "carousel"); {

                this.paused = null;
                this.interval = null;
                this.sliding = null;
                this.$items = null;
                this.keyboardTriggered = null;
                this.translationDuration = null;

                const rtl = core.isRtl(this.element);
                this.nextHint = this.options.nextHint.replace(rhint, rtl ? "$1" : "$2");
                this.prevHint = this.options.prevHint.replace(rhint, rtl ? "$1" : "$2");

                this.nextTrigger = this.options.nextTrigger ? $d.query(this.options.nextTrigger) : $d.children(this.element, "button.forward")[0];
                this.prevTrigger = this.options.prevTrigger ? $d.query(this.options.prevTrigger) : $d.children(this.element, "button:not(.forward)")[0];
                this.indicators = this.options.indicators ? $d.query(this.options.indicators) : $d.children($d.children(this.element, "ol")[0], "li");
                this.items = $d.children(this.element, "figure, .slide");

                const activeIndex = this.items.findIndex(i => $d.hasClass(i, "carousel-active"));

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

                // Add the css class to support fade.
                this.options.mode === "fade" && $d.addClass(this.$element, "carousel-fade");

                // Add a11y features.
                $d.setAttr(this.element, { "role": "listbox", "aria-live": "polite" });
            }
        }
    }

    // Register plugin and data-api event handler
    core.fn.carousel = (e, o) => $d.queryAll(e).forEach(i => core.data(i).carousel || (core.data(i).carousel = new RbpCarousel(i, o)));
    core.fn.on["carousel.data-api"] = $d.on(document, core.einit, null, () => {
        core.fn.carousel(`${["interval", "mode", "pause", "wrap", "keyboard"].map(x => `[data-carousel-${x}]`).join(", ")}`);
    });

    $d.ready().then(() => { $d.trigger(document, core.einit); });

    return RbpCarousel;

})($d, RbpCore, RbpBase);

export default RbpCarousel;