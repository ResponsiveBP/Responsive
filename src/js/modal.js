import $d from "./dum"
import RbpBase from "./base"
import RbpCore from "./core"

const RbpModal = (($d, core, base, w, d) => {

    const protocol = w.location.protocol.indexOf("http") === 0 ? w.location.protocol : "http:";

    // Regular expressions.
    const rhint = /\((\w+)\|(\w+)\)/;
    const rexternalHost = new RegExp("//" + w.location.host + "($|/)");
    // Taken from jQuery.
    const rhash = /^#.*$/; // Altered to only match beginning.
    const rurl = /^([\w.+-]+:)(?:\/\/([^/?#:]*)(?::(\d+)|)|)/;
    const rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
    const rimage = /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|ti(ff|f)|webp|svg)((\?|#).*)?$)/i;

    const fromTemplate = (template) => {
        return core.parseHtml(template).body.firstChild;
    }

    const getMediaProvider = url => {
        const providers = {
            youtube: /youtu(be\.com|be\.googleapis\.com|\.be)/i,
            vimeo: /vimeo/i,
            vine: /vine/i,
            instagram: /instagram|instagr\.am/i,
            getty: /embed\.gettyimages\.com/i
        };

        const keys = Object.keys(providers);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let p = providers[k];
            if (p.test(url)) {
                return k;
            }
        }

        return null;
    };

    const isExternalUrl = url => {

        // Handle different host types.
        // Split the url into it's various parts.
        const locationParts = rurl.exec(url) || rurl.exec(protocol + url);

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

    // Context is bound to the modal instance
    function buildMain(complete) {
        const notHash = !rhash.test(this.target),
            external = isExternalUrl(this.target),
            iframeScroll = this.options.iframeScroll === true,
            isImage = this.options.image === true || rimage.test(this.target),
            isIframe = this.options.iframe === true || notHash && external ? !isImage : false;

        this.local = !notHash && !external;

        if (!this.local) {
            // iframe
            if (isIframe) {
                if (iframeScroll) {
                    // Prevent double scroll
                    $d.addClass(this.main, "no-overflow");
                }

                const src = (external && this.target.indexOf("http") !== 0) ? protocol + this.target : this.target;
                const frame = $d.create("iframe");
                $d.setAttr(frame, {
                    "scrolling": iframeScroll ? "yes" : "no",
                    "allowTransparency": true,
                    "allowfullscreen": ""
                });

                // Test and add media wrapper + classes.
                const mediaClass = getMediaProvider(this.target);
                if (mediaClass) {
                    const iframeWrap = $d.create("div");
                    $d.addClass(iframeWrap, ["media", mediaClass]);
                    $d.append(iframeWrap, frame);
                    $d.append(this.main, iframeWrap);

                    // Undo full height to allow aspect-ratio
                    $d.addClass(this.modal, "auto-height");
                } else {
                    $d.append(this.main, frame);
                }

                // Ensure callback is called only once fully loaded
                $d.one(frame, ["load", "error"], null, complete);
                $d.setAttr(frame, { "src": src });
                return;
            }

            // image
            if (isImage) {
                $d.addClass(this.modal, "auto-height auto-width");
                const image = $d.create("img");
                $d.append(this.main, image);

                // Ensure callback is called only once fully loaded
                $d.one(image, ["load", "error"], null, complete);
                $d.setAttr(image, { "src": this.target });
                return;
            }

            // html
            core.loadHtml(this.target).then(html => {
                html = html.outerHTML;
                this.main.innerHTML = html;
                complete();
            }).catch(complete);
        }
        // TODO: Local swap out
    }

    // Context is bound to the modal instance
    function destroyMain() {

        $d.removeClass(this.main, "no-overflow");
        if (!this.local) {
            $d.empty(this.main);
        }

        // TODO Handle local
    }

    const defaults = {
        modal: null,
        external: false,
        group: null,
        image: false,
        immediate: false,
        iframe: false,
        iframeScroll: true,
        keyboard: true,
        touch: true,
        nextHint: "Next: (Left|Right) Arrow",
        prevHint: "Previous: (Right|Left) Arrow",
        closeHint: "Close (Esc)",
        errorHint: "<p>An error has occured.</p>",
        loadHint: "Loading modal content",
        mobileTarget: null,
        mobileViewportWidth: "xs",
        fitViewport: true,
        title: null,
        description: null
    };

    class RbpModal extends base {

        constructor(element, options) {
            super(element, defaults, options, "modal");

            // We fallback to the attribute to preserve relative urls
            this.target = this.options.target || $d.getAttr(this.element, "href");
            if (!this.target) {
                return;
            }

            this.title = null;
            this.description = null;

            this.isShown = null;
            this.group = $d.queryAll(this.options.group) || [];
            this.groupIndex = 0;
            this.nextHint = this.options.nextHint.replace(rhint, this.rtl ? "$1" : "$2");
            this.prevHint = this.options.prevHint.replace(rhint, this.rtl ? "$1" : "$2");

            const modalId = core.uid();
            this.overlay = fromTemplate(`<div role="document" class="modal-overlay fade-out"></div>`);
            this.dummy = $d.id("dmo");
            if (!this.dummy) {
                this.dummy = fromTemplate(`<div id="dmo" hidden class="fade-out"></div>`);
                $d.prepend(d.body, this.dummy);
            }

            this.modal = fromTemplate(`<div id="${modalId}" class="modal fade-out"></div>`);
            this.loader = fromTemplate(`<span class="modal-loader"><span class="vhidden">${this.options.loadHint}</span></span>`);
            this.closeTrigger = fromTemplate(`<button class="modal-close"><span class="vhidden">${this.closeHint}</span></button>`);
            this.prevTrigger = fromTemplate(`<button><span class="vhidden">${this.prevHint}</span></button>`);
            this.nextTrigger = fromTemplate(`<button class="forward"><span class="vhidden">${this.nextHint}</span></button>`);

            if (this.options.title) {
                this.titleId = core.uid();
                this.header = fromTemplate(`<header><h2 id="${this.titleId}">${this.options.title}</h2></header>`);
            }

            this.main = $d.create("main");

            if (this.options.description) {
                this.descId = core.uid();
                this.footer = fromTemplate(`<footer><p id="${this.descId}">${this.options.description}</p></footer>`);
            }

            // A11y
            $d.setAttr([this.prevTrigger, this.nextTrigger], { "tabindex": 0, "aria-controls": modalId });
            if (this.titleId || this.descId) {

                $d.setAttr(this.overlay, { "aria-labelledby": `${this.titleId || ""} ${this.descId || ""}` });
            }

            // Bind events.
            $d.on(this.element, "click", null, this.click.bind(this));
            $d.on(this.overlay, "click", null, this.overlayClick.bind(this));

            if (this.options.immediate) {
                this.show();
            }
        }

        click(event) {
            event.preventDefault();
            this.show();
        }

        overlayClick(event) {
            if (this.options.modal) {
                return;
            }

            const eventTarget = event.target;

            // Order is important here. We always have to check the modal first
            if (eventTarget === this.modal || this.modal.contains(eventTarget)) {
                return;
            }

            if (eventTarget === this.closeTrigger) {
                this.hideModal();
                return;
            }

            if (eventTarget === this.overlay || this.overlay.contains(eventTarget)) {
                this.hideModal();
            }
        }

        show() {
            if (this.isShown) { return; }

            const complete = () => {
                $d.setAttr(this.dummy, { "hidden": "" });
                // TODO: track scroll position
                this.showModal();
            };

            $d.append(this.overlay, this.loader);
            $d.append(d.body, this.overlay);
            core.redraw(this.overlay);

            core.onTransitionEnd(this.overlay, complete);

            core.redraw(this.dummy);
            $d.removeClass(this.dummy, "fade-in");
            $d.addClass(this.overlay, "fade-in");
        }

        showModal() {

            if (this.isShown) { return; }

            const complete = () => {
                this.isShown = true;
            };

            $d.append(this.overlay, this.modal);
            if (this.header) {
                $d.append(this.modal, this.header);
            }

            $d.append(this.modal, this.main);

            if (this.footer) {
                $d.append(this.modal, this.footer);
            }
            const animate = () => {
                this.loader = $d.detach(this.loader);

                core.redraw(this.modal);
                core.onTransitionEnd(this.modal, complete);
                $d.addClass(this.modal, "fade-in");
            }

            // Lazy load main content
            buildMain.call(this, animate);
        }

        hide() {
            if (!this.isShown) { return; }

            const complete = () => {
                // TODO: Fire events
                this.isShown = false;
                this.overlay = $d.detach(this.overlay);
            };

            core.redraw(this.overlay);
            core.onTransitionEnd(this.overlay, complete);

            $d.removeClass(this.overlay, "fade-in");
        }

        hideModal() {

            if (!this.isShown) { return; }

            const complete = () => {
                $d.removeClass(this.modal, "auto-height auto-width");

                // TODO: Fire events
                this.header = $d.detach(this.header);

                destroyMain.call(this);
                this.main = $d.detach(this.main);

                this.footer = $d.detach(this.footer);

                w.requestAnimationFrame(() => {
                    $d.removeAttr(this.dummy, "hidden");
                    core.redraw(this.dummy);

                    $d.addClass(this.dummy, "fade-in");
                    core.redraw(this.dummy);
                    this.hide();
                });
            };

            core.redraw(this.modal);
            core.onTransitionEnd(this.modal, complete);
            $d.removeClass(this.modal, "fade-in");
        }
    }

    // Register plugin and data-api event handler and return
    return core.registerDataApi(RbpModal, "modal", defaults);

})($d, RbpCore, RbpBase, window, document);

export default RbpModal;