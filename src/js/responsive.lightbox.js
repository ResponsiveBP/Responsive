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
        $previous = $("<a/>").attr({ "href": "#", "title": "Previous (Left Arrow)" }).addClass("lightbox-direction left hidden"),
        $next = $("<a/>").attr({ "href": "#", "title": "Next (Right Arrow)" }).addClass("lightbox-direction right hidden"),
        $placeholder = $("<div/>").addClass("lightbox-placeholder"),
        scrollbarWidth = 0,
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
        rimage = /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|ti(ff|f)|webp|svg)((\?|#).*)?$)/i,
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
        eresize = "resize" + ns + " orientationchange" + ns,
        efocusin = "focusin" + ns;

    // Private methods.
    var isExternalUrl = function (url) {
        // Handle different host types.
        // Split the url into it's various parts.
        var locationParts = rurl.exec(url) || rurl.exec(protocol + url);

        if (locationParts === undefined || rhash.test(url)) {
            return false;
        }

        // Target is a local protocol.
        if (!locationParts || !locationParts[2] || rlocalProtocol.test(locationParts[1])) {
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
            modal = this.options.modal,
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
        if (title || !modal) {

            $header.html(title ? "<div class=\"container\"><h2>" + title + "</h2></div>" : "")
                   .appendTo($overlay);

            if (!modal) {
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
            $img = null;
            $iframe = null;
            var $target = $(target);
            this.isLocalHidden = $target.is(":hidden");
            $lightbox.addClass(this.options.fitViewport ? "container" : "");
            $placeholder.detach().insertAfter($target);
            $target.detach().appendTo($content).removeClass("hidden");
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

            if ($img) {
                if (eventTarget === $img[0] && this.options.group) {
                    this.next();
                }
            }
        }, this));
    },

    destroy = function (callback) {
        var self = this,
            empty = function () {
                $lightbox.removeClass("lightbox-iframe lightbox-ajax lightbox-image container").css({
                    "max-height": "",
                    "max-width": "",
                    "margin-top": "",
                    "margin-bottom": ""
                }).empty();

                manageFocus("hide");

                // Unbind the keyboard actions.
                if (self.options.keyboard) {

                    manageKeyboard.call(self, "hide");
                }

                callback && callback();

            }, cleanUp = function () {

                if (!self.options.external) {
                    // Put that kid back where it came from or so help me.
                    $(self.options.target).addClass(self.isLocalHidden ? "hidden" : "").detach().insertAfter($placeholder);
                    $placeholder.detach().insertAfter($overlay);
                }

                // Clean up the header/footer.
                $header.empty().detach();
                $footer.empty().detach();
                $close.detach();

                // Clean up the lightbox.
                $next.detach();
                $previous.detach();

                // Fix __flash__removeCallback' is undefined error.
                $.when($lightbox.find("iframe").attr("src", "")).then(w.setTimeout(empty, 100));

                $lightbox.removeData("currentLightbox");
            };

        toggleFade.call(this);

        supportTransition ? $lightbox.one(supportTransition.end, cleanUp)
        .ensureTransitionEnd($lightbox.css("transition-duration").slice(0, -1) * 1000)
        : cleanUp();
    },

    resize = function () {
        // Bind the resize event and fade in.
        var maxWidth = parseInt($lightbox.css("max-width"), 10),
            onResize = function () {

                var windowHeight = $window.height(),
                    headerHeight,
                    footerHeight,
                    closeHeight,
                    childHeight,
                    topHeight,
                    bottomHeight,
                    diff,
                    $child = $iframe || $img || $content;

                if ($child) {

                    // Defaulting to 1px on the footer prevents the address bar from
                    // covering the lightbox on windows phone.
                    headerHeight = $header.height() || 0;
                    footerHeight = $footer.height() || 0;
                    closeHeight = $close.outerHeight() || 0;
                    topHeight = (headerHeight > closeHeight ? headerHeight : closeHeight);
                    bottomHeight = footerHeight > 0 ? footerHeight : 1;
                    diff = topHeight + bottomHeight;
                    childHeight = windowHeight - diff;
                    var ie10Mobile = navigator.userAgent.match(/IEMobile\/10\.0/);

                    if ($img) {
                        // IE8 doesn't change the width as max-width will cause the 
                        // The image width to be set to zero.
                        $img.css({
                            "max-height": childHeight,
                            "max-width": "100%"
                        });
                    }
                    else if ($content) {
                        $lightbox.css("max-height", childHeight);
                        $content.css("max-height", childHeight);

                        // Prevent IEMobile10 scrolling when content overflows the lightbox.
                        // This causes the content to jump behind the model but it's all I can
                        // find for now.
                        if (ie10Mobile) {
                            if ($content.children("*:first")[0].scrollHeight > $content.height()) {
                                $html.addClass("lightbox-lock");
                            }
                        }
                    }
                    else {

                        var iframeWidth = $iframe.width(),
                            iframeHeight = $iframe.height(),
                            ratio = iframeWidth / iframeHeight,
                            childWidth = childHeight * ratio;

                        $.each([$lightbox, $iframe], function () {

                            this.css({
                                "max-height": childHeight,
                                "max-width": childWidth > maxWidth ? maxWidth : childWidth
                            });
                        });
                    }

                    // Adjust the vertically aligned position if necessary to account for
                    // overflow into the footer.
                    var margin = topHeight,
                        top,
                        bottom;

                    $overlay.css({
                        "padding-top": topHeight > 0 ? topHeight : ""
                    });

                    top = parseInt($lightbox.offset().top, 10);

                    // Thaaanks IE8!
                    if (top < 0) {
                        $lightbox.css({ "margin-top": 1 });
                        top = parseInt($lightbox.offset().top, 10);
                    }

                    var fallback = footerHeight > 1 ? -((topHeight + bottomHeight) / 2) : "";

                    bottom = top + $child.height();

                    var getTopMargin = function () {
                        if (bottomHeight > 1 && top > margin && windowHeight - bottom < bottomHeight) {
                            var newMargin = ((top - margin) * -2) + 4;

                            if ((newMargin * -1) + childHeight < windowHeight - bottom) {
                                return newMargin;
                            }
                        }

                        return fallback;
                    };

                    $lightbox.css({
                        "margin-top": getTopMargin()
                    });
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
            getScrollbarWidth = function () {
                var $scroll = $("<div/>").css({ width: 99, height: 99, overflow: "scroll", position: "absolute", top: -9999 });
                $body.append($scroll);
                scrollbarWidth = $scroll[0].offsetWidth - $scroll[0].clientWidth;
                $scroll.remove();

                return scrollbarWidth;
            },
            complete = function () {

                if (event === "hide") {
                    $overlay.addClass("hidden");
                    $html.removeClass("lightbox-on")
                         .css("margin-right", "");

                    if ($html.hasClass("lightbox-lock")) {

                        $html.removeClass("lightbox-lock");
                        if (lastScroll !== $window.scrollTop()) {
                            $window.scrollTop(lastScroll);
                            lastScroll = 0;
                        }
                    }
                    return;
                }

                $overlay.off(eclick).on(eclick, function (e) {

                    if (self.options.modal) {
                        return;
                    }

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

        // Remove the scrollbar.
        $html.addClass("lightbox-on")
             .css("margin-right", getScrollbarWidth());

        $overlay.removeClass("hidden")
            .redraw()[fade]("fade-in")
            .redraw();

        supportTransition ? $overlay.one(supportTransition.end, complete)
        .ensureTransitionEnd($overlay.css("transition-duration").slice(0, -1) * 1000)
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

            destroy.call(this, complete);

            this.isShown = false;
        }
    },

    manageKeyboard = function (event) {
        if (this.options.keyboard) {

            if (event === "hide") {
                $body.off(ekeyup);
                return;
            }

            if (this.options.modal) {
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

    manageTouch = function (off) {

        if (off) {
            $lightbox.removeSwipe("r.lightbox");
            return;
        }

        $lightbox.swipe({ namespace: "r.lightbox" }).on("swipeend.r.lightbox", $.proxy(function (event) {

            var eventDirection = event.direction,
                method = (eventDirection === "up" || eventDirection === "right") ? "next" : "previous";

            this[method]();

        }, this));
    },

    manageFocus = function (off) {

        if (off) {
            $(document).off(efocusin);
            return;
        }

        $(document).off(efocusin).on(efocusin, function (event) {
            if (!$.contains($overlay[0], event.target)) {
                var newTarget = $lightbox.find("input, select, a, button, iframe").first();
                newTarget.length ? newTarget.focus() : $close.focus();
                return false;
            }
            return true;
        });

    };

    // Lightbox class definition
    var LightBox = function (element, options) {

        this.$element = $(element);
        this.defaults = {
            modal: false,
            external: false,
            group: null,
            iframe: false,
            iframeScroll: false,
            keyboard: true,
            next: ">",
            previous: "<",
            mobileTarget: null,
            fitViewport: true,
            mobileViewportWidth: 480,
            enabletouch: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.title = null;
        this.description = null;
        this.isShown = null;
        this.$group = null;
        this.isLocalHidden = false;

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
        if (this.options.mobileTarget && this.options.mobileViewportWidth >= parseInt($window.width(), 10)) {
            w.location.href = this.options.mobileTarget;
            return;
        }

        var self = this,
            showEvent = $.Event(eshow),
            shownEvent = $.Event(eshown),
            complete = function () {

                manageFocus();

                // Bind the keyboard actions.
                if (self.options.keyboard) {
                    manageKeyboard.call(self, "show");
                }

                if (self.options.group) {
                    if (self.options.enabletouch) {
                        manageTouch.call(self);
                    } else {
                        manageTouch.call(self, "off");
                    }
                }

                self.$element.trigger(shownEvent);
            };

        this.$element.trigger(showEvent);

        if (showEvent.isDefaultPrevented()) {
            return;
        }

        this.isShown = true;
        $lightbox.data("currentLightbox", this.$element);

        toggleOverlay.call(this, "show");
        create.call(this);

        // Call the callback.
        supportTransition ? $lightbox.one(supportTransition.end, complete)
        .ensureTransitionEnd($lightbox.css("transition-duration").slice(0, -1) * 1000)
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
        .ensureTransitionEnd($lightbox.css("transition-duration").slice(0, -1) * 1000)
                          : complete();
    };

    LightBox.prototype.next = function () {
        direction.call(this, "next");
    };

    LightBox.prototype.previous = function () {
        direction.call(this, "previous");
    };

    LightBox.prototype.toggle = function () {

        // Check to see if there is a current instance running. Useful for 
        // nested triggers.
        var $currentLightbox = $lightbox.data("currentLightbox");

        if ($currentLightbox && $currentLightbox[0] !== this.element) {
            var data = $currentLightbox.data("r.lightbox"),
                self = this,
                complete = function () {
                    data.isShown = false;
                    if (supportTransition) {
                        return self[!self.isShown ? "show" : "hide"]();
                    } else {
                        return w.setTimeout(function () {
                            return self[!self.isShown ? "show" : "hide"]();
                        }, 300);
                    }
                };

            if (data) {
                destroy.call(data, complete);
                return true;
            }
        }

        return this[!this.isShown ? "show" : "hide"]();
    };

    // Plug-in definition 
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

    // Set the public constructor.
    $.fn.lightbox.Constructor = LightBox;

    // No conflict.
    var old = $.fn.lightbox;
    $.fn.lightbox.noConflict = function () {
        $.fn.lightbox = old;
        return this;
    };

    // Data API
    $body.on(eclick, ":attrStart(data-lightbox)", function (event) {

        event.preventDefault();

        // Handle close events.
        var $this = $(this);

        // If it's a modal close instruction we want to ignore it.
        if ($this.is("[data-lightbox-modal-trigger]")) {
            return;
        }

        var data = $this.data("r.lightboxOptions"),
            options = data || $.buildDataOptions($this, {}, "lightbox", "r"),
            params = $this.data("r.lightbox") ? "toggle" : options;

        // Run the lightbox method.
        $this.lightbox(params);

    }).on(eclick, "[data-lightbox-modal-trigger]", function (event) {

        event.preventDefault();

        // Handle close events.
        var $this = $(this),
            data = $this.data("r.lightboxOptions"),
            options = data || $.buildDataOptions($this, {}, "lightbox", "r"),
            $closeTarget = $(options.modalTrigger || (options.modalTrigger = $this.attr("href")));

        $closeTarget.each(function () {

            var lightbox = $(this).data("r.lightbox");

            if (lightbox) {
                // Compare the elements.
                if (lightbox.$element[0] === this) {
                    lightbox.hide();
                    return true;
                }
            }

            return false;
        });
    });

    w.RESPONSIVE_LIGHTBOX = true;

}(jQuery, window, ".r.lightbox"));