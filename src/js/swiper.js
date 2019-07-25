import $d from "./dum"

const Swiper = (($d, w) => {

    const support = {
        touchEvents: "ontouchstart" in w || w.DocumentTouch && document instanceof w.DocumentTouch,
        pointerEvents: w.PointerEvent
    };

    const pointerStart = "pointerdown",
        pointerMove = "pointermove",
        pointerEnd = ["pointerup", "pointerout", "pointercancel", "pointerleave", "lostpointercapture"];

    const touchStart = "touchstart",
        touchMove = "touchmove",
        touchEnd = ["touchend", "touchleave", "touchcancel"];

    const mouseStart = "mousedown",
        mouseMove = "mousemove",
        mouseEnd = ["mouseup", "mouseleave"];

    const getTouchEvents = () => {
        let eend = mouseEnd,
            emove = mouseMove,
            estart = mouseStart;

        // Keep the events separate since support could be crazy.
        if (support.touchEvents) {
            estart = touchStart;
            emove = touchMove;
            eend = touchEnd;
        } else if (support.pointerEvents) {
            estart = pointerStart;
            emove = pointerMove;
            eend = pointerEnd;
        }

        return {
            start: estart,
            move: emove,
            end: eend
        };
    };

    const getSwipeEvents = ns => ({
        swipeStart: `swipestart${ns}`,
        swipeMove: `swipemove${ns}`,
        swipeEnd: `swipeend${ns}`
    });

    const bindTouchEvents = swiper => {

        // Enable extended touch events on supported browsers before any touch events.
        if (support.pointerEvents) {
            swiper.elements.forEach(e => {
                $d.setStyle(e, { touchAction: swiper.touchAction });
            });
        }

        swiper.elements.forEach(element => {

            let delta = {},
                start = {};

            const onMove = event => {

                // Normalize the variables.
                let isMouse = event.type === "mousemove",
                    isPointer = event.type !== "touchmove" && !isMouse;

                // Only left click allowed.
                if (isMouse && event.which !== 1) {
                    return;
                }

                // One touch allowed.
                if (event.touches && event.touches.length > 1) {
                    return;
                }

                // Ensure swiping with one touch and not pinching.
                if (event.scale && event.scale !== 1) {
                    return;
                }

                /* eslint-disable no-nested-ternary */
                const dx = (isMouse ? event.pageX : isPointer ? event.clientX : event.touches[0].pageX) - start.x;
                const dy = (isMouse ? event.pageY : isPointer ? event.clientY : event.touches[0].pageY) - start.y;
                /* eslint-enable no-nested-ternary */

                /* eslint-disable sort-vars, no-extra-parens */
                let doSwipe = false,
                    rectangle = element.getBoundingClientRect(),
                    percentX = Math.abs(parseFloat((dx / rectangle.width) * 100)) || 100,
                    percentY = Math.abs(parseFloat((dy / rectangle.height) * 100)) || 100;
                /* eslint-enable sort-vars, no-extra-parens */

                // Work out whether to do a scroll based on the sensitivity limit.
                switch (swiper.touchAction) {
                    case "pan-x":
                        if (Math.abs(dy) > Math.abs(dx)) {
                            event.preventDefault();
                        }
                        doSwipe = Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > swiper.sensitivity && percentY < 100;
                        break;
                    case "pan-y":
                        if (Math.abs(dx) > Math.abs(dy)) {
                            event.preventDefault();
                        }
                        doSwipe = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swiper.sensitivity && percentX < 100;
                        break;
                    default:
                        event.preventDefault();
                        doSwipe = Math.abs(dy) > swiper.sensitivity || Math.abs(dx) > swiper.sensitivity && percentX < 100 && percentY < 100;
                        break;
                }

                event.stopPropagation();
                if (!doSwipe || !$d.trigger(element, swiper.swipeEvents.swipeMove, { delta: { x: dx, y: dy } })) {
                    return;
                }

                // Measure change in x and y.
                delta = {
                    x: dx,
                    y: dy
                };
            };

            const onEnd = () => {
                // Measure duration
                const duration = Number(new Date()) - start.time;

                // Determine if slide attempt triggers slide.
                if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {

                    // Set the direction and return it.
                    /* eslint-disable sort-vars */
                    const horizontal = delta.x < 0 ? "left" : "right",
                        vertical = delta.y < 0 ? "up" : "down",
                        direction = Math.abs(delta.x) > Math.abs(delta.y) ? horizontal : vertical;
                    /* eslint-disable sort-vars */

                    if (!$d.trigger(element, swiper.swipeEvents.swipeEnd, { delta: delta, direction: direction, duration: duration })) {
                        return;
                    }
                }

                // Disable the touch events till next time.
                $d.off(element, swiper.touchEvents.move);
                $d.off(element, swiper.touchEvents.end);
            };

            const onStart = event => {
                // Normalize the variables.
                const isMouse = event.type === "mousedown";
                const isPointer = event.type !== "touchstart" && !isMouse;

                event.stopPropagation();

                // Measure start values.
                start = {
                    // Get initial touch coordinates.
                    /* eslint-disable no-nested-ternary */
                    x: isMouse ? event.pageX : isPointer ? event.clientX : event.touches[0].pageX,
                    y: isMouse ? event.pageY : isPointer ? event.clientY : event.touches[0].pageY,
                    /* eslint-enable no-nested-ternary */

                    // Store time to determine touch duration.
                    time: Number(new Date())
                };

                if (!$d.trigger(element, swiper.swipeEvents.swipeStart, { start: start })) {
                    return;
                }

                // Reset delta and end measurements.
                delta = { x: 0, y: 0 };

                // Attach touchmove and touchend listeners.
                $d.on(element, swiper.touchEvents.move, null, onMove);
                $d.on(element, swiper.touchEvents.end, null, onEnd);
            };

            $d.off(element, swiper.touchEvents.start);
            $d.on(element, swiper.touchEvents.start, null, onStart);
        });
    };

    class Swiper {
        constructor(selector, namespace, touchAction, sensitivity) {
            this.selector = selector;
            this.namespace = namespace ? `.${namespace}` : "";
            this.touchAction = touchAction || "none";
            this.sensitivity = sensitivity || 5;
            this.swipeEvents = getSwipeEvents(this.namespace);
            this.touchEvents = getTouchEvents();
            this.elements = $d.queryAll(selector);
            bindTouchEvents(this);
        }

        onSwipeStart(element, handler) {
            $d.on(this.elements, this.swipeEvents.swipeStart, null, handler);
            return this;
        }

        onSwipeMove(handler) {
            $d.on(this.elements, this.swipeEvents.swipeMove, null, handler);
            return this;
        }

        onSwipeEnd(handler) {
            $d.on(this.elements, this.swipeEvents.swipeEnd, null, handler);
            return this;
        }

        destroy() {
            $d.off(this.elements, this.swipeEvents.swipeStart);
            $d.off(this.elements, this.swipeEvents.swipeMove);
            $d.off(this.elements, this.swipeEvents.swipeEnd);
        }
    }

    return Swiper;

})($d, window);

export default Swiper