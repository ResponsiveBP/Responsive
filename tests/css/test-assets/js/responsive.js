/*
 * Responsive framework
 *
 * Responsive is a minimalist framework for rapidly creating responsive websites specifically 
 * written to prevent the need to undo styles set by the framework itself and allow 
 * developers to write streamlined code.
 *
 * Portions of this CSS are based on the incredibly hard work that has been 
 * done creating the HTML5 Boilerplate, Bootstrap, Zurb Foundation, and Normalize.css 
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

/*! Responsive v1.0.0 | Apache v2.0 License | git.io/rRNRLA */

/*
 * Responsive Utils v1.0.0
 */

/*global jQuery*/
/*jshint forin:false*/
(function ($) {

    "use strict";

    var el = document.createElement("responsive"),
        testProps = function (props) {
            // A flexible property testing method.

            var type = $.isArray(props) ? "a" : "o";

            for (var i in props) {

                var prop = (type === "a" ? props[i] : i);

                if (el.style[prop] !== undefined) {
                    return prop;
                }
            }
            return false;
        };


    $.support.transition = (function () {
        // Returns a value indicating whether the browser supports CSS transitions.

        var transitionTests = {
            "transition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd",
            "MozTransition": "transitionend",
            "OTransition": "otransitionend"
        },
            support = testProps(transitionTests);

        return support && {
            end: (function () {

                return transitionTests[support];

            }())
        };

    }());

    $.extend($.expr[":"], {
        // Custom selector extension to allow attribute starts with selection.
        attrStart: function (el, i, props) {
            var hasAttribute = false;

            $.each(el.attributes, function (i, attr) {
                if (attr.name.indexOf(props[3]) !== -1) {
                    hasAttribute = true;
                    return false;  // Exit the iteration.
                }
            });

            return hasAttribute;
        }
    });

    $.buildDataOptions = function ($elem, options, prefix) {

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

        $elem.data(prefix + "Options", options);

        return options;
    };

}(jQuery));
/*
* Responsive Accordion v1.0.0
*/

/*global jQuery*/
(function ($) {

    "use strict";

    // General variables.
    var supportTransition = $.support.transition,

    // The Accordion object that contains our methods.
        Accordion = function (element, options) {

            this.$element = $(element);
            this.options = $.extend({}, $.fn.accordion.defaults, options);
            this.$parent = null;
            this.transitioning = null;

            if (this.options.parent) {
                this.$parent = this.$element.parents(this.options.parent + ":first");
            }

            // Check to see if the plug-in is set to toggle and trigger 
            // the correct internal method if so.
            if (this.options.toggle) {
                this.toggle();
            }

        };

    // Assign public methods via the Accordion prototype.
    Accordion.prototype = {

        constructor: Accordion,
        show: function () {

            if (this.transitioning || this.$element.hasClass("expand")) {
                return;
            }

            var actives = this.$parent && this.$parent.find(".expand"),
                hasData;

            if (actives && actives.length) {
                hasData = actives.data("accordion");
                actives.accordion("hide");

                if (!hasData) {
                    actives.data("accordion", null);
                }
            }

            this.transition("addClass", $.Event("show"), "shown");
        },
        hide: function () {

            if (this.transitioning || !this.$element.hasClass("expand")) {
                return;
            }

            this.transition("removeClass", $.Event("hide"), "hidden");

        },
        transition: function (method, startEvent, completeEvent) {
            var self = this,
                complete = function () {
                    // The event to expose.
                    var eventToTrigger = $.Event(completeEvent + ".accordion.responsive");

                    self.transitioning = false;

                    self.$element.trigger(eventToTrigger);
                };

            if (startEvent.isDefaultPrevented()) {
                return;
            }

            self.transitioning = true;

            this.$element.trigger(startEvent)[method]("expand");
            this.$element[startEvent.type === "hide" ? "addClass" : "removeClass"]("collapse");

            if (supportTransition && this.$element.hasClass("collapse")) {
                this.$element.one(supportTransition.end, complete);
            } else {
                complete();
            }

        },
        toggle: function () {
            // Run the correct command based on the presence of the class 'expand'.
            this[this.$element.hasClass("expand") ? "hide" : "show"]();
        }

    };

    /* Plugin definition */
    $.fn.accordion = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("accordion"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("accordion", (data = new Accordion(this, opts)));
            }

            // Run the appropriate function if a string is passed.
            if (typeof options === "string") {
                data[options]();
            }

        });

    };

    // Define the defaults.
    $.fn.accordion.defaults = {
        toggle: true
    };

    // Set the public constructor.
    $.fn.accordion.Constructor = Accordion;

    // Accordion data api initialization.
    $(function () {
        $(document.body).on("click.accordion.responsive", ":attrStart(data-accordion)", function (event) {

            event.preventDefault();

            var $this = $(this),
                data = $this.data("accordionOptions"),
                options = data || $.buildDataOptions($this, {}, "accordion"),
                target = options.target || (options.target = $this.attr("href")),
                $target = $(target),
                params = $target.data("accordion") ? "toggle" : options;

            // Run the accordion method.
            $target.accordion(params);

        });
    });
}(jQuery));/*
 * Responsive AutoSize v1.0.0
 */

