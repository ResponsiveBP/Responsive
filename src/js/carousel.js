import $d from "./dum";
import Swiper from "./swiper";
import RbpBase from "./base";
import RbpCore from "./core";

const RbpCarousel = (($d, swiper, core, base, w, d) => {
  const rhint = /\((\w+)\|(\w+)\)/;

  const cactive = "carousel-active",
    citems = "figure, .slide";

  const defaults = {
    interval: 0, // Better for a11y
    mode: "slide",
    pause: "hover",
    wrap: true,
    keyboard: true,
    touch: true,
    lazyImages: true,
    lazyOnDemand: true,
    nextTrigger: null,
    nextHint: "Next: (Left|Right) Arrow",
    prevTrigger: null,
    prevHint: "Previous: (Right|Left) Arrow",
    indicators: null
  };

  class RbpCarousel extends base {
    constructor(element, options) {
      super(element, defaults, options, "carousel");

      const namespace = ".rbp.carousel";
      this.eslide = `slide${namespace}`;
      this.eslid = `slid${namespace}`;

      this.paused = null;
      this.sliding = null;
      this.keyboardTriggered = null;
      this.translationDuration = null;

      this.nextHint = this.options.nextHint.replace(
        rhint,
        this.rtl ? "$1" : "$2"
      );
      this.prevHint = this.options.prevHint.replace(
        rhint,
        this.rtl ? "$1" : "$2"
      );

      this.nextTrigger = this.options.nextTrigger
        ? $d.query(this.options.nextTrigger)
        : $d.children(this.element, "button.forward")[0];

      this.prevTrigger = this.options.prevTrigger
        ? $d.query(this.options.prevTrigger)
        : $d.children(this.element, "button:not(.forward)")[0];

      this.indicators = this.options.indicators
        ? $d.query(this.options.indicators)
        : $d.children($d.children(this.element, "ol")[0], "li");

      this.options.mode === "fade" &&
        $d.addClass(this.element, "carousel-fade");
      this.items = $d.children(this.element, citems);
      this.interval = parseInt(this.options.interval, 10);

      const activeIndex = this.activeIndex();

      // Hide the previous button if no wrapping.
      const hidden = { "aria-hidden": true, hidden: true };
      if (!this.options.wrap) {
        if (activeIndex === 0) {
          $d.setAttr(this.prevTrigger, hidden);
        }
      }

      // Hide both if one item.
      if (this.items.length === 1) {
        $d.setAttr(this.prevTrigger, hidden);
        $d.setAttr(this.nextTrigger, hidden);
      }

      // Add a11y features.
      $d.setAttr(this.element, { role: "listbox", "aria-live": "polite" });

      // Slides
      this.items.forEach((p, i) => {
        const active = i === activeIndex;
        $d.setAttr(p, {
          role: "option",
          "aria-selected": active,
          tabindex: active ? 0 : -1
        });
      });

      // Controls.
      [this.nextTrigger, this.prevTrigger].forEach(t => {
        if (t === undefined) {
          return;
        }
        $d.setAttr(t, { tabindex: 0, "aria-controls": this.element.id });
        if (!t.tagName === "BUTTON") {
          $d.setAttr(t, { role: "button" });
        }
        if (!$d.query(".vhidden", t)) {
          let span = $d.create("span");
          $d.addClass(span, "vhidden");
          span.innerHTML =
            t === this.nextTrigger ? this.nextHint : this.prevHint;
          $d.append(t, span);
        }
      });

      // Indicators.
      $d.setAttr(this.indicators, {
        role: "button",
        "aria-controls": this.element.id
      });
      this.indicators.forEach((i, idx) => {
        idx === activeIndex && $d.addClass(i, "active");
      });

      // Bind events
      if (this.options.lazyImages && !this.options.lazyOnDemand) {
        $d.on(
          w,
          "load",
          null,
          this.lazyimages.bind(this, this.items[activeIndex])
        );
      }

      if (this.interval > 0 && this.options.pause === "hover") {
        // Bind the mouse enter/leave events.
        if (!core.support.touchEvents && !core.support.pointerEvents) {
          $d.on(this.element, "mouseenter", null, this.pause.bind(this));
          $d.on(this.element, "mouseleave", null, this.cycle.bind(this));
        }
      }

      if (this.options.touch) {
        this.swiper = new swiper(`#${this.element.id}`, "carousel", "pan-y");
        this.swiper
          .onSwipeStart(this.swipestart.bind(this))
          .onSwipeMove(this.swipemove.bind(this))
          .onSwipeEnd(this.swipeend.bind(this));
      }

      if (this.options.keyboard) {
        $d.on(this.element, "keydown", null, this.keydown.bind(this));
      }

      $d.on(
        d,
        this.options.keyboard ? ["click", "keydown"] : "click",
        `[aria-controls=${this.element.id}]`,
        this.click.bind(this)
      );

      if (this.interval) {
        this.pause().cycle();
      }
    }

    activeIndex() {
      return this.items.findIndex(i => $d.hasClass(i, cactive));
    }

    lazyimages(slide) {
      if (!core.data(slide)["lazyLoaded"]) {
        $d.queryAll("img[data-src]", slide).forEach(s => {
          if (s.src.length === 0) {
            s.src = $d.getAttr(s, "data-src");
          }
        });

        core.data(slide)["lazyLoaded"] = true;
      }
    }

    pause(event) {
      if (!event) {
        // Mark as paused
        this.paused = true;
      }

      // Ensure that transition end is triggered.
      if (
        $d.queryAll(".next, .prev", this.element).length &&
        core.support.transition
      ) {
        $d.trigger(this.element, core.support.transition);
        this.cycle(true);
      }

      // Clear the interval and return the carousel for chaining.
      this.interval = core.clearInterval(this.interval);

      return this;
    }

    cycle(event) {
      if (!event) {
        // Flag false when there's no event.
        this.paused = false;
      }

      if (this.interval) {
        core.clearInterval(this.interval);
      }

      if (this.options.interval && !this.paused) {
        // Cycle to the next item on the set interval
        this.interval = core.setInterval(
          this.next.bind(this),
          this.options.interval
        );
      }

      return this;
    }

    to(index) {
      const activeIndex = this.activeIndex();

      if (index > this.items.length - 1 || index < 0) {
        return;
      }

      if (this.sliding) {
        $d.one(this.element, this.eslid, null, () => {
          this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause().cycle();
        return;
      }

      this.slide(index > activeIndex ? "next" : "prev", this.items[index]);
    }

    next() {
      if (this.sliding) {
        return false;
      }

      return this.slide("next");
    }

    prev() {
      if (this.sliding) {
        return false;
      }

      return this.slide("prev");
    }

    swipestart() {
      if (this.sliding || this.items.length === 1) {
        return;
      }

      if (this.interval) {
        this.pause();
      }
    }

    swipemove(event) {
      // Left is next in LTR mode.
      let left = event.detail.delta.x < 0,
        type = this.rtl ? (left ? "prev" : "next") : left ? "next" : "prev",
        isNext = type === "next",
        fallback = isNext ? 0 : this.items.length - 1,
        activeIndex = this.activeIndex(),
        activeItem = this.items[activeIndex];

      let nextItem = $d[type](activeItem, citems);

      // Work out which item to slide to.
      if (!nextItem) {
        if (!this.options.wrap) {
          return;
        }

        nextItem = this.items[fallback];
      }

      if ($d.hasClass(nextItem, cactive)) {
        return;
      }

      const notActive = this.items.filter(
        i => i !== activeItem && i !== nextItem
      );
      $d.setStyle(notActive, { left: "", right: "", opacity: "" });

      if (this.options.lazyImages && this.options.lazyOnDemand) {
        // Load the next image.
        this.lazyimages(nextItem);
      }

      // Get the distance swiped as a percentage.
      let width = parseInt(w.getComputedStyle(activeItem).width, 10),
        percent = parseFloat((event.detail.delta.x / width) * 100),
        diff = isNext ? 100 : -100;

      if (this.rtl) {
        percent *= -1;
      }

      // Swipe behaviour changes direction in rtl mode.
      w.requestAnimationFrame(() => {
        // Frustratingly can't be added on swipe start since edge triggers that on "click"
        $d.addClass(this.element, "no-transition");

        if (this.options.mode === "slide") {
          if (this.rtl) {
            $d.setStyle(activeItem, { right: percent + "%" });

            $d.addClass(nextItem, type);
            $d.setStyle(nextItem, { right: percent + diff + "%" });
          } else {
            $d.setStyle(activeItem, { left: percent + "%" });

            $d.addClass(nextItem, type);
            $d.setStyle(nextItem, { left: percent + diff + "%" });
          }
        } else {
          $d.setStyle(activeItem, { opacity: 1 - Math.abs(percent / 100) });
          $d.addClass(nextItem, type);
        }
      });
    }

    swipeend(event) {
      if (this.sliding || !$d.hasClass(this.element, "no-transition")) {
        return;
      }

      const left = event.detail.direction === "left",
        method = this.rtl ? (left ? "prev" : "next") : left ? "next" : "prev";

      // Re-enable the transitions.
      $d.removeClass(this.element, "no-transition");
      if (core.support.transition) {
        // Trim the animation duration based on the current position.
        const activeIndex = this.activeIndex(),
          activeItem = this.items[activeIndex],
          style = w.getComputedStyle(activeItem);

        if (!this.translationDuration) {
          this.translationDuration = parseFloat(style.transitionDuration);
        }

        // Get the distance and turn it into a percentage
        // to calculate the duration. Whichever is lowest is used.
        const width = parseInt(style.width, 10),
          percentageTravelled = (Math.abs(event.detail.delta.x) / width) * 100,
          swipeDuration =
            ((event.detail.duration / 1000) * 100) / percentageTravelled,
          newDuration =
            ((100 - percentageTravelled) / 100) *
            Math.min(this.translationDuration, swipeDuration);

        // Set the new temporary duration.
        $d.setStyle(this.items, { "transition-duration": `${newDuration}s` });
      }

      this.slide(method);
    }

    keydown(event) {
      if (!event || /input|textarea/i.test(event.target.tagName)) {
        return;
      }

      const which = event.which;
      if (which === core.keys.LEFT || which === core.keys.RIGHT) {
        this.keyboardTriggered = true;
        event.preventDefault();
        event.stopPropagation();

        // Seek out the correct direction indicator, shift, and focus.
        switch (which) {
          case core.keys.LEFT:
            if (this.rtl) {
              this.next();
              this.nextTrigger.focus();
            } else {
              this.prev();
              this.prevTrigger.focus();
            }
            break;
          case core.keys.RIGHT:
            if (this.rtl) {
              this.prev();
              this.prevTrigger.focus();
            } else {
              this.next();
              this.nextTrigger.focus();
            }
            break;
        }
      }
    }

    click(event) {
      if (!event) {
        return;
      }

      const which = event.which;
      if (which && which !== core.keys.CLICK) {
        if (which === core.keys.SPACE || which === core.keys.ENTER) {
          this.keyboardTriggered = true;
        } else {
          return;
        }
      }

      event.preventDefault();
      event.stopPropagation();

      if (event.target === this.nextTrigger) {
        this.next();
      } else if (event.target === this.prevTrigger) {
        this.prev();
      } else {
        this.to(this.indicators.findIndex(i => i === event.target));
      }
    }

    slide(type, next) {
      let activeItem = this.items[this.activeIndex()],
        nextItem = next || $d[type](activeItem, citems),
        isCycling = this.interval,
        isNext = type === "next",
        fallback = isNext ? 0 : this.items.length - 1;

      if (isCycling) {
        // Pause if cycling.
        this.pause();
      }

      // Work out which item to slide to.
      if (!nextItem) {
        if (!this.options.wrap) {
          return;
        }

        nextItem = this.items[fallback];
      }

      if ($d.hasClass(nextItem, cactive)) {
        return (this.sliding = false);
      }

      const direction = isNext ? "left" : "right";
      const edirection = this.rtl
        ? isNext
          ? "right"
          : "left"
        : isNext
        ? "left"
        : "right";

      if (
        !$d.trigger(this.element, this.eslide, {
          relatedTarget: nextItem,
          direction: edirection
        })
      ) {
        return;
      }

      if (this.options.lazyImages && this.options.lazyOnDemand) {
        // Load the next image.
        this.lazyimages(nextItem);
      }

      // Good to go? Then let's slide.
      this.sliding = true;

      $d.one(this.element, this.eslid, null, () => {
        const activeIndex = this.activeIndex();
        if (!this.options.wrap) {
          if (activeIndex === this.items.length - 1) {
            $d.setAttr(this.nextTrigger, { "aria-hidden": true, hidden: true });
            $d.removeAttr(this.prevTrigger, ["aria-hidden", "hidden"]);
            if (this.keyboardTriggered) {
              this.prevTrigger.focus();
              this.keyboardTriggered = false;
            }
          } else if (activeIndex === 0) {
            $d.setAttr(this.prevTrigger, { "aria-hidden": true, hidden: true });
            $d.removeAttr(this.nextTrigger, ["aria-hidden", "hidden"]);
            if (this.keyboardTriggered) {
              this.nextTrigger.focus();
              this.keyboardTriggered = false;
            }
          } else {
            $d.removeAttr(this.prevTrigger, ["aria-hidden", "hidden"]);
            $d.removeAttr(this.nextTrigger, ["aria-hidden", "hidden"]);
            this.keyboardTriggered = false;
          }
        }

        // Highlight the correct indicator.
        $d.removeClass(this.indicators, "active");
        $d.addClass(this.indicators[activeIndex], "active");
      });

      const complete = () => {
        $d.removeClass(activeItem, [cactive, direction]);
        $d.setAttr(activeItem, { "aria-selected": false, tabIndex: -1 });

        // We have to undo left etc twice. I don't know why.
        $d.setStyle(this.items, {
          "transition-duration": "",
          left: "",
          right: "",
          opacity: ""
        });

        $d.removeClass(nextItem, [type, direction]);
        $d.addClass(nextItem, cactive);
        $d.setAttr(nextItem, { "aria-selected": true, tabIndex: 0 });

        this.sliding = false;
        $d.trigger(this.element, this.eslid, {
          relatedTarget: nextItem,
          direction: edirection
        });

        // Restart the cycle.
        if (isCycling) {
          this.cycle();
        }
      };

      // Force reflow.
      $d.addClass(nextItem, type);
      core.redraw(nextItem);

      // Do the slide and clear the added styles.
      core.onTransitionEnd(activeItem, complete);
      $d.addClass(activeItem, direction);
      $d.addClass(nextItem, direction);
      $d.setStyle(this.items, { left: "", right: "", opacity: "" });
      return this;
    }
  }

  // Register plugin and data-api event handler and return
  return core.registerDataApi(RbpCarousel, "carousel", defaults);
})($d, Swiper, RbpCore, RbpBase, window, document);

export default RbpCarousel;
