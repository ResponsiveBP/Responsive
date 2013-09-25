/*
 * Responsive Lightbox
 */

/*global jQuery*/
/*jshint expr:true*/

(function ($, w, ns) {

    "use strict";

    // Prevents ajax requests from reloading everything and
    // rebinding events.
    if (w.RESPONSIVELIGHTBOXLOADED) {
        return;
    }

    var $body = $(document.body),
        $window = $(w),
        $overlay = $("<div/>").addClass("lightbox-overlay hidden fade-out"),
        $lightbox = $("<div/>").addClass("lightbox fade-out lightbox-loader").appendTo($overlay),
        $header = $("<div/>").addClass("lightbox-header fade-out"),
        $footer = $("<div/>").addClass("lightbox-footer fade-out"),
        $close = $("<a/>").attr("href", "#").addClass("lightbox-close fade-out").html("x"),
        $next = $("<a/>").attr("href", "#").addClass("lightbox-direction right hidden"),
        $previous = $("<a/>").attr("href", "#").addClass("lightbox-direction left hidden"),
        $placeholder = $("<div/>").addClass("lightbox-placeholder"),
        supportTransition = $.support.transition,
        keys = {
            ESCAPE: 27,
            LEFT: 37,
            RIGHT: 39
        },
        rexternalHost = new RegExp("//" + document.location.host + "($|/)"),
        rimage = /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|ti(f|ff)|webp|svg)((\?|#).*)?$)/,
        // Taken from jQuery.
        rhash = /^#.*$/, // Altered to only match beginning.
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rembedProvider = /vimeo|vine|instagram|instagr\.am/i,
        eclick = "click." + ns,
        ekeyup = "keyup." + ns,
        eshow = "show." + ns,
        eshown = "shown." + ns,
        ehide = "hide." + ns,
        ehidden = "hidden." + ns,
        eresize = "resize." + ns;

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
            nextText = this.options.next,
            previousText = this.options.previous,
            iframeScroll = this.options.iframeScroll,
            iframe = this.options.iframe || !local ? isExternalUrl(target) && !rimage.test(target) : false,
            $iframeWrap = $("<div/>").addClass(iframeScroll ? "media media-scroll" : "media"),
            $content = $("<div/>").addClass("lightbox-content"),
            $iframe,
            $img,
            fadeIn = function () {
                // Bind the resize event and fade in.
                var newWindowHeight,
                    oldWindowHeight,
                    maxWidth = parseInt($lightbox.css("max-width"), 10);

                $window.off(eresize).on(eresize, function () {
                    var headerHeight,
                        footerHeight,
                        childHeight,
                        $child = $img || $iframe;

                    if ($child) {

                        newWindowHeight = $window.height();

                        if (newWindowHeight !== oldWindowHeight) {
                            headerHeight = $header[0] ? $header[0].clientHeight : 0;
                            footerHeight = $footer[0] ? $footer[0].clientHeight : 0;

                            childHeight = newWindowHeight - (headerHeight + footerHeight);

                            if ($img) {

                                $img.css("max-height", childHeight + "px");
                            } else {

                                var ratio = $iframe[0].clientWidth / $iframe[0].clientHeight,
                                    childWidth = childHeight * ratio;

                                $lightbox.css({
                                    "max-height": childHeight + "px",
                                    "max-width": childWidth > maxWidth ? maxWidth + "px" : childWidth + "px"
                                });

                                $iframe.css({
                                    "max-height": childHeight + "px",
                                    "max-width": childWidth + "px"
                                });
                            }

                            oldWindowHeight = newWindowHeight;
                        }
                    }

                    $header.addClass("fade-in");
                    $footer.addClass("fade-in");
                    $close.addClass("fade-in");
                    $lightbox.removeClass("lightbox-loader")
                             .addClass("fade-in")[0].offsetWidth; // force reflow

                }).triggerHandler(eresize);
            };

        // 1: Build the header
        if (title || close) {
            $header = $("<div/>").addClass("lightbox-header")
                                 .html(title ? "<div class=\"container\"><h2>" + title + "</h2></div>" : "");

            $header.appendTo($overlay);

            if (close) {
                $close.appendTo($overlay);
            }
        }

        // 2: Build the content
        if (local) {

            $placeholder.detach().insertAfter(this.$element);
            $(target).detach().appendTo($content).removeClass("hidden");
            $content.appendTo($lightbox);
            fadeIn();
        }
        else {
            if (iframe) {

                $lightbox.addClass("lightbox-iframe");

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

                // Test and add additional media classes.
                var mediaClasses = rembedProvider.test(target) ? target.match(rembedProvider)[0].toLowerCase() : "";

                $iframeWrap.addClass(mediaClasses).appendTo($lightbox);

                // Not on load as can take forever.
                fadeIn();

            } else {

                if (rimage.test(target)) {

                    $img = $("<img/>").one("load", function () {
                        fadeIn();
                    })
                    .attr("src", target)
                    .appendTo($lightbox);
                }
                else {
                    // Standard ajax load.
                    $content.load(target, function () {
                        $content.appendTo($lightbox);
                        fadeIn();
                    });
                }

            }
        }

        // 3: Build the footer
        if (description) {

            // Add footer text if necessary
            $footer = $("<div/>").addClass("lightbox-footer")
                                 .html(description ? "<div class=\"container\">" + description + "</div>" : "")
                                 .appendTo($overlay);
        }

        if (group) {
            // Need to show next/previous.
            $next.text(nextText).prependTo($lightbox).removeClass("hidden");
            $previous.text(previousText).prependTo($lightbox).removeClass("hidden");
        }

        // Bind the click events.
        $lightbox.off(eclick).on(eclick, $.proxy(function (event) {

            var next = $next[0],
                previous = $previous[0],
                eventTarget = event.target;

            if (eventTarget === next || eventTarget === previous) {
                event.preventDefault();
                event.stopPropagation();
                this[eventTarget === next ? "next" : "previous"]();
            }

        }, this));
    };

    var destroy = function () {
        // Context is passed from the lightbox.
        // Clean up the header/footer.
        $header.removeClass("fade-in");
        $footer.removeClass("fade-in");
        $close.removeClass("fade-in");
        $lightbox.removeClass("fade-in")[0].offsetWidth; // force reflow
        $lightbox.removeClass(".lightbox-iframe").addClass("lightbox-loader");
    };

    var createOverlay = function () {

        $overlay.addClass("fade-in")[0].offsetWidth; // force reflow

        // Bind the click events
        $overlay.off(eclick).on(eclick, $.proxy(function (event) {

            var closeTarget = $close[0],
                eventTarget = event.target;

            if (eventTarget === closeTarget) {
                event.preventDefault();
                event.stopPropagation();
                this.hide();
            }

            if (eventTarget === $overlay[0]) {
                this.hide();
            }

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

        // Clean up the header/footer.
        $header.removeClass("fade-in").empty().detach();
        $footer.removeClass("fade-in").empty().detach();
        $close.removeClass("fade-in").detach();

        // Clean up the lightbox.
        $next.detach();
        $previous.detach();

        var self = this,
            empty = function () {
                $lightbox.removeClass("lightbox-iframe").css({
                    "max-height": "",
                    "max-width": ""
                }).empty();

                // Unbind the keyboard actions.
                if (self.options.keyboard) {
                    manageKeyboardEvents.call(self);
                }

                self.isShown = false;

            };

        $.when($lightbox.find("iframe").attr("src", "")).then(function () {
            // Fix __flash__removeCallback' is undefined error.
            w.setTimeout(empty, 100);

        });
    };

    var changeDirection = function (direction) {
        if (!this.isShown) {
            return;
        }

        if (this.options.group) {
            var index = this.$group.index(this.$element),
                length = this.$group.length,
                position = direction === "next" ? index + 1 : index - 1,
                callback = function () {

                    var self = this,
                        reShow = function () {

                            if (self.$sibling) {
                                self.$sibling.trigger(eclick);
                            }
                        };

                    // Clean up.
                    cleanUp.call(self);
                    w.setTimeout(reShow, 300);

                },
                proxy = $.proxy(callback, this);

            if (direction === "next") {

                if (position >= length || position < 0) {

                    position = 0;
                }
            } else {

                if (position >= length) {

                    position = 0;
                }

                if (position < 0) {
                    position = length - 1;
                }
            }

            this.$sibling = $(this.$group[position]);

            destroy.call(this);

            // Call the callback.
            supportTransition ? $lightbox.one(supportTransition.end, proxy)
                              : proxy();

        }
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
                    $lightbox.removeClass("lightbox-iframe");

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

            changeDirection.call(this, "next");
        },
        previous: function () {

            changeDirection.call(this, "previous");
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
        iframeScroll: false,
        keyboard: true,
        next: ">",
        previous: "<"
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

    w.RESPONSIVELIGHTBOXLOADED = true;

}(jQuery, window, "lightbox.responsive"));