/*global jQuery*/
(function ($) {

    "use strict";

    var resisizeTimer,

    // The AutoSize object that contains our methods.
        AutoSize = function (element, options) {

            this.$element = $(element);
            this.$clone = null;
            this.options = null;

            // Initial setup.
            if ($.isPlainObject(options)) {

                this.options = $.extend({}, $.fn.autoSize.defaults, options);

                var self = this,
                    attributes = this.options.removeAttributes,
                    classes = this.options.removeClasses,
                    $element = this.$element,
                    createClone = function () {

                        // Create a clone and offset it removing all specified attributes classes and data.
                        self.$clone = self.$element.clone()
                                          .css({ "position": "absolute", "top": "-99999px", "left": "-99999px", "visibility": "hidden", "overflow": "hidden" })
                                          .attr({ "tabindex": -1, "rows": 2 })
                                          .removeAttr("id name data-autosize " + attributes)
                                          .removeClass(classes)
                                          .insertAfter($element);

                        // jQuery goes spare if you try to remove
                        // null data.
                        if (classes) {
                            self.$clone.removeData(classes);
                        }

                    };

                $.when(createClone()).then(this.size());
            }
        };

    AutoSize.prototype = {
        constructor: AutoSize,
        size: function () {

            var transition = $.support.transition,
                $element = this.$element,
                element = this.$element[0],
                $clone = this.$clone,
                clone = $clone[0],
                height = 0,
                sizeEvent = $.Event("size.autosize.responsive"),
                sizedEvent = $.Event("sized.autosize.responsive"),
                complete = function () {
                    $element.trigger(sizedEvent);
                };

            $element.trigger(sizeEvent);

            // Set the width of the clone to match.
            $clone.width($element.width());

            // Copy the text across.
            $clone.val($element.val());

            // Set the height so animation will work.
            $element.height($clone.height());

            // Shrink
            while (clone.rows > 1 && clone.scrollHeight < clone.offsetHeight) {
                clone.rows -= 1;
            }

            // Grow
            while (clone.scrollHeight > clone.offsetHeight && height !== clone.offsetHeight) {
                height = element.offsetHeight;
                clone.rows += 1;
            }
            clone.rows += 1;

            // Reset the height
            $element.height($clone.height());

            // Do our callback
            if (transition) {

                $element.one(transition.end, complete);

            } else {

                complete();

            }
        }
    };

    /* Plugin definition */
    $.fn.autoSize = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("autosize"),
                opts = typeof options === "object" ? options : null;

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("autosize", (data = new AutoSize(this, opts)));
            }

            // Run the appropriate function is a string is passed.
            if (typeof options === "string") {
                data[options]();
            }

        });
    };

    // Define the defaults. 
    $.fn.autoSize.defaults = {
        removeAttributes: null,
        removeClasses: null
    };

    // Set the public constructor.
    $.fn.autoSize.Constructor = AutoSize;

    // Autosize data API initialisation.
    $(document).on("ready.autosize.responsive", function () {

        $("textarea[data-autosize]").each(function () {

            var $this = $(this),
                data = $this.data("autosizeOptions"),
                options = data || $.buildDataOptions($this, {}, "autosize");

            // Run the autosize method.
            $this.autoSize(options);

            // Add further events.
            $(document.body).on("keyup.autosize.responsive paste.autosize.responsive cut.autosize.responsive", "textarea[data-autosize]", function (event) {

                var $this = $(this),
                    delay = 0;

                if (event.type === "paste" || event.type === "cut") {
                    delay = 5;
                }

                window.setTimeout(function () {

                    // Run the autosize method.
                    $this.autoSize("size");

                }, delay);
            });
        });

    });

    $(window).on("resize.autosize.responsive", function () {

        if (resisizeTimer) {
            window.clearTimeout(resisizeTimer);
        }

        var resize = function () {

            $("textarea[data-autosize]").each(function () {

                var $this = $(this),
                    autosize = $this.data("autosize");

                if (autosize) {
                    autosize.size();
                }

            });

        };

        resisizeTimer = window.setTimeout(resize, 50);
    });

}(jQuery));
/*
* Responsive Carousel v1.0.0
*/

