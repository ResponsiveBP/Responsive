/*
 * Responsive Lightbox
 */

/*global jQuery*/
/*jshint expr:true*/

(function ($, w, ns, da) {

    "use strict";

    if (w.RESPONSIVE_MODAL) {
        return;
    }

    var $window = $(w),
        $html = $("html"),
        $body = $("body"),
        $overlay = $("<div/>").attr({ "role": "document" }).addClass("modal-overlay modal-loader fade-out"),
        $modal = $("<div/>").addClass("modal fade-out").appendTo($overlay),
        $header = $("<div/>").addClass("modal-header fade-out"),
        $footer = $("<div/>").addClass("modal-footer fade-out"),
        $close = $("<button/>").attr({ "type": "button" }).addClass("modal-close fade-out"),
        $prev = $("<button/>").attr({ "type": "button" }).addClass("modal-direction prev fade-out"),
        $next = $("<button/>").attr({ "type": "button" }).addClass("modal-direction next fade-out"),
        $placeholder = $("<div/>").addClass("modal-placeholder"),
        // Events
        eready = "ready" + ns + da,
        echanged = "domchanged" + ns + da,
        eresize = ["resize" + ns, "orientationchange" + ns].join(" "),
        eclick = "click",
        ekeydown = "keydown",
        efocusin = "focusin",
        eshow = "show" + ns,
        eshown = "shown" + ns,
        ehide = "hide" + ns,
        ehidden = "hidden" + ns,
        eerror = "error" + ns,
        rtl = $.support.rtl,
        supportTransition = $.support.transition,
        currentGrid = $.support.currentGrid(),
        keys = {
            ESCAPE: 27,
            LEFT: 37,
            RIGHT: 39
        },
        lastScroll = 0,
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
            modal: null,
            external: false,
            group: null,
            image: false,
            immediate: false,
            iframe: false,
            iframeScroll: true,
            keyboard: true,
            touch: true,
            next: ">",
            nextHint: "Next (" + (rtl ? "Left" : "Right") + " Arrow)",
            prev: "<",
            previousHint: "Previous (" + (rtl ? "Right" : "Left") + " Arrow)",
            closeHint: "Close (Esc)",
            errorHint: "<p>An error has occured.</p>",
            mobileTarget: null,
            mobileViewportWidth: "xs",
            fitViewport: true
        };
        this.options = $.extend({}, this.defaults, options);
        this.title = null;
        this.description = null;
        this.isShown = null;
        this.$group = null;

        // Make a list of grouped modal targets.
        if (this.options.group) {
            this.$group = $(this.options.group);
        }

        // Bind events.
        // Ensure script works if loaded at the top of the page.
        if ($body.length === 0) { $body = $("body"); }
        this.$element.on(eclick, $.proxy(this.click, this));
        var onResize = $.debounce($.proxy(this.resize, this), 15);
        $(w).off(eresize).on(eresize, onResize);

        if (this.options.immediate) {
            this.show();
        }
    };

    Modal.prototype.show = function () {

        if (this.isShown) {
            return;
        }

        // If the trigger has a mobile target and the viewport is smaller than the mobile limit
        // then redirect to that page instead.
        if (this.options.mobileTarget) {
            var width = this.options.mobileViewportWidth;
            // Handle numeric width.
            if (typeof width === "number" && width >= $window.width()) {
                w.location.href = this.options.mobileTarget;
                return;
            }

            // Handle specific range.
            if (typeof width === "string") {
                var index = $.inArray(width, currentGrid.range);
                if (currentGrid.index <= index && index > -1) {
                    w.location.href = this.options.mobileTarget;
                    return;
                }
            }
        }

        var self = this,
            showEvent = $.Event(eshow),
            shownEvent = $.Event(eshown),
            complete = function () {

                $modal.data("currentModal", self.$element);

                $modal.focus();

                // Ensure that focus is maintained within the modal.
                $(document).on(efocusin, function (event) {
                    if (event.target !== $overlay[0] && !$.contains($overlay[0], event.target)) {
                        var $newTarget = $modal.find("input, select, a, iframe, img, button").first();
                        $newTarget.length ? $newTarget.focus() : ((!self.options.modal && $close.focus()) || $overlay.focus());
                        return false;
                    }

                    return true;
                });

                // Bind the keyboard and touch actions.
                if (self.options.keyboard) {
                    $(document).on(ekeydown, $.proxy(self.keydown, self));
                }

                if (self.options.group) {
                    if (self.options.touch) {
                        $modal.on("swipe.modal", true)
                              .on("swipeend.modal", $.proxy(self.swipeend, self));
                    }
                }

                // Bind the next/prev/close events.
                $modal.off(eclick).on(eclick, $.proxy(function (event) {
                    var next = $next[0],
                        prev = $prev[0],
                        eventTarget = event.target;

                    if (eventTarget === next || eventTarget === prev) {
                        event.preventDefault();
                        event.stopPropagation();
                        this[eventTarget === next ? "next" : "prev"]();
                        return;
                    }

                    if (this.options.modal) {
                        if (eventTarget === $modal.find(this.options.modal)[0]) {
                            event.preventDefault();
                            event.stopPropagation();
                            this.hide();
                        }
                    }

                }, self));

                self.$element.trigger(shownEvent);
            };

        this.$element.trigger(showEvent);

        if (showEvent.isDefaultPrevented()) {
            return;
        }

        this.isShown = true;
        this.overlay();
        this.create();

        // Call the callback.
        $modal.onTransitionEnd(complete);
    };

    Modal.prototype.hide = function (preserveOverlay, callback) {

        if (!this.isShown) {
            return;
        }

        var self = this,
            hideEvent = $.Event(ehide),
            hiddenEvent = $.Event(ehidden),
            complete = function () {
                self.destroy(callback);
                $modal.removeData("currentModal");
                self.$element.trigger(hiddenEvent);
            };

        this.$element.trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
            return;
        }

        this.isShown = false;

        $.each([$header, $footer, $close, $modal, $next, $prev], function () {
            this.removeClass("fade-in")
                .redraw();
        });

        // Return focus events back to normal.
        $(document).off(efocusin);

        // Unbind the keyboard and touch actions.
        if (this.options.keyboard) {
            $(document).off(ekeydown);
        }

        if (this.options.touch) {
            $modal.off("swipe.modal swipeend.modal");
        }

        if (!preserveOverlay) {
            this.overlay(true);
        }

        $modal.onTransitionEnd(complete).ensureTransitionEnd();
    };

    Modal.prototype.overlay = function (hide) {

        var fade = hide ? "removeClass" : "addClass",
            self = this,
            complete = function () {
                if (hide) {
                    // Put scroll position etc back as before.
                    $overlay.addClass("hidden");
                    $html.removeClass("modal-on modal-lock")
                         .css("margin-right", "");

                    if (lastScroll !== $window.scrollTop()) {
                        $window.scrollTop(lastScroll);
                        lastScroll = 0;
                    }

                    return;
                }

                // Bind click events to handle hide.
                $overlay.off(eclick).on(eclick, function (event) {

                    if (self.options.modal) {
                        return;
                    }

                    var closeTarget = $close[0],
                        eventTarget = event.target;

                    if (eventTarget === $modal[0] || $.contains($modal[0], eventTarget)) {
                        return;
                    }

                    if (eventTarget === closeTarget) {
                        event.preventDefault();
                        event.stopPropagation();
                        self.hide();
                    }

                    if (eventTarget === $overlay[0] || ($.contains($overlay[0], eventTarget))) {
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
            // Take note of the current scroll position then remove the scrollbar.
            if (lastScroll === 0) {
                lastScroll = $window.scrollTop();
            }

            $html.addClass("modal-on")
                 .css("margin-right", getScrollbarWidth());
        }

        $overlay.removeClass("hidden").redraw()[fade]("fade-in").redraw();
        $overlay.onTransitionEnd(complete);
    };

    Modal.prototype.create = function () {

        $overlay.addClass("modal-loader");

        var self = this;

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

            $.each([$header, $footer, $close, $next, $prev, $modal], function () {

                this.addClass("fade-in")
                    .redraw();
            });

            // self.overlay();
            $overlay.removeClass("modal-loader");
        };

        var title = this.options.title,
            description = this.options.description,
            modal = this.options.modal,
            target = this.options.target,
            notHash = !rhash.test(this.options.target),
            external = isExternalUrl(target),
            local = !notHash && !external,
            $group = this.$group,
            nextText = this.options.next + "<span class=\"visuallyhidden\">" + this.options.nextHint + "</span>",
            prevText = this.options.prev + "<span class=\"visuallyhidden\">" + this.options.prevHint + "</span>",
            iframeScroll = this.options.iframeScroll,
            image = this.options.image || rimage.test(target),
            iframe = this.options.iframe || notHash && external ? !image : false,
            $iframeWrap = $("<div/>").addClass(iframeScroll ? "media media-scroll" : "media"),
            $content = $("<div/>").addClass("modal-content");

        if ($group) {
            // Test to see if the grouped target have data.
            var $filtered = $group.filter(function () {
                return $(this).data("r.modal");
            });

            if ($filtered.length) {
                // Need to show next/prev.
                $next.html(nextText).prependTo($modal);
                $prev.html(prevText).prependTo($modal);
            }
        }

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
                var src = (isExternalUrl(target) && target.indexOf("http") !== 0) ? protocol + target : target,
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
                                return [p, "scaled"].join(" ");
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

                if (!mediaClasses) {
                    $modal.addClass("iframe-full");
                }

                $iframeWrap.addClass(mediaClasses).appendTo($modal);

            } else {
                if (image) {

                    $modal.addClass("modal-image");

                    $("<img/>").one("load error", function () {
                        // Fade in.
                        fadeIn();
                    }).appendTo($modal).attr("src", target);
                } else {
                    $modal.addClass("modal-ajax");
                    $modal.addClass(this.options.fitViewport ? "container" : "");

                    // Standard ajax load.
                    $content.load(target, null, function (responseText, textStatus) {

                        if (textStatus === "error") {
                            self.$element.trigger($.Event(eerror, { relatedTarget: $content[0] }));
                            $content.html(self.options.errorHint);
                        }

                        $content.appendTo($modal);

                        // Fade in.
                        fadeIn();
                    });
                }
            }
        }
    };

    Modal.prototype.destroy = function (callback) {

        // Clean up the next/prev.
        $next.detach();
        $prev.detach();

        // Clean up the header/footer.
        $header.empty().detach();
        $footer.empty().detach();
        $close.detach();

        // Remove label.
        $overlay.removeAttr("aria-labelledby");

        if (!this.options.external && !$modal.is(".modal-iframe, .modal-ajax, .modal-image")) {

            // Put that kid back where it came from or so help me.
            $(this.options.target).addClass(this.isLocalHidden ? "hidden" : "").detach().insertAfter($placeholder);
            $placeholder.detach().insertAfter($overlay);

        }

        var self = this;
        // Fix __flash__removeCallback' is undefined error.
        $modal.find("iframe").attr("src", "");
        w.setTimeout(function () {

            $modal.removeClass("modal-iframe iframe-full modal-ajax modal-image container").css({
                "max-height": "",
                "max-width": ""
            }).empty();

            // Handle callback passed from direction and linked calls.
            callback && callback.call(self);
        }, 100);
    };

    Modal.prototype.click = function (event) {
        event.preventDefault();

        // Check to see if there is a current instance running. Useful for 
        // nested triggers.
        var $current = $modal.data("currentModal");

        if ($current && $current[0] !== this.$element[0]) {
            var self = this,
            complete = function () {
                if (supportTransition) {
                    self.show();
                } else {
                    w.setTimeout(function () {
                        self.show();
                    }, 300);
                }
            };

            $current.data("r.modal").hide(true, complete);
            return;
        }

        this.show();
    };

    Modal.prototype.keydown = function (event) {

        if (this.options.modal) {
            return;
        }

        // Bind the escape key.
        if (event.which === keys.ESCAPE) {
            this.hide();
        }

        // Bind the next/prev keys.
        if (this.options.group) {
            // Bind the left arrow key.
            if (event.which === keys.LEFT) {
                rtl ? this.next() : this.prev();
            }

            // Bind the right arrow key.
            if (event.which === keys.RIGHT) {
                rtl ? this.prev() : this.next();
            }
        }
    };

    Modal.prototype.resize = function () {
        // Resize the model
        var windowHeight = $window.height(),
            headerHeight = $header.length && $header.height() || 0,
            closeHeight = $close.length && $close.outerHeight() || 0,
            topHeight = closeHeight > headerHeight ? closeHeight : headerHeight,
            footerHeight = $footer.length && $footer.height() || 0,
            maxHeight = (windowHeight - (topHeight + footerHeight)) * 0.95;

        $(".modal-overlay").css({ "padding-top": topHeight, "padding-bottom": footerHeight });

        if ($modal.hasClass("modal-image")) {

            $modal.children("img").css("max-height", maxHeight);
        } else if ($modal.hasClass("modal-iframe")) {

            // Calculate the ratio.
            var $iframe = $modal.find(".media > iframe"),
                iframeWidth = $iframe.width(),
                iframeHeight = $iframe.height(),
                ratio = iframeWidth / iframeHeight,
                maxWidth = maxHeight * ratio;

            // Set both to ensure there is no overflow.
            if ($iframe.parent().hasClass("scaled")) {
                $modal.css({
                    "max-height": maxHeight,
                    "max-width": maxWidth
                });
            }

        } else {
            var $content = $modal.children(".modal-content");

            $.each([$modal, $content], function () {
                this.css({
                    "max-height": maxHeight
                });
            });

            // Prevent IEMobile10+ scrolling when content overflows the modal.
            // This causes the content to jump behind the model but it's all I can
            // find for now.
            if (w.MSPointerEvent) {
                if ($content.length && $content.children("*:first")[0].scrollHeight > $content.height()) {
                    $html.addClass("modal-lock");
                }
            }
        }

        // Reassign the current grid.
        currentGrid = $.support.currentGrid();
    };

    Modal.prototype.direction = function (course) {
        if (!this.isShown) {
            return;
        }

        if (this.options.group) {
            var self = this,
                index = this.$group.index(this.$element),
                length = this.$group.length,
                position = course === "next" ? index + 1 : index - 1,
                complete = function () {
                    if (self.$sibling && self.$sibling.data("r.modal")) {
                        if (supportTransition) {
                            self.$sibling.data("r.modal").show();
                        } else {
                            w.setTimeout(function () {
                                self.$sibling.data("r.modal").show();
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
            this.hide(true, complete);
        }
    };

    Modal.prototype.next = function () {
        this.direction("next");
    };

    Modal.prototype.prev = function () {
        this.direction("prev");
    };

    Modal.prototype.swipeend = function (event) {
        if (rtl) {
            this[(event.direction === "right") ? "prev" : "next"]();
            return;
        }

        this[(event.direction === "right") ? "next" : "prev"]();
    };

    // No conflict.
    var old = $.fn.modal;

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
            if (typeof options === "string" && /(show|hide|next|prev)/.test(options)) {
                data[options]();
            }
        });
    };

    // Set the public constructor.
    $.fn.modal.Constructor = Modal;

    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };

    // Data API
    var init = function () {
        $(":attrStart(data-modal)").each(function () {
            var $this = $(this),
                loaded = $this.data("r.modalLoaded");
            if (!loaded) {
                $this.data("r.modalLoaded", true);
                $this.modal($.getDataOptions($this, "modal"));
            }
        });
    },
    debouncedInit = $.debounce(init, 500);

    $(document).on([eready, echanged, eshown].join(" "), function (event) {
        event.type === "ready" ? init() : debouncedInit();
    });

    w.RESPONSIVE_MODAL = true;

}(jQuery, window, ".r.modal", ".data-api"));