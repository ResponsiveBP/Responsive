import $d from "./dum";
import RbpBase from "./base";
import RbpCore from "./core";

const RbpDropdown = (($d, core, base) => {
  const defaults = { dimension: "height", target: null, parent: null };
  class RbpDropdown extends base {
    constructor(element, options) {
      super(element, defaults, options, "dropdown");

      const namespace = ".rbp.dropdown";
      this.eshow = `show${namespace}`;
      this.eshown = `shown${namespace}`;
      this.ehide = `hide${namespace}`;
      this.ehidden = `hidden${namespace}`;

      this.rtl = core.isRtl(this.element);
      this.target = $d.query(this.options.target);
      this.parent = null;
      this.transitioning = false;
      this.endSize = null;

      const paneId = (this.target.id = this.target.id || core.uid()),
        active = !$d.hasClass(this.target, "collapse");

      $d.setAttr(this.element, {
        role: "tab",
        "aria-controls": paneId,
        "aria-selected": active,
        "aria-expanded": active,
        tabindex: 0
      });

      if (this.options.parent) {
        this.parent = this.target.closest(this.options.parent);
        $d.setAttr(this.parent, {
          role: "tablist",
          "aria-multiselectable": "true"
        });

        // We're safe to add the attribute here since if it's not used when data-api is disabled.
        $d.setAttr(this.element, {
          "data-dropdown-parent": this.options.parent
        });
      }

      $d.setAttr(this.target, {
        role: "tabpanel",
        "aria-labelledby": this.element.id,
        "aria-hidden": !active,
        tabindex: active ? 0 : -1
      });

      if (!active) {
        $d.setAttr(this.target, { hidden: true });
      }

      // Bind events.
      $d.on(this.element, "click", null, this.click.bind(this));
      $d.on(this.element, "keydown", null, this.keydown.bind(this));
    }

    transition(method, startEvent, completeEvent, eventData) {
      const doShow = method === "removeClass",
        complete = () => {
          // Ensure the height/width is set to auto.
          $d.setStyle(this.target, { [this.options.dimension]: "" });

          // Set the correct aria attributes.
          $d.setAttr(this.target, {
            "aria-hidden": !doShow,
            tabindex: doShow ? 0 : -1
          });

          if (!doShow) {
            $d.setAttr(this.target, { hidden: true });
          }

          let tab = $d.id($d.getAttr(this.target, "aria-labelledby"));
          $d.setAttr(tab, { "aria-selected": doShow, "aria-expanded": doShow });

          if (doShow) {
            tab.focus();
          }

          this.transitioning = false;

          $d.trigger(this.element, completeEvent, {
            relatedTarget: this.options.target
          });
        };

      if (!$d.trigger(this.element, startEvent, eventData)) {
        return;
      }

      // Remove or add the expand classes.
      core.onTransitionEnd(this.target, complete);
      $d[method](this.target, "collapse");
      $d[startEvent === this.eshow ? "addClass" : "removeClass"](
        this.target,
        "expand"
      );
      core.redraw(this.target);
    }

    show() {
      if (this.transitioning || $d.hasClass(this.target, "expand")) {
        return;
      }

      this.transitioning = true;

      let dimension = this.options.dimension,
        size,
        actives = [];

      if (this.parent) {
        // Get all the related open panes.
        actives = $d
          .queryAll(`[data-dropdown-parent="${this.options.parent}"]`)
          .filter(a => {
            let data = core.data(a).dropdown,
              target = data && data.target;

            return (
              target &&
              !$d.hasClass(target, "collapse") &&
              data !== this &&
              data.parent &&
              data.parent === this.parent
            );
          });
      }

      // Set the height/width to zero then to the height/width so animation can take place.
      $d.setStyle(this.target, { [dimension]: 0 });

      if (core.support.transition) {
        // Calculate the height/width.
        $d.setStyle(this.target, { [dimension]: "auto" });
        $d.setAttr(this.target, { "aria-hidden": false });
        $d.removeAttr(this.target, "hidden");
        size = window.getComputedStyle(this.target)[dimension];

        // Reset to zero and force repaint.
        $d.setStyle(this.target, { [dimension]: 0 });
        core.redraw(this.target);
      }

      $d.setStyle(this.target, { [dimension]: size || "" });
      this.transition("removeClass", this.eshow, this.eshown, {
        relatedTarget: this.options.target
      });
      actives.forEach(a => core.data(a).dropdown.hide());
    }

    hide() {
      if (this.transitioning || this.target.classList.contains("collapse")) {
        return;
      }

      this.transitioning = true;

      // Reset the height/width and then reduce to zero.
      let dimension = this.options.dimension,
        size;

      if (core.support.transition) {
        // Set the height to auto, calculate the height/width and reset.
        size = window.getComputedStyle(this.target)[dimension];

        // Reset the size and force repaint.
        $d.setStyle(this.target, { [dimension]: size });
        core.redraw(this.target);
      }

      this.transition("addClass", this.ehide, this.ehidden, {
        relatedTarget: this.options.target
      });
      $d.setStyle(this.target, { [dimension]: 0 });
    }

    toggle() {
      if (this.transitioning) {
        return;
      }

      this[this.target.classList.contains("collapse") ? "show" : "hide"]();
    }

    click(event) {
      event.preventDefault();
      event.stopPropagation();
      this.toggle();
    }

    keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      const which = event.which;
      if (
        which === core.keys.SPACE ||
        which === core.keys.LEFT ||
        which === core.keys.RIGHT
      ) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (which === core.keys.SPACE) {
        this.toggle();
        return;
      }

      if (!this.parent) {
        return;
      }

      let items = $d.queryAll(
          `[data-dropdown-parent="${this.options.parent}"]`
        ),
        index = items.findIndex(i => i.matches(":focus")),
        length = items.length;

      if (which === core.keys.LEFT) {
        this.rtl ? (index += 1) : (index -= 1);
      } else if (which === core.keys.RIGHT) {
        this.rtl ? (index -= 1) : (index += 1);
      }

      // Ensure that the index stays within bounds.
      if (index === length) {
        index = 0;
      }

      if (index < 0) {
        index = length - 1;
      }

      const data = core.data(items[index]).dropdown;
      data && data.show();
    }
  }

  // Register plugin and data-api event handler and return
  return core.registerDataApi(RbpDropdown, "dropdown", defaults);
})($d, RbpCore, RbpBase);

export default RbpDropdown;
