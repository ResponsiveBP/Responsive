(function ($, w, ns) {

    "use strict";

    var $window = $(w),
        $html = $("html"),
        $body = $("body"),
        $overlay = $("<div/>").attr({ "role": "document" }).addClass("modal-overlay modal-loader fade-out"),
        $modal = $("<div/>").addClass("modal fade-out").appendTo($overlay),
        $header = $("<div/>").addClass("modal-header fade-out"),
        $footer = $("<div/>").addClass("modal-footer fade-out"),
        $close = $("<button/>").attr({ "type": "button" }).addClass("modal-close fade-out"),
        $previous = $("<button/>").attr({ "type": "button" }).addClass("modal-direction left hidden"),
        $next = $("<button/>").attr({ "type": "button" }).addClass("modal-direction right hidden"),
        $placeholder = $("<div/>").addClass("modal-placeholder"),
        // Events
        eready = "ready" + ns,
        eresize = "resize.modal",
        eclick = "click",
        eshow = "show" + ns,
        eshown = "shown" + ns,
        ehide = "hide" + ns,
        ehidden = "hidden" + ns,
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
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;

    var Modal = function (element, options) {
        this.$element = $(element);
        this.defaults = {
            modal: false,
            external: false,
            group: null,
            iframe: false,
            iframeScroll: false,
            keyboard: true,
            touch: true,
            next: ">",
            nextHint: "Next (Right Arrow)",
            previous: "<",
            previousHint: "Previous (Left Arrow)",
            closeHint: "Close (Esc)",
            mobileTarget: null,
            mobileViewportWidth: 480,
            fitViewport: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.title = null;
        this.description = null;
        this.isShown = null;

        // Bind events.
        this.$element.on(eclick, $.proxy(this.click, this));
        $(w).off(eresize).on(eresize, $.proxy(this.resize, this));
    };

    Modal.prototype.show = function () {

        if (this.isShown) {
            return;
        }

        var self = this,
            showEvent = $.Event(eshow),
            shownEvent = $.Event(eshown),
            complete = function () {

                $modal.focus();
                // manageFocus();

                // Bind the keyboard actions.
                if (self.options.keyboard) {
                    // manageKeyboard.call(self, "show");
                }

                if (self.options.group) {
                    if (self.options.touch) {
                        //  manageTouch.call(self);
                    } else {
                        //   manageTouch.call(self, "off");
                    }
                }

                console.log("shown");
                self.$element.trigger(shownEvent);
            };

        console.log("show");
        this.$element.trigger(showEvent);

        if (showEvent.isDefaultPrevented()) {
            return;
        }

        this.create();
        this.overlay();

        // Call the callback.
        $modal.onTransitionEnd(complete);
    };
    Modal.prototype.hide = function () {

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

        this.destroy();

        $modal.onTransitionEnd(complete);
    };
    Modal.prototype.overlay = function (hide) {

        // TODO: Add hide method.
        var fade = hide ? "removeClass" : "addClass",
            self = this,
            shownEvent = $.Event(eshown),
            complete = function () {
                if (hide) {
                    $overlay.addClass("hidden");
                    $html.removeClass("modal-on")
                         .css("margin-right", "");

                    if ($html.hasClass("modal-lock")) {
                        $html.removeClass("modal-lock");
                        //if (lastScroll !== $window.scrollTop()) {
                        //    $window.scrollTop(lastScroll);
                        //    lastScroll = 0;
                        //}
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

        // Show the overlay.
        var getScrollbarWidth = function () {
            var $scroll = $("<div/>").css({ width: 99, height: 99, overflow: "scroll", position: "absolute", top: -9999 });
            $body.append($scroll);
            var scrollbarWidth = $scroll[0].offsetWidth - $scroll[0].clientWidth;
            $scroll.remove();
            return scrollbarWidth;
        };

        // Add the overlay to the body if not done already.
        if (!$(".modal-overlay").length) {
            $body.append($overlay);
        }

        if (!hide) {
            // Remove the scrollbar.
            $html.addClass("modal-on")
                 .css("margin-right", getScrollbarWidth());
        }

        $overlay.removeClass("hidden")[fade]("fade-in").redraw();
        $overlay.onTransitionEnd(complete);
    };
    Modal.prototype.create = function () {

        // Calculate whether this is an external request and set the value.
        this.options.external = !rhash.test(this.options.target);

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
        };

        var fadeIn = function () {
            self.resize();

            $.each([$header, $footer, $close, $modal], function () {

                this.addClass("fade-in")
                    .redraw();
            });

            self.overlay();
            $overlay.removeClass("modal-loader");
        };

        var self = this,
            title = this.options.title,
            description = this.options.description,
            modal = this.options.modal,
            target = this.options.target,
            external = isExternalUrl(target),
            local = !this.options.external && !external,
            group = this.options.group,
            nextText = this.options.next + "<span class=\"visuallyhidden\">" + this.options.nextHint + "</span>",
            previousText = this.options.previous + "<span class=\"visuallyhidden\">" + this.options.previousHint + "</span>",
            iframeScroll = this.options.iframeScroll,
            iframe = this.options.iframe || !local ? external && !rimage.test(target) : false,
            $iframeWrap = $("<div/>").addClass(iframeScroll ? "media media-scroll" : "media"),
            $content = $("<div/>").addClass("modal-content");

        // 1: Build the header
        if (title || !modal) {

            if (title) {
                var id = "modal-label-" + $.pseudoUnique();
                $header.html("<div class=\"container\"><h2 id=\"" + id + "\">" + title + "</h2></div>")
                       .appendTo($overlay.attr({ "aria-labelledby": id }));
            }

            if (!modal) {
                $close.html("x <span class=\"visuallyhidden\">" + this.options.closeHint + "</span>").appendTo($overlay);
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
            var $target = $(target);
            this.isLocalHidden = $target.is(":hidden");
            $modal.addClass(this.options.fitViewport ? "container" : "");
            $placeholder.detach().insertAfter($target);
            $target.detach().appendTo($content).removeClass("hidden");
            $content.appendTo($modal);
            // Fade in.
            fadeIn();
        } else {
            if (iframe) {

                $modal.addClass("modal-iframe");

                // Normalize the src.
                var src = target.indexOf("http") !== 0 ? protocol + target : target,
                    getMediaProvider = function (url) {
                        var providers = {
                            youtube: /youtu(be\.com|be\.googleapis\.com|\.be)/i,
                            vimeo: /vimeo/i,
                            vine: /vine/i,
                            instagram: /instagram|instagr\.am/i,
                            getty: /embed\.gettyimages\.com/i
                        };

                        for (var p in providers) {
                            if (providers.hasOwnProperty(p) && providers[p].test(url)) {
                                return p;
                            }
                        }

                        return false;
                    };

                // Have to add inline styles for older browsers.
                $("<iframe/>").attr({
                    "scrolling": iframeScroll ? "yes" : "no",
                    "allowTransparency": true,
                    "frameborder": 0,
                    "hspace": 0,
                    "vspace": 0,
                    "webkitallowfullscreen": "",
                    "mozallowfullscreen": "",
                    "allowfullscreen": ""
                }).one("load error", function () {
                    // Fade in. Can be slow but ensures concurrency.
                    fadeIn();
                }).appendTo($iframeWrap).attr("src", src);

                // Test and add additional media classes.
                var mediaClasses = getMediaProvider(target) || "";
                $iframeWrap.addClass(mediaClasses).appendTo($modal);

            } else {
                if (rimage.test(target)) {

                    $modal.addClass("modal-image");

                    $("<img/>").one("load error", function () {
                        // Fade in.
                        fadeIn();
                    }).appendTo($modal).attr("src", target);
                } else {
                    $modal.addClass("modal-ajax");
                    // Standard ajax load.
                    $content.load(target, function () {
                        $content.appendTo($modal);
                        // Fade in.
                        fadeIn();
                    });
                }
            }
        }

        if (group) {
            // Need to show next/previous.
            $next.html(nextText).prependTo($modal).removeClass("hidden");
            $previous.html(previousText).prependTo($modal).removeClass("hidden");
        }
    };
    Modal.prototype.destroy = function () {
        var self = this,
            cleanUp = function () {

                if (!self.options.external) {
                    // Put that kid back where it came from or so help me.
                    $(self.options.target).addClass(self.isLocalHidden ? "hidden" : "").detach().insertAfter($placeholder);
                    $placeholder.detach().insertAfter($overlay);
                }

                // Clean up the header/footer.
                $header.empty().detach();
                $footer.empty().detach();
                $close.detach();

                // Remove label.
                $overlay.removeAttr("aria-labelledby");

                // Clean up the modal.
                $next.detach();
                $previous.detach();

                // Fix __flash__removeCallback' is undefined error.
                $.when($modal.find("iframe").attr("src", "")).then(w.setTimeout(function () {

                    $modal.removeClass("modal-iframe modal-ajax modal-image container").css({
                        "max-height": "",
                        "max-width": ""
                    }).empty();

                    // manageFocus("hide");

                    // Unbind the keyboard actions.
                    if (self.options.keyboard) {

                        // manageKeyboard.call(self, "hide");
                    }
                }, 100));

                // $modal.removeData("currentmodal");
            };

        self.overlay(true);
        $modal.onTransitionEnd(cleanUp);
    };
    Modal.prototype.click = function (event) {
        event.preventDefault();
        this.show();
    };
    Modal.prototype.resize = function () {

        var windowHeight = parseInt($window.height(), 10),
            headerHeight = $header.length && parseInt($header.height(), 10) || 0,
            closeHeight = $close.length && parseInt($close.outerHeight(), 10) || 0,
            topHeight = closeHeight > headerHeight ? closeHeight : headerHeight,
            footerHeight = $footer.length && parseInt($footer.height(), 10) || 0;

        $(".modal-overlay").css({ "padding-top": topHeight, "padding-bottom": footerHeight });

        if ($modal.hasClass("modal-image")) {

            $modal.children("img").css("max-height", windowHeight - (topHeight + footerHeight));
        } else if ($modal.hasClass("modal-iframe")) {

            // Calculate the ratio.
            var $iframe = $modal.find(".media > iframe"),
                iframeWidth = parseInt($iframe.width(), 10),
                maxHeight = windowHeight - (topHeight + footerHeight),
                iframeHeight = parseInt($iframe.height(), 10),
                ratio = iframeWidth / iframeHeight,
                maxWidth = maxHeight * ratio;
            // Set both to ensure there is no overflow.
            $.each([$modal, $iframe], function () {
                this.css({
                    "max-height": maxHeight,
                    "max-width": maxWidth
                });
            });
        }
    };

    // Plug-in definition 
    $.fn.modal = function (options) {

        return this.each(function () {
            var $this = $(this),
                data = $this.data("r.modal"),
                opts = typeof options === "object" ? options : {};

            if (!opts.target) {
                opts.target = $this.attr("href");
            }

            if (!data) {
                // Check the data and reassign if not present.
                $this.data("r.modal", (data = new Modal(this, opts)));
            }

            // Run the appropriate function if a string is passed.
            if (typeof options === "string") {
                data[options]();
            }
        });
    };

    // Set the public constructor.
    $.fn.modal.Constructor = Modal;

    // No conflict.
    var old = $.fn.modal;
    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };

    $(document).on(eready, function () {

        $(":attrStart(data-modal)").each(function () {

            var $this = $(this),
                data = $this.data("r.modalOptions"),
                options = data || $.buildDataOptions($this, {}, "modal", "r");

            // Run the modal method.
            $this.modal(options);
        });
    });

}(jQuery, window, ".r.modal"));