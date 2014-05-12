/*  ==|== Responsive =============================================================
    Author: James South
    twitter : http://twitter.com/James_M_South
    github : https://github.com/ResponsiveBP/Responsive
    Copyright (c),  James South.
    Licensed under the MIT License.
    ============================================================================== */

/*! Responsive v2.5.5 | MIT License | responsivebp.com */

/*
 * Responsive Utils
 */

/*global jQuery*/
/*jshint forin:false, expr:true*/
(function ($, w, d) {

    "use strict";

    $.support.transition = (function () {
        /// <summary>Returns a value indicating whether the browser supports CSS transitions.</summary>
        /// <returns type="Boolean">True if the current browser supports css transitions.</returns>

        var transitionEnd = function () {
            /// <summary>Gets transition end event for the current browser.</summary>
            /// <returns type="Object">The transition end event for the current browser.</returns>

            var div = d.createElement("div"),
                transEndEventNames = {
                    "transition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd",
                    "MozTransition": "transitionend",
                    "OTransition": "oTransitionEnd otransitionend"
                };

            // Could use the other method but I'm intentionally keeping them
            // separate for now.
            for (var name in transEndEventNames) {
                if (div.style[name] !== undefined) {
                    return { end: transEndEventNames[name] };
                }
            }

            return false;
        };

        return transitionEnd();

    }());

    $.fn.redraw = function () {
        /// <summary>Forces the browser to redraw by measuring the given target.</summary>
        /// <returns type="jQuery">The jQuery object for chaining.</returns>
        var redraw;
        return this.each(function () {
            redraw = this.offsetWidth;
        });
    };

    $.fn.ensureTransitionEnd = function (duration) {
        /// <summary>
        /// Ensures that the transition end callback is triggered.
        /// http://blog.alexmaccaw.com/css-transitions
        ///</summary>
        var called = false,
            $this = $(this),
            callback = function () { if (!called) { $this.trigger($.support.transition.end); } };

        $this.one($.support.transition.end, function () { called = true; });
        w.setTimeout(callback, duration);
        return this;
    };

    $.fn.onTransitionEnd = function (callback) {
        /// <summary>Performs the given callback at the end of a css transition.</summary>
        /// <param name="callback" type="Function">The function to call on transition end.</param>
        /// <returns type="jQuery">The jQuery object for chaining.</returns>
        var supportTransition = $.support.transition;

        return this.each(function () {

            if (!$.isFunction(callback)) {
                return;
            }

            var $this = $(this).redraw(),
                rtransition = /\d+(.\d+)/;

            supportTransition ? $this.one(supportTransition.end, callback)
                                     .ensureTransitionEnd((rtransition.test($this.css("transition-duration")) ? $this.css("transition-duration").match(rtransition)[0] : 0) * 1000)
                              : callback();
        });
    };

    $.support.touchEvents = (function () {
        return ("ontouchstart" in w) || (w.DocumentTouch && d instanceof w.DocumentTouch);
    }());

    $.support.pointerEvents = (function () {
        return (navigator.maxTouchPoints) || (navigator.msMaxTouchPoints);
    }());

    (function () {
        var supportTouch = $.support.touchEvents,
            supportPointer = $.support.pointerEvents;

        var pointerStart = ["pointerdown", "MSPointerDown"],
            pointerMove = ["pointermove", "MSPointerMove"],
            pointerEnd = ["pointerup", "pointerout", "pointercancel", "pointerleave",
                          "MSPointerUp", "MSPointerOut", "MSPointerCancel", "MSPointerLeave"];

        var touchStart = "touchstart",
            touchMove = "touchmove",
            touchEnd = ["touchend", "touchleave", "touchcancel"];

        var mouseStart = "mousedown",
            mouseMove = "mousemove",
            mouseEnd = ["mouseup", "mouseleave"];

        var getEvents = function (ns) {
            var estart,
                emove,
                eend;

            // Keep the events separate since support could be crazy.
            if (supportPointer) {
                estart = (pointerStart.join(ns + " ")) + ns;
                emove = (pointerMove.join(ns + " ")) + ns;
                eend = (pointerEnd.join(ns + " ")) + ns;

            } else if (supportTouch) {
                estart = touchStart + ns;
                emove = touchMove + ns;
                eend = (touchEnd.join(ns + " ")) + ns;
            } else {
                estart = mouseStart + ns;
                emove = mouseMove + ns;
                eend = (mouseEnd.join(ns + " ")) + ns;
            }

            return {
                start: estart,
                move: emove,
                end: eend
            };
        };

        $.fn.swipe = function (options) {
            /// <summary>Adds swiping functionality to the given element.</summary>
            /// <param name="options" type="Object" optional="true" parameterArray="true">
            ///      A collection of optional settings to apply.
            ///      &#10;    1: namespace - The namespace for isolating the touch events.
            /// </param>
            /// <returns type="jQuery">The jQuery object for chaining.</returns>

            var defaults = {
                namespace: null,
                touchAction: "none"
            },
                settings = $.extend({}, defaults, options);

            var ns = settings.namespace ? "." + settings.namespace : "",
                eswipestart = "swipestart" + ns,
                eswipemove = "swipemove" + ns,
                eswipeend = "swipeend" + ns,
                etouch = getEvents(ns);

            return this.each(function () {
                var $this = $(this);

                if (supportPointer) {
                    // Enable extended touch events on IE.
                    $this.css({ "-ms-touch-action": "" + settings.touchAction + "", "touch-action": "" + settings.touchAction + "" });
                }

                var start = {},
                    delta = {},
                    isScrolling,
                    onMove = function (event) {

                        // Normalize the variables.
                        var isMouse = !supportPointer && !supportTouch,
                            original = event.originalEvent,
                            moveEvent;

                        // Only left click allowed.
                        if (isMouse && event.which !== 1) {
                            return;
                        }

                        // One touch allowed.
                        if (original.touches && original.touches.length > 1) {
                            return;
                        }

                        // Ensure swiping with one touch and not pinching.
                        if (event.scale && event.scale !== 1) {
                            return;
                        }

                        var dx = (isMouse ? original.pageX : supportPointer ? original.clientX : original.touches[0].pageX) - start.x,
                            dy = (isMouse ? original.pageY : supportPointer ? original.clientY : original.touches[0].pageY) - start.y;

                        // Mimic touch action on iProducts.
                        // Should also prevent bounce.
                        if (!supportPointer) {
                            switch (settings.touchAction) {
                                case "pan-x":
                                case "pan-y":

                                    isScrolling = settings.touchAction === "pan-x" ?
                                                  Math.abs(dy) < Math.abs(dx) :
                                                  Math.abs(dx) < Math.abs(dy);

                                    if (!isScrolling) {
                                        event.preventDefault();
                                    } else {
                                        event.stopPropagation();
                                        return;
                                    }

                                    break;
                                default:
                                    event.preventDefault();
                                    break;
                            }
                        }

                        moveEvent = $.Event(eswipemove, { delta: { x: dx, y: dy } });

                        $this.trigger(moveEvent);

                        if (moveEvent.isDefaultPrevented()) {
                            return;
                        }

                        // Measure change in x and y.
                        delta = {
                            x: dx,
                            y: dy
                        };
                    },
                    onEnd = function () {

                        // Measure duration
                        var duration = +new Date() - start.time,
                            endEvent;

                        // Determine if slide attempt triggers slide.
                        if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {

                            // Set the direction and return it.
                            var horizontal = delta.x < 0 ? "left" : "right",
                                vertical = delta.y < 0 ? "up" : "down",
                                direction = Math.abs(delta.x) > Math.abs(delta.y) ? horizontal : vertical;

                            endEvent = $.Event(eswipeend, { delta: delta, direction: direction, duration: duration });

                            $this.trigger(endEvent);
                        }

                        // Disable the touch events till next time.
                        $this.off(etouch.move).off(etouch.end);
                    };

                $this.off(etouch.start).on(etouch.start, function (event) {

                    // Normalize the variables.
                    var isMouse = event.type === "mousedown",
                        isPointer = event.type !== "touchstart" && !isMouse,
                        original = event.originalEvent,
                        startEvent;

                    if ((isPointer || isMouse) && $(event.target).is("img")) {
                        event.preventDefault();
                    }

                    // Used for testing first move event
                    isScrolling = undefined;

                    // Measure start values.
                    start = {
                        // Get initial touch coordinates.
                        x: isMouse ? original.pageX : isPointer ? original.clientX : original.touches[0].pageX,
                        y: isMouse ? original.pageY : isPointer ? original.clientY : original.touches[0].pageY,

                        // Store time to determine touch duration.
                        time: +new Date()
                    };

                    startEvent = $.Event(eswipestart, { start: start });

                    $this.trigger(startEvent);

                    if (startEvent.isDefaultPrevented()) {
                        return;
                    }

                    // Reset delta and end measurements.
                    delta = { x: 0, y: 0 };

                    // Attach touchmove and touchend listeners.
                    $this.on(etouch.move, onMove)
                         .on(etouch.end, onEnd);
                });
            });
        };

        $.fn.removeSwipe = function (namespace) {
            /// <summary>Removes swiping functionality from the given element.</summary>
            /// <param name="namespace" type="String">The namespace for isolating the touch events.</param>
            /// <returns type="jQuery">The jQuery object for chaining.</returns>

            var ns = namespace ? "." + namespace : "",
                etouch = getEvents(ns);

            return this.each(function () {

                // Disable extended touch events on ie.
                // Unbind events.
                $(this).css({ "-ms-touch-action": "", "touch-action": "" })
                       .off(etouch.start).off(etouch.move).off(etouch.end);
            });
        };

    }());

    $.extend($.expr[":"], {
        attrStart: function (el, i, props) {
            /// <summary>Custom selector extension to allow attribute starts with selection.</summary>
            /// <param name="el" type="DOM">The element to test against.</param>
            /// <param name="i" type="Number">The index of the element in the stack.</param>
            /// <param name="props" type="Object">Metadata for the element.</param>
            /// <returns type="Boolean">True if the element is a match; otherwise, false.</returns>
            var hasAttribute = false;

            $.each(el.attributes, function () {
                if (this.name.indexOf(props[3]) === 0) {
                    hasAttribute = true;
                    return false;  // Exit the iteration.
                }
                return true;
            });

            return hasAttribute;
        }
    });

    $.buildDataOptions = function ($elem, options, prefix, namespace) {
        /// <summary>Creates an object containing options populated from an elements data attributes.</summary>
        /// <param name="$elem" type="jQuery">The object representing the DOM element.</param>
        /// <param name="options" type="Object">The object to extend</param>
        /// <param name="prefix" type="String">The prefix with which to identify the data attribute.</param>
        /// <param name="namespace" type="String">The namespace with which to segregate the data attribute.</param>
        /// <returns type="Object">The extended object.</returns>
        $.each($elem.data(), function (key, val) {

            if (key.indexOf(prefix) === 0 && key.length > prefix.length) {

                // Build a key with the correct format.
                var length = prefix.length,
                    newKey = key.charAt(length).toLowerCase() + key.substring(length + 1);

                options[newKey] = val;

                // Clean up.
                $elem.removeData(key);
            }

        });

        if (namespace) {
            $elem.data(namespace + "." + prefix + "Options", options);
        } else {
            $elem.data(prefix + "Options", options);
        }

        return options;
    };

}(jQuery, window, document));