/*
 * Responsive Lightbox
 */

/*global jQuery*/
/*jshint expr:true*/

(function ($, w, ns) {

    "use strict";

    // Prevents ajax requests from reloading everything and
    // rebinding events.
    if (w.RESPONSIVE_LIGHTBOX) {
        return;
    }

    // General variables.
    var $window = $(w),
        $body = $("body"),
        $overlay = $("<div/>").addClass("lightbox-overlay lightbox-loader fade-out"),
        $lightbox = $("<div/>").addClass("lightbox fade-out").appendTo($overlay),
        $header = $("<div/>").addClass("lightbox-header fade-out"),
        $footer = $("<div/>").addClass("lightbox-footer fade-out"),
        $img = null,
        $iframe = null,
        $content = null,
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
        eresize = "resize" + ns;

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
            var self = this,
                title = this.options.title,
                description = this.options.description,
                close = this.options.close,
                target = this.options.target,
                local = !isExternalUrl(target),
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


        },
        resize = function () {
            // Bind the resize event and fade in.
            var newWindowHeight,
                oldWindowHeight,
                maxWidth = parseInt($lightbox.css("max-width"), 10);

            $window.off(eresize).on(eresize, function () {

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

                        } else if ($iframe) {

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

                $header.addClass(cfadeIn);
                $footer.addClass(cfadeIn);
                $close.addClass(cfadeIn);
                $overlay.removeClass("lightbox-loader");
                $lightbox.addClass(cfadeIn).redraw(); // force reflow

            }).triggerHandler(eresize);
        },
        toggleFade = function () {
            var complete = function () {
                this.isShown = true;
            };

            // Resize the lightbox content.
            if (!this.isShown) {
                resize();
            }

            $.each([$header, $footer, $close, $lightbox], function () {

                this.toggleClass("fade-in")
                    .redraw();
            });

            supportTransition ? $lightbox.one(supportTransition.end, complete)
                              : complete();

            $overlay.toggleClass("lightbox-loader");
        },
        toggleOverlay = function () {
            var self = this,
                complete = function () {

                    if (!$overlay.hasClass("fade-in")) {
                        $overlay.addClass("hidden");
                    }
                };

            // Add the overlay to the body if not done already.
            if (!$("div.lightbox-overlay").length) {

                $body.append($overlay);
            }

            $overlay.removeClass("hidden")
                    .redraw()
                    .toggleClass("fade-in")
                    .redraw()
                    .off(eclick).on(eclick, function (event) {

                        var closeTarget = $close[0],
                            eventTarget = event.target;

                        // TODO: Check if we can simplify this.
                        if (eventTarget === closeTarget) {
                            event.preventDefault();
                            event.stopPropagation();
                            self.hide();
                        }

                        if (eventTarget === $overlay[0]) {
                            self.hide();
                        }
                    });

            supportTransition ? $overlay.one(supportTransition.end, complete)
                  : complete();

        },
        direction = function (course) {

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
            mobileViewportWidth: 480
        };
        this.options = $.extend({}, this.defaults, options);
        this.title = null;
        this.description = null;
        this.isShown = null;
        this.transitioning = null;
        this.$group = null;

        this.toggle();
    };

    LightBox.prototype.show = function () {
        toggleOverlay.call(this);
        create.call(this);
    };

    LightBox.prototype.hide = function () {
        toggleOverlay.call(this);
    };

    LightBox.prototype.to = function () {

    };

    LightBox.prototype.next = function () {

    };

    LightBox.prototype.previous = function () {

    };

    LightBox.prototype.toggle = function () {
        return this[!this.isShown ? "show" : "hide"]();
    };

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

    // Bind the lightbox trigger.
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