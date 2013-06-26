/*
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
}(jQuery));