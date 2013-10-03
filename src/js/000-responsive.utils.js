/*
 * Responsive framework
 *
 * Responsive is a minimalist framework for rapidly creating responsive websites specifically 
 * written to prevent the need to undo styles set by the framework itself and allow 
 * developers to write streamlined code.
 *
 * Portions of this CSS and JS are based on the incredibly hard work that has been 
 * done creating the HTML5 Boilerplate, Twitter Bootstrap, Zurb Foundation, and Normalize.css 
 * and all credit for that work is due to them.
 * 
 */

/*  ==|== Responsive =============================================================
    Author: James South
    twitter : http://twitter.com/James_M_South
    github : https://github.com/JimBobSquarePants/Responsive
    Copyright (c),  James South.
    Licensed under the Apache License v2.0.
    ============================================================================== */

/*! Responsive v2.0.0 | Apache v2.0 License | git.io/rRNRLA */

/*
 * Responsive Utils
 */

/*global jQuery*/
/*jshint forin:false*/
(function ($) {

    "use strict";

    $.support.transition = (function () {
        /// <summary>Returns a value indicating whether the browser supports CSS transitions.</summary>
        /// <returns type="Boolean">True if the current browser supports css transitions.</returns>

        var transitionEnd = function () {
            /// <summary>Gets transition end event for the current browser.</summary>
            /// <returns type="Object">The transition end event for the current browser.</returns>

            var el = document.createElement("responsive"),
                transEndEventNames = {
                    "transition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd",
                    "MozTransition": "transitionend",
                    "OTransition": "oTransitionEnd otransitionend"
                };

            for (var name in transEndEventNames) {
                if (el.style[name] !== undefined) {
                    return { end: transEndEventNames[name] };
                }
            }

            return false;
        };

        return transitionEnd();

    }());

    $.fn.swipe = function (namespace) {

        var ns = namespace && ("." + namespace),
            eswipestart = "swipestart" + ns,
            eswipemove = "swipemove" + ns,
            eswipeend = "swipeend" + ns,
            etouchstart = "touchstart" + ns + " pointerdown" + ns + " MSPointerDown" + ns,
            etouchmove = "touchmove" + ns + " pointermove" + ns + "  MSPointerMove" + ns,
            etouchend = "touchend" + ns + " pointerup" + ns + "  MSPointerUp" + ns,
            supportTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0) ||
                (window.DocumentTouch && document instanceof DocumentTouch);

        return this.each(function () {

            if (!supportTouch) {
                return;
            }

            var $this = $(this);

            // Enable extended touch events on ie.
            $this.css({ "-ms-touch-action": "none", "touch-action": "none" });

            var start = {},
                delta,
                move = function (event) {

                    // Normalise the variables.
                    var isPointer = event.type !== "touchmove",
                        original = event.originalEvent,
                        moveEvent = $.Event(eswipemove);

                    // Ensure swiping with one touch and not pinching.
                    if (isPointer) {
                        if (original.pointerType && original.pointerType !== 2) {
                            return;
                        }
                    } else {
                        if (original.touches.length > 1) {
                            return;
                        }
                    }
                    if (event.scale && event.scale !== 1) {
                        return;
                    }

                    $this.trigger(moveEvent);

                    if (moveEvent.isDefaultPrevented()) {
                        return;
                    }

                    var dx = isPointer ? original.clientX : original.touches[0].pageX,
                        dy = isPointer ? original.clientY : original.touches[0].pageY;

                    // Measure change in x and y.
                    delta = {
                        x: dx - start.x,
                        y: dy - start.y
                    };
                },
                end = function () {

                    // Measure duration
                    var duration = +new Date() - start.time,
                        endEvent;

                    // Determine if slide attempt triggers next/previous slide.
                    // If slide duration is less than 1000ms
                    // and if slide amount is greater than 20px
                    // or if slide amount is greater than half the width
                    var isValidSlide = (Number(duration) < 1000 &&
                        (Math.abs(delta.x) > 20 || Math.abs(delta.y) > 20 ||
                            Math.abs(delta.x) > $this[0].clientWidth / 2 ||
                            Math.abs(delta.y) > $this[0].clientHeight / 2));

                    if (isValidSlide) {

                        // Set the direction and return it.
                        var horizontal = delta.x < 0 ? "left" : "right",
                            vertical = delta.y < 0 ? "up" : "down",
                            direction = Math.abs(delta.x) > Math.abs(delta.y) ? horizontal : vertical;

                        endEvent = $.Event(eswipeend, { delta: delta, direction: direction, duration: duration });

                        $this.trigger(endEvent);
                    }

                    // Disable the touch events till next time.
                    $this.off(etouchmove).off(etouchend);
                };

            $this.off(etouchstart).on(etouchstart, function (event) {

                // Normalise the variables.
                var isPointer = event.type !== "touchstart",
                    original = event.originalEvent,
                    startEvent = $.Event(eswipestart);

                $this.trigger(startEvent);

                if (startEvent.isDefaultPrevented()) {
                    return;
                }

                // Measure start values.
                start = {
                    // Get initial touch coordinates.
                    x: isPointer ? original.clientX : original.touches[0].pageX,
                    y: isPointer ? original.clientY : original.touches[0].pageY,

                    // Store time to determine touch duration.
                    time: +new Date()
                };

                // Reset delta and end measurements.
                delta = {};

                // Attach touchmove and touchend listeners.
                $this.on(etouchmove, move)
                    .on(etouchend, end);
            });
        });
    };

    $.fn.redraw = function () {
        /// <summary>Forces the browser to redraw by measuring the given target.</summary>
        /// <returns type="jQuery">The jQuery object for chaining.</returns>
        var redraw;
        return this.each(function () {
            redraw = this.offsetWidth;
        });
    };

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

}(jQuery));