/*global jQuery*/
/*jshint expr:true*/
(function ($) {

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
                    options = $this.data("carouselSlide"),
                    $target = $(event.delegateTarget),
                    $trigger = $this.parent("li");

                if (options) {

                    // Flag that the carousel slider has been triggered.
                    $target.find("[data-carousel-slide]").parent("li").not($trigger).removeClass("on");

                    $trigger.addClass("on");

                    // Run the carousel method.
                    $target.carousel(options);
                }

            });

            if (this.options.slide) {

                // Handle a slide instruction.
                this.slide(this.options.slide);
            }

            if (this.options.pause === "hover") {
                // Bind the mouse enter/leave events
                this.$element.on("mouseenter", $.proxy(this.pause, this))
                             .on("mouseleave", $.proxy(this.cycle, this));
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
                (this.interval = window.setInterval($.proxy(this.next, this), this.options.interval));
            }

            // Return the carousel for chaining.
            return this;
        },
        goto: function (position) {

            var $activeItem = this.$element.find(".carousel-active"),
                $children = $activeItem.parent().children(),
                activePosition = $children.index($activeItem),
                self = this;

            // Since the index is zero based we need to subtract one.
            position = position -= 1;

            if (position > ($children.length) || position < 0) {

                return;
            }

            if (this.sliding) {

                // Fire the slid event.
                return this.$element.one("slid.carousel.responsive", function () {
                    // Reset the position.
                    self.goto(position + 1);

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

            // Clear the interval and return the carousel for chaining.
            window.clearInterval(this.interval);
            this.interval = null;

            return this;

        },
        next: function () {

            if (this.sliding) {
                return;
            }

            return this.slide("next");
        },
        prev: function () {

            if (this.sliding) {
                return;
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

            // Mark as sliding.
            this.sliding = true;

            if (isCycling) {
                // Pause if cycling.
                this.pause();
            }

            // Work out which item to slide to.
            $nextItem = $nextItem.length ? $nextItem : this.$element.find(".carousel-item")[fallback]();

            if ($nextItem.hasClass("carousel-active")) {
                return;
            }

            if (supportTransition && (slideMode || fadeMode)) {

                // Trigger the slide event.
                this.$element.trigger(slideEvent);

                if (slideEvent.isDefaultPrevented()) {
                    return;
                }

                // Good to go? Then let's slide.
                $nextItem.addClass(type);
                $nextItem[0].offsetWidth; // Force reflow.

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
                    return;
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
                data.goto(options);

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

    $(window).on("load.carousel.responsive", function () {

        $(".carousel").each(function () {

            var $this = $(this),
                data = $this.data("carouselOptions"),
                options = data || $.buildDataOptions($this, {}, "carousel");

            $this.carousel(options);

        });

    }).on("focus.carousel.responsive blur.carousel.responsive", function (event) {

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

                var $this = $(this),
                    carousel = $this.data(carousel);

                if (carousel && carousel[action]) {
                    // It has data so perform the given action.
                    carousel[action]();
                }

            });
        }
    });

}(jQuery));/*
* Responsive Dismiss v1.0.0
*/

/*global jQuery*/
/*jshint expr:true*/
(function ($) {

    "use strict";

    var Dismiss = function (element, target) {

        this.$element = $(element);
        this.$target = this.$element.parents(target);

    };

    Dismiss.prototype = {
        constructor: Dismiss,
        close: function () {

            var supportTransition = $.support.transition,
                closeEvent = $.Event("close.dismiss.responsive"),
                closedEvent = $.Event("closed.dismiss.responsive"),
                $target = this.$target,
                self = this,
                complete = function () {

                    self.transitioning = false;
                    $target.addClass("hidden").trigger(closedEvent);

                };

            if (this.transitioning || closeEvent.isDefaultPrevented()) {
                return;
            }

            this.transitioning = true;

            $target.addClass("fade-in fade-out");

            $target[0].offsetWidth; // reflow

            $target.removeClass("fade-in");

            // Do our callback
            supportTransition ? this.$target.one(supportTransition.end, complete)
                              : complete();

        }
    };

    /* Plug-in definition */
    $.fn.dismiss = function (target) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("dismiss");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("dismiss", (data = new Dismiss(this, target + ":first")));
            }

            // Close the element.
            data.close();

        });
    };

    // Set the public constructor.
    $.fn.dismiss.Constructor = Dismiss;

    // Dismiss data api initialisation.
    $(function () {
        $(document.body).on("click.dismiss.responsive", ":attrStart(data-dismiss)", function (event) {

            event.preventDefault();

            var $this = $(this),
                data = $this.data("dismissOptions"),
                options = data || $.buildDataOptions($this, {}, "dismiss"),//  $this.data("dismiss"),
                target = options.target || (options.target = $this.attr("href"));

            // Run the dismiss method.
            if (target) {
                $(this).dismiss(options.target);
            }

        });
    });

}(jQuery));/*
* Responsive Lightbox v1.0.0
*/

