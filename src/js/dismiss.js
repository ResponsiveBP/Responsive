import $d from "./dum";
import RbpBase from "./base";
import RbpCore from "./core";

const RbpDismiss = (($d, core, base) => {
  const defaults = { hint: "Click to close", target: "" };
  class RbpDismiss extends base {
    constructor(element, options) {
      super(element, defaults, options, "dismiss");

      this.eDismiss = "dismiss.rbp.dismiss";
      this.eDismissed = "dismissed.rbp.dismiss";
      this.dismissing = false;
      this.target = this.element.closest(this.options.target);

      // A11y
      $d.setAttr(this.element, { type: "button" });
      if (this.target.classList.contains("alert")) {
        $d.setAttr(this.target, { role: "alert" });
      }

      if (!$d.queryAll(".vhidden", this.element).length) {
        let span = $d.create("span");
        $d.addClass(span, "vhidden");
        span.innerHTML = this.options.hint;
        this.element.appendChild(span);
      }

      $d.on(this.element, "click", null, this.click.bind(this));
    }

    close() {
      if (this.dismissing || !$d.trigger(this.element, this.eDismiss)) {
        return;
      }

      this.dismissing = true;

      const complete = () => {
        $d.removeClass(this.target, "fade-out");
        $d.setAttr(this.target, {
          "aria-hidden": true,
          hidden: true,
          tabindex: -1
        });
        $d.trigger(this.element, this.eDismissed);
      };

      $d.addClass(this.target, "fade-in fade-out");
      core.onTransitionEnd(this.target, complete);
      core.redraw(this.target);
      $d.removeClass(this.target, "fade-in");
    }

    click(event) {
      event.preventDefault();
      this.close();
    }
  }

  // Register plugin and data-api event handler and return
  return core.registerDataApi(RbpDismiss, "dismiss", defaults);
})($d, RbpCore, RbpBase);

export default RbpDismiss;
