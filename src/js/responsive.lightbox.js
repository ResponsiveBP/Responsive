/*
 * Responsive Lightbox
 */

/*global jQuery*/
/*jshint expr:true*/

(function ($, w, ns) {

    "use strict";

    if (w.RESPONSIVE_LIGHTBOX) {
        return;
    }

    // General variables.
    var $window = $(w),
        $html = $("html"),
        $body = $("body"),
        $overlay = $("<div/>").addClass("lightbox-overlay lightbox-loader fade-out"),
        $lightbox = $("<div/>").addClass("lightbox fade-out").appendTo($overlay),
        $header = $("<div/>").addClass("lightbox-header fade-out"),
        $footer = $("<div/>").addClass("lightbox-footer fade-out"),
        $img = null,
        $iframe = null,
        $content = null,
        $close = $("<a/>").attr({ "href": "#", "title": "Close (Esc)" }).addClass("lightbox-close fade-out").html("x"),
        $next = $("<a/>").attr({ "href": "#", "title": "Next (Right Arrow)" }).addClass("lightbox-direction right hidden"),
        $previous = $("<a/>").attr({ "href": "#", "title": "Previous (Left Arrow)" }).addClass("lightbox-direction left hidden"),
        $placeholder = $("<div/>").addClass("lightbox-placeholder"),
        lastScroll = 0,
        supportTransition = $.support.transition,
        keys = {
            ESCAPE: 27,
            LEFT: 37,
            RIGHT: 39
        },
        protocol = w.location.protocol.indexOf("http") === 0 ? w.location.protocol : "http:",
        // Regular expression.
        rexternalHost = new RegExp("//" + w.location.host + "($|/)"),
        rimage = /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|ti(f|ff)|webp|svg)((\?|#).*)?$)/,
        // Taken from jQuery.
        rhash = /^#.*$/, // Altered to only match beginning.
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rembedProvider = /vimeo|vine|instagram|instagr\.am/i,
        // Events
        eclick = "click" + ns,
        ekeyup = "keyup" + ns,
        eshow = "show" + ns,
        eshown = "shown" + ns,
        ehide = "hide" + ns,
        ehidden = "hidden" + ns,
        eresize = "resize" + ns + " orientationchange" + ns;

    // Private methods.
    var isExternalUrl = function (url) {
        // Handle different host types.
        // Split the url into it's various parts.
        var locationParts = rurl.exec(url) || rurl.exec(protocol + url);

        if (locationParts === undefined || rhash.test(url)) {
            return false;
        }

        // Target is a local protocol.
        if (locationParts === null || locationParts[2] === undefined || rlocalProtocol.test(locationParts[1])) {
            return false;
        }

        // If the regex doesn't match return true . 
        return !rexternalHost.test(locationParts[2]);
    },

    create = function () {

        // Calculate whether this is an external request and set the value.
        this.options.external = !rhash.test(this.options.target);

        var self = this,
            title = this.options.title,
            description = this.options.description,
            close = this.options.close,
            target = this.options.target,
            local = !this.options.external && !isExternalUrl(target),
            group = this.options.group,
            nextText = this.options.next,
            previousText = this.options.previous,
            iframeScroll = this.options.iframeScroll,
            iframe = this.options.iframe || !local ? isExternalUrl(target) && !rimage.test(target) : false,
            $iframeWrap = $("<div/>").addClass(iframeScroll ? "media media-scroll" : "media");

        $content = $("<div/>").addClass("lightbox-content");
        $iframe = $("<iframe/>"); // This needs to be assigned then unassigned or ie8 won't test against it.
        $img = $("<img/>"); // ditto.

        // 1: Build the header
        if (title || close) {

            $header.html(title ? "<div class=\"container\"><h2>" + title + "</h2></div>" : "")
                   .appendTo($overlay);

            if (close) {
                $close.appendTo($overlay);
            }
        }

        // 2: Build the footer
        if (description) {

            // Add footer text if necessary
            $footer.html("<div class=\"container\">" + description + "</div>")
                   .appendTo($overlay);
        }

        // 3: Build the content
        if (local) {

            $placeholder.detach().insertAfter(this.$element);
            $(target).detach().appendTo($content).removeClass("hidden");
            $content.appendTo($lightbox);
            toggleFade.call(this);
        } else {
            if (iframe) {

                $img = null;
                $content = null;
                $lightbox.addClass("lightbox-iframe");

                // Normalize the src.
                var src = target.indexOf("http") !== 0 ? protocol + target : target;

                // Have to add inline styles for older browsers.
                $iframe.attr({
                    "scrolling": iframeScroll ? "yes" : "no",
                    "allowTransparency": true,
                    "frameborder": 0,
                    "hspace": 0,
                    "vspace": 0,
                    "webkitallowfullscreen": "",
                    "mozallowfullscreen": "",
                    "allowfullscreen": "",
                    "src": src
                })
                    .appendTo($iframeWrap);

                // Test and add additional media classes.
                var mediaClasses = rembedProvider.test(target) ? target.match(rembedProvider)[0].toLowerCase() : "";

                $iframeWrap.addClass(mediaClasses).appendTo($lightbox);

                // Not on load as can take forever.
                toggleFade.call(this);

            } else {

                if (rimage.test(target)) {

                    $iframe = null;
                    $content = null;
                    $lightbox.addClass("lightbox-image");

                    $img.one("load", function () {
                        toggleFade.call(self);
                    }).attr("src", target)
                        .appendTo($lightbox);
                } else {

                    $img = null;
                    $iframe = null;
                    $lightbox.addClass("lightbox-ajax");

                    // Standard ajax load.
                    $content.load(target, function () {
                        $content.appendTo($lightbox);
                        toggleFade.call(self);
                    });
                }
            }
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

    },

    destroy = function () {
        if (!this.options.external) {
            // Put that kid back where it came from or so help me.
            $(this.options.target).addClass("hidden").detach().insertAfter($placeholder);
            $placeholder.detach().insertAfter($overlay);
        }

        toggleFade.call(this);

        // Clean up the header/footer.
        $header.empty().detach();
        $footer.empty().detach();
        $close.detach();

        // Clean up the lightbox.
        $next.detach();
        $previous.detach();

        var self = this,
            empty = function () {
                $lightbox.removeClass("lightbox-iframe lightbox-ajax lightbox-image").css({
                    "max-height": "",
                    "max-width": "",
                    "margin-top": "",
                    "margin-bottom": ""
                }).empty();

                // Unbind the keyboard actions.
                if (self.options.keyboard) {

                    manageKeyboard.call(self, "hide");
                }
            };

        // Fix __flash__removeCallback' is undefined error.
        $.when($lightbox.find("iframe").attr("src", "")).then(w.setTimeout(empty, 100));
    },

    resize = function () {
        // Bind the resize event and fade in.
        var newWindowHeight,
            oldWindowHeight,
            maxWidth = parseInt($lightbox.css("max-width"), 10),
            onResize = function () {

                var headerHeight,
                    footerHeight,
                    childHeight,
                    $child = $iframe || $img || $content;

                if ($child) {

                    newWindowHeight = $window.height();

                    if (newWindowHeight !== oldWindowHeight) {

                        headerHeight = $header[0] ? $header[0].clientHeight : 0;
                        footerHeight = $footer[0] ? $footer[0].clientHeight : 0;

                        childHeight = newWindowHeight - (headerHeight + footerHeight);

                        if ($img) {

                            $img.css("max-height", childHeight);

                        }
                        else if ($content) {
                            $lightbox.css("max-height", childHeight);
                            $content.css("max-height", childHeight);
                        }
                        else {

                            var clientWidth = $iframe[0].clientWidth,
                                clientHeight = $iframe[0].clientHeight,
                                ratio = clientWidth / clientHeight,
                                childWidth = childHeight * ratio;

                            $.each([$lightbox, $iframe], function () {

                                this.css({
                                    "max-height": childHeight,
                                    "max-width": childWidth > maxWidth ? maxWidth : childWidth
                                });
                            });
                        }

                        $lightbox.css({
                            "margin-top": headerHeight > 0 ? headerHeight : "",
                            "margin-bottom": footerHeight > 0 ? footerHeight : ""
                        });

                        oldWindowHeight = newWindowHeight;
                    }
                }
            };

        $window.off(eresize).on(eresize, onResize);

        onResize();
    },

    toggleFade = function () {

        // Resize the lightbox content.
        if (this.isShown) {
            resize();
        }

        $.each([$header, $footer, $close, $lightbox], function () {

            this.toggleClass("fade-in")
                .redraw();
        });

        $overlay.toggleClass("lightbox-loader");
    },

    toggleOverlay = function (event) {

        var fade = event === "show" ? "addClass" : "removeClass",
            self = this,
            complete = function () {

                if (event === "hide") {
                    $overlay.addClass("hidden");
                    $html.removeClass("lightbox-on");

                    if (lastScroll !== $window.scrollTop) {
                        $window.scrollTop(lastScroll);
                        lastScroll = 0;
                    }

                    return;
                }

                $overlay.off(eclick).on(eclick, function (e) {

                    var closeTarget = $close[0],
                        eventTarget = e.target;

                    if (eventTarget === closeTarget) {
                        e.preventDefault();
                        e.stopPropagation();
                        self.hide();
                    }

                    if (eventTarget === $overlay[0]) {
                        self.hide();
                    }
                });
            };

        // Add the overlay to the body if not done already.
        if (!$("div.lightbox-overlay").length) {

            $body.append($overlay);
        }

        if (lastScroll === 0) {
            lastScroll = $window.scrollTop();
        }
        $html.addClass("lightbox-on");

        $overlay.removeClass("hidden")
            .redraw()[fade]("fade-in")
            .redraw();

        supportTransition ? $overlay.one(supportTransition.end, complete)
              : complete();

    },

    direction = function (course) {

        if (!this.isShown) {
            return;
        }

        if (this.options.group) {
            var self = this,
                index = this.$group.index(this.$element),
                length = this.$group.length,
                position = course === "next" ? index + 1 : index - 1,
                complete = function () {

                    self.isShown = false;
                    if (self.$sibling) {

                        if (supportTransition) {
                            self.$sibling.trigger(eclick);
                        } else {
                            w.setTimeout(function () {
                                self.$sibling.trigger(eclick);
                            }, 300);
                        }
                    }
                };

            if (course === "next") {

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

            supportTransition ? $lightbox.one(supportTransition.end, complete)
                : complete();
        }
    },

    manageKeyboard = function (event) {
        if (this.options.keyboard) {

            if (event === "hide") {
                $body.off(ekeyup);
                return;
            }

            $body.off(ekeyup).on(ekeyup, $.proxy(function (e) {

                // Bind the escape key.
                if (e.which === keys.ESCAPE) {
                    this.hide();
                }

                // Bind the next/previous keys.
                if (this.options.group) {
                    // Bind the left arrow key.
                    if (e.which === keys.LEFT) {
                        this.previous();
                    }

                    // Bind the right arrow key.
                    if (e.which === keys.RIGHT) {
                        this.next();
                    }
                }
            }, this));
        }
    },

    manageTouch = function () {

        $lightbox.swipe("r.lightbox").on("swipeend.r.lightbox", $.proxy(function (event) {

            var eventDirection = event.direction,
                method = (eventDirection === "up" || eventDirection === "right") ? "next" : "previous";

            this[method]();

        }, this));
    };

    // Lightbox class definition
    var LightBox = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            close: true,
            external: false,
            group: null,
            iframe: false,
            iframeScroll: false,
            keyboard: true,
            next: ">",
            previous: "<",
            mobileTarget: null,
            mobileViewportWidth: 480,
            enabletouch: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.title = null;
        this.description = null;
        this.isShown = null;
        this.$group = null;

        // Make a list of grouped lightbox targets.
        if (this.options.group) {
            this.$group = $("[data-lightbox-group=" + this.options.group + "]");
        }

        this.toggle();
    };

    LightBox.prototype.show = function () {

        if (this.isShown) {
            return;
        }

        // If the trigger has a mobile target and the viewport is smaller than the mobile limit
        // then redirect to that page instead.
        if (this.options.mobileTarget && this.options.mobileViewportWidth >= $window.width()) {
            w.location.href = this.options.mobileTarget;
        }

        if (this.options.enabletouch) {
            // Enable extended touch events on ie.
            $lightbox.css({ "-ms-touch-action": "none", "touch-action": "none" });
            manageTouch.call(this);
        } else {
            // Disable extended touch events on ie.
            $lightbox.css({ "-ms-touch-action": "", "touch-action": "" });
        }

        var self = this,
            showEvent = $.Event(eshow),
            shownEvent = $.Event(eshown),
            complete = function () {

                // Bind the keyboard actions.
                if (self.options.keyboard) {
                    manageKeyboard.call(self, "show");
                }

                self.$element.trigger(shownEvent);
            };

        this.$element.trigger(showEvent);

        if (showEvent.isDefaultPrevented()) {
            return;
        }

        this.isShown = true;

        toggleOverlay.call(this, "show");
        create.call(this);

        // Call the callback.
        supportTransition ? $lightbox.one(supportTransition.end, complete)
                          : complete();
    };

    LightBox.prototype.hide = function () {

        if (!this.isShown) {
            return;
        }

        var self = this,
            hideEvent = $.Event(ehide),
            hiddenEvent = $.Event(ehidden),
            complete = function () {

                self.$element.trigger(hiddenEvent);
            };


        this.$element.trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
            return;
        }

        this.isShown = false;

        toggleOverlay.call(this, "hide");
        destroy.call(this);

        supportTransition ? $lightbox.one(supportTransition.end, complete)
                          : complete();
    };

    LightBox.prototype.next = function () {
        direction.call(this, "next");
    };

    LightBox.prototype.previous = function () {
        direction.call(this, "previous");
    };

    LightBox.prototype.toggle = function () {
        return this[!this.isShown ? "show" : "hide"]();
    };

    // Plug-in definition 
    var old = $.fn.lightbox;

    $.fn.lightbox = function (options) {

        return this.each(function () {
            var $this = $(this),
                data = $this.data("r.lightbox"),
                opts = typeof options === "object" ? options : {};

            if (!opts.target) {
                opts.target = $this.attr("href");
            }

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.lightbox", (data = new LightBox(this, opts)));
            }

            // Run the appropriate function if a string is passed.
            if (typeof options === "string") {
                data[options]();
            }

        });
    };

    // No conflict.
    $.fn.lightbox.noConflict = function () {
        $.fn.lightbox = old;
        return this;
    };

    // Data API
    $body.on(eclick, ":attrStart(data-lightbox)", function (event) {

        event.preventDefault();

        var $this = $(this),
            data = $this.data("r.lightboxOptions"),
            options = data || $.buildDataOptions($this, {}, "lightbox", "r"),
            params = $this.data("r.lightbox") ? "toggle" : options;

        // Run the lightbox method.
        $this.lightbox(params);
    });

    w.RESPONSIVE_LIGHTBOX = true;

}(jQuery, window, ".r.lightbox"));