/*global jQuery*/
/*jshint expr:true*/

(function ($) {

    "use strict";

    var $body = $(document.body),
        $overlay = $("<div/>").addClass("lightbox-overlay hidden fade-out"),
        $lightbox = $("<div/>").addClass("lightbox fade-out lightbox-loader").appendTo($overlay),
        $next = $("<a/>").attr("href", "#")
                         .text(">")
                         .addClass("lightbox-direction right hidden"),
        $previous = $("<a/>").attr("href", "#")
                             .text("<")
                             .addClass("lightbox-direction left hidden"),
        $placeholder = $("<div/>").addClass("lightbox-placeholder"),
        supportTransition = $.support.transition,
        keys = {
            ESCAPE: 27,
            LEFT: 37,
            RIGHT: 39
        },
        rexternalHost = new RegExp("//" + document.location.host + "($|/)"),
        // Taken from Fancybox
        rimage = /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/,
        // Taken from jQuery.
        rhash = /^#.*$/, // Altered to only match beginning.
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        eclick = "click.lightbox.responsive",
        ekeyup = "keyup.lightbox.responsive",
        eshow = "show.lightbox.responsive",
        eshown = "shown.lightbox.responsive",
        ehide = "hide.lightbox.responsive",
        ehidden = "hidden.lightbox.responsive";

    // Private methods.
    var isExternalUrl = function (url) {
        // Split the url into it's various parts.
        var locationParts = rurl.exec(url);

        // Target is a local protocol.
        if (locationParts === null || rlocalProtocol.test(locationParts[1])) {
            return false;
        }

        // If the regex doesn't match return true . 
        return !rexternalHost.test(locationParts[2]);
    };

    var manageKeyboardEvents = function () {
        // Context is passed from the lightbox.
        if (this.options.keyboard) {

            $body.off(ekeyup).on(ekeyup, $.proxy(function (event) {

                // Bind the escape key.
                if (event.which === keys.ESCAPE) {
                    this.hide();
                }

                // Bind the next/previous keys.
                if (this.options.group) {
                    // Bind the left arrow key.
                    if (event.which === keys.LEFT) {
                        this.previous();
                    }

                    // Bind the right arrow key.
                    if (event.which === keys.RIGHT) {
                        this.next();
                    }
                }

            }, this));
        }
    };

    var create = function () {

        // Calculate whether this is an external request
        // and set the value.
        this.options.external = !rhash.test(this.options.target);

        // Context is passed from the lightbox.
        var title = this.options.title,
            description = this.options.description,
            close = this.options.close,
            target = this.options.target,
            local = !this.options.external,
            group = this.options.group,
            iframeScroll = this.options.iframeScroll,
            iframe = this.options.iframe || !local ? isExternalUrl(target) : false,
            $iframeWrap = $("<div/>").addClass(iframeScroll ? "lightbox-iframe-scroll" : "lightbox-iframe"),
            $inner = $("<div/>").addClass("lightbox-inner"),
            $content = $("<div/>").addClass("lightbox-content"),
            $iframe,
            $img,
            $header,
            $close,
            $footer,
            fadeIn = function () {
                $lightbox.removeClass("lightbox-loader")
                         .addClass("fade-in")[0].offsetWidth; // force reflow
            };

        // 1: Build the header
        if (title || close) {
            $header = $("<div/>").addClass("lightbox-header")
                                 .html(title ? "<h1>" + title + "</h1>" : "");

            if (close) {
                $close = $("<a/>").attr("href", "#")
                                  .addClass("close")
                                  .html("x")
                                  .prependTo($header);
            }

            $header.appendTo($inner);
        }

        // 2: Build the content
        if (local) {

            $placeholder.detach().insertAfter(this.$element);
            $(target).detach().appendTo($content).removeClass("hidden");
            fadeIn();
        }
        else {
            if (iframe) {
                // Have to add inline styles for older browsers.
                $iframe = $("<iframe/>")
                                   .attr({
                                       "scrolling": iframeScroll ? "yes" : "no",
                                       "allowTransparency": true,
                                       "frameborder": 0,
                                       "hspace": 0,
                                       "vspace": 0,
                                       "webkitallowfullscreen": "",
                                       "mozallowfullscreen": "",
                                       "allowfullscreen": "",
                                       "src": target
                                   })
                                  .appendTo($iframeWrap);

                $iframeWrap.appendTo($content);

                // Not on load as can take forever.
                fadeIn();

            } else {

                if (rimage.test(target)) {
                    $img = $("<img/>").one("load", function () {
                        fadeIn();
                    })
                    .attr("src", target)
                    .appendTo($content);
                }
                else {
                    // Standard ajax load.
                    $content.load(target, function () {
                        fadeIn();
                    });
                }

            }
        }

        $content.appendTo($inner);

        // 3: Build the footer
        if (description) {

            // Add footer text if necessary
            $footer = $("<div/>").addClass("lightbox-footer")
                                 .html(description ? description : "")
                                 .appendTo($inner);
        }

        // Add the built up content to the lightbox.
        $inner.appendTo($lightbox);

        if (group) {
            // Need to show next/previous.
            $next.prependTo($lightbox).removeClass("hidden");
            $previous.prependTo($lightbox).removeClass("hidden");
        }

        $lightbox.off(eclick).on(eclick, $.proxy(function (event) {

            event.preventDefault();
            event.stopPropagation();

            var next = $next[0],
                previous = $previous[0],
                close = $close[0],
                target = event.target;

            if (target === next || target === previous) {

                this[target === next ? "next" : "previous"]();
            }

            if (target === close) {

                this.hide();
            }

        }, this));
    };

    var destroy = function () {
        // Context is passed from the lightbox.
        $lightbox.removeClass("fade-in")[0].offsetWidth; // force reflow
        $lightbox.addClass("lightbox-loader");
    };

    var createOverlay = function () {

        $overlay.addClass("fade-in")[0].offsetWidth; // force reflow

        // Bind the click events
        $overlay.off(eclick).on(eclick, $.proxy(function () {

            this.hide();

        }, this));
    };

    var destroyOverlay = function () {

        // Context is passed from the LightBox.
        $overlay.removeClass("fade-in")[0].offsetWidth; // force reflow
    };

    var cleanUp = function () {
        // Context is passed from the LightBox.

        if (!this.options.external) {
            // Put that kid back where it came from or so help me.
            $(this.options.target).addClass("hidden").detach().insertAfter($placeholder);
            $placeholder.detach().insertAfter($overlay);
        }

        // Clean up the lightbox.
        $next.detach();
        $previous.detach();
        $lightbox.empty();

        // Unbind the keyboard actions.
        if (this.options.keyboard) {
            manageKeyboardEvents.call(this);
        }

        this.isShown = false;
    };

    // The LightBox object that contains our methods.
    var LightBox = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.lightbox.defaults, options);
        this.title = this.options.title || (this.options.title = this.$element.attr("title"));
        this.isShown = null;
        this.$group = null;
        this.$sibling = null;

        // Add the overlay to the body if not done already.
        if (!$("div.lightbox-overlay").length) {
            $body.append($overlay);
        }

        // Add the placeholder to the body if not done already.
        if (!$("div.lightbox-placeholder").length) {
            $body.append($overlay);
        }

        // Make a list of grouped lightbox targets.
        if (this.options.group) {
            this.$group = $("[data-lightbox-group=" + this.options.group + "]");
        }

        // Show the lightbox.
        this.toggle();
    };

    LightBox.prototype = {
        constructor: LightBox,
        show: function () {

            if (this.isShown) {
                return;
            }

            var showEvent = $.Event(eshow),
                shownEvent = $.Event(eshown),
                callback = function () {

                    // Bind the keyboard actions.
                    if (this.options.keyboard) {
                        manageKeyboardEvents.call(this);
                    }

                    this.isShown = true;
                    this.$element.trigger(shownEvent);
                },
            proxy = $.proxy(callback, this);

            this.$element.trigger(showEvent);

            // Fade in the overlay.
            $overlay.removeClass("hidden");
            createOverlay.call(this);

            // Create the lightbox.
            create.call(this);

            // Call the callback.
            supportTransition ? $lightbox.one(supportTransition.end, proxy)
                              : proxy();

        },
        hide: function () {

            if (!this.isShown) {
                return;
            }
            var hideEvent = $.Event(ehide),
                hiddenEvent = $.Event(ehidden),
                callback = function () {

                    $overlay.addClass("hidden");

                    // Clean up.
                    cleanUp.call(this);
                    this.$element.trigger(hiddenEvent);
                },
            proxy = $.proxy(callback, this);


            this.$element.trigger(hideEvent);

            // Fade out the overlay.
            destroyOverlay.call(this);

            // Destroy the lightbox.
            destroy.call(this);

            // Call the callback.
            supportTransition ? $overlay.one(supportTransition.end, proxy)
                              : proxy();

        },
        next: function () {

            if (!this.isShown) {
                return;
            }

            if (this.options.group) {
                var index = this.$group.index(this.$element),
                    length = this.$group.length,
                    position = index + 1,
                    callback = function () {

                        // Clean up.
                        cleanUp.call(this);

                        if (this.$sibling) {
                            this.$sibling.trigger(eclick);
                        }

                    },
                    proxy = $.proxy(callback, this);

                if (position >= length || position < 0) {

                    position = 0;
                }

                this.$sibling = $(this.$group[position]);

                destroy.call(this);

                // Call the callback.
                supportTransition ? $lightbox.one(supportTransition.end, proxy)
                                  : proxy();

            }
        },
        previous: function () {

            if (!this.isShown) {
                return;
            }

            if (this.options.group) {
                var index = this.$group.index(this.$element),
                    length = this.$group.length,
                    position = index - 1,
                    callback = function () {

                        // Clean up.
                        cleanUp.call(this);

                        if (this.$sibling) {
                            this.$sibling.trigger(eclick);
                        }

                    },
                    proxy = $.proxy(callback, this);

                if (position >= length) {

                    position = 0;
                }

                if (position < 0) {
                    position = length - 1;
                }

                this.$sibling = $(this.$group[position]);
                destroy.call(this);

                // Call the callback.
                supportTransition ? $lightbox.one(supportTransition.end, proxy)
                                  : proxy();
            }

        },
        toggle: function () {
            return this[!this.isShown ? "show" : "hide"]();
        }
    };

    /* Plugin definition */
    $.fn.lightbox = function (options) {

        return this.each(function () {
            var $this = $(this),
                data = $this.data("lightbox"),
                opts = typeof options === "object" ? options : {};

            if (!opts.target) {
                opts.target = $this.attr("href");
            }

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("lightbox", (data = new LightBox(this, opts)));
            }

            // Run the appropriate function if a string is passed.
            if (typeof options === "string") {
                data[options]();
            }

        });
    };

    // Define the defaults
    $.fn.lightbox.defaults = {
        close: true,
        external: false,
        group: null,
        iframe: false,
        iframeScroll: true,
        keyboard: true
    };

    // Bind the lightbox trigger.
    $body.on(eclick, ":attrStart(data-lightbox)", function (event) {

        event.preventDefault();

        var $this = $(this),
            data = $this.data("lightboxOptions"),
            options = data || $.buildDataOptions($this, {}, "lightbox"),
            params = $this.data("lightbox") ? "toggle" : options;

        // Run the lightbox method.
        $this.lightbox(params);

    });
}(jQuery));/*
* Responsive tabs v1.0.0
*/

