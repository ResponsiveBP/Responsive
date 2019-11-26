import $d from "./dum";
import RbpBase from "./base";
import RbpCore from "./core";

const RbpModal = (($d, w, core, base) => {
  const protocol =
    w.location.protocol.indexOf("http") === 0 ? w.location.protocol : "http:";

  // Regular expressions.
  const rhint = /\((\w+)\|(\w+)\)/;
  const rexternalHost = new RegExp("//" + w.location.host + "($|/)");
  // Taken from jQuery.
  const rhash = /^#.*$/; // Altered to only match beginning.
  const rurl = /^([\w.+-]+:)(?:\/\/([^/?#:]*)(?::(\d+)|)|)/;
  const rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
  const rimage = /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|ti(ff|f)|webp|svg)((\?|#).*)?$)/i;

  const fromTemplate = template => {
    return $d.fromHtml(template);
  };

  const defaults = { hint: "Click to close", target: null };
  class RbpModal extends base {
    constructor(element, options) {
      super(element, defaults, options, "modal");

      const namespace = ".rbp.modal";
      this.transitioning = false;

      this.overlay =
        $d.query("modal-overlay") ||
        fromTemplate(
          `<div role="document" class="modal-overlay fade-out"></div>`
        );
    }

    showOverlay() {
      if (this.transitioning) {
        return;
      }
      // add open, fadein; remove fadout. Fire events.

      const complete = () => {

        this.showModal();
      };

      $d.addClass(this.overlay, "open","fade-out");

      core.redraw(this.overlay);
      core.onTransitionEnd(this.overlay, complete);


    }

    hideOverlay() {
      if (this.transitioning) {
        return;
      }

      this.hideModal(() => {
        const complete = () => {
          $d.removeClass(this.overlay, ["fade-in", "open"]);
        };

        core.redraw(this.overlay);
        core.onTransitionEnd(this.overlay, complete);
        $d.removeClass(this.overlay, "fade-in");
      });
    }

    showModal() {
      if (this.transitioning) {
        return;
      }
    }

    hideModal(callback) {
      if (this.transitioning) {
        return;
      }
    }

    next() {}

    prev() {}
  }

  // Register plugin and data-api event handler and return
  return core.registerDataApi(RbpModal, "modal", defaults);
})($d, window, RbpCore, RbpBase);

export default RbpModal;
