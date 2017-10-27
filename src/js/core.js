import $d from "./dum"

/**! 
 * Responsive v5.0.0 | MIT License | responsivebp.com 
 */
const RbpCore = (($d, w) => {

    const support = {
        touchEvents: "ontouchstart" in w || w.DocumentTouch && document instanceof w.DocumentTouch,
        pointerEvents: w.PointerEvent
    };

    support.transition = (() => {

        const transitionEnd = () => {
            const div = $d.create("div"),
                transEndEventNames = {
                    "transition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd",
                    "MozTransition": "transitionend",
                    "OTransition": "oTransitionEnd otransitionend"
                };

            const names = Object.keys(transEndEventNames);
            for (let i = 0; i < names.length; i++) {
                if (div.style[names[i]] !== undefined) {
                    return transEndEventNames[names[i]];
                }
            }

            return null;
        };

        return transitionEnd();
    })();

    const getDurationMs = element => w.getComputedStyle(element).transitionDuration.match(/\d+(.\d+)?/)[0] * 1000;

    const dataMap = new WeakMap();

    const rdashAlpha = /-([a-z])/g;

    const fcamelCase = (all, letter) => letter.toUpperCase();

    class RbpCore {

        constructor() {
            this.fn = {
                on: {},
                off: function (api) {
                    if (api === "data-api") {
                        Object.keys(this.on).forEach(k => {
                            $d.off(this.on[k]);
                            delete this.on[k];
                        });
                        return;
                    }

                    $d.off(this.on[api]);
                    delete this.on[api];
                }
            };
            this.support = support;
            this.einit = "rbpinit";

            this.keys = {
                SPACE: 32,
                LEFT: 37,
                RIGHT: 39
            }
        }

        uid() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let id = "";

            for (let i = 0; i < 8; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return `uid-${id}`;
        }

        camelCase(value) {
            let noDash = value.replace(rdashAlpha, fcamelCase);
            return noDash.charAt(0).toLowerCase() + noDash.substring(1)
        }

        data(element) {
            if (!dataMap.has(element)) {
                let attr = {},
                    data = Object.values(element.attributes).filter(a => a.name.indexOf("data-") === 0);

                data.forEach(d => {
                    attr[this.camelCase(d.name.slice(5))] = d.value;
                });

                dataMap.set(element, { attr: attr });
            }

            return dataMap.get(element);
        }

        isRtl(element) {
            return Boolean(element.closest("[dir=rtl]"));
        }

        redraw(element) {
            return element.offsetWidth;
        }

        ensureTransitionEnd(element, duration) {
            const supportTransition = this.support.transition;
            if (!supportTransition) {
                return this;
            }

            let called = false;
            const callback = function () { if (!called) { $d.trigger(element, supportTransition); } };

            $d.one(element, supportTransition, () => called = true);
            w.setTimeout(callback, duration || getDurationMs(element));
            return this;
        }

        onTransitionEnd(element, callback) {
            const supportTransition = this.support.transition;
            let duration = getDurationMs(element),
                error = duration / 10,
                start = new Date();

            this.redraw(element);

            if (supportTransition) {
                $d.one(element, supportTransition, null, () => {
                    // Prevent events firing too early.
                    let end = new Date();
                    if (error >= end.getMilliseconds() - start.getMilliseconds()) {
                        w.setTimeout(callback, duration);
                        return;
                    }

                    callback();
                });

                return;
            }
            callback();
        }
    }

    let core = new RbpCore();
    w.$rbp = core.fn;
    return core;

})($d, window);

export default RbpCore