/*global jQuery*/
/*jshint expr:true*/
(function ($) {

    "use strict";

    // General variables.
    var supportTransition = $.support.transition,

        tab = function (activePosition, postion, callback) {

            var showEvent = $.Event("show.tabs.responsive"),
                $element = this.$element,
                $childTabs = $element.find("ul.tabs li"),
                $childPanes = $element.children("div"),
                $nextTab = $childTabs.eq(postion),
                $currentPane = $childPanes.eq(activePosition),
                $nextPane = $childPanes.eq(postion);

            this.tabbing = true;

            $element.trigger(showEvent);

            $childTabs.removeClass("tab-active");
            $nextTab.addClass("tab-active");

            // Do some class shuffling to allow the transition.
            $currentPane.addClass("fade-out fade-in");
            $nextPane.addClass("tab-pane-active fade-out");
            $childPanes.filter(".fade-in").removeClass("tab-pane-active fade-in");

            // Force reflow.
            $nextPane[0].offsetWidth;

            $nextPane.addClass("fade-in");

            // Do the callback
            callback.call(this);

        },

    // The Tabs object that contains our methods.
        Tabs = function (element) {

            this.$element = $(element);
        };

    Tabs.prototype = {
        constructor: Tabs,
        show: function (position) {

            var $activeItem = this.$element.find(".tab-active"),
                $children = $activeItem.parent().children(),
                activePosition = $children.index($activeItem),
                self = this;

            if (position > ($children.length - 1) || position < 0) {

                return;
            }

            if (this.tabbing) {

                // Fire the tabbed event.
                return this.$element.one("shown.tabs.responsive", function () {
                    // Reset the position.
                    self.show(position + 1);

                });
            }

            if (activePosition === position) {
                return;
            }

            // Call the function with the callback
            return tab.call(this, activePosition, position, function () {

                var shownEvent = $.Event("shown.tabs.responsive"),
                    self = this,
                    complete = function () {

                        self.tabbing = false;
                        self.$element.trigger(shownEvent);

                    };

                // Do our callback
                if (supportTransition) {
                    this.$element.one(supportTransition.end, complete);
                } else { complete(); }

            });

        }
    };

    /* Plug-in definition */
    $.fn.tabs = function (options) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data("tabs");

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("tabs", (data = new Tabs(this)));
            }

            // Show the given number.
            if (typeof options === "number") {
                data.show(options);
            }

        });

    };

    // Set the public constructor.
    $.fn.tabs.Constructor = Tabs;

    $(document).on("ready.tabs.responsive", function () {

        $("[data-tabs]").tabs().on("click.tabs.responsive", "ul.tabs > li > a", function (event) {

            event.preventDefault();

            var $this = $(this),
                $li = $this.parent(),
                index = $li.index();

            $(event.delegateTarget).tabs(index);

        });

    });

}(jQuery));