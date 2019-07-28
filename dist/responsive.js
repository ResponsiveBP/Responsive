/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/*! exports provided: swiper, dismiss, tabs, tablelist, dropdown, conditional, carousel, modal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./swiper */ "./src/js/swiper.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "swiper", function() { return _swiper__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _dismiss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dismiss */ "./src/js/dismiss.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dismiss", function() { return _dismiss__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tabs */ "./src/js/tabs.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tabs", function() { return _tabs__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _tablelist__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tablelist */ "./src/js/tablelist.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tablelist", function() { return _tablelist__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dropdown */ "./src/js/dropdown.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dropdown", function() { return _dropdown__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _conditional__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./conditional */ "./src/js/conditional.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "conditional", function() { return _conditional__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _carousel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./carousel */ "./src/js/carousel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "carousel", function() { return _carousel__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modal */ "./src/js/modal.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "modal", function() { return _modal__WEBPACK_IMPORTED_MODULE_7__["default"]; });












/***/ }),

/***/ "./src/js/base.js":
/*!************************!*\
  !*** ./src/js/base.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "./src/js/core.js");



const RbpBase = (($d, core) => {

    class RbpBase {
        constructor(element, defaults, options, prefix) {
            this.element = element;
            this.element.id = element.id || core.uid();
            this.options = this.extend(defaults, options || this.dataOptions(prefix));
            this.rtl = core.isRtl(this.element);
        }

        extend(defaults, options) {
            return Object.assign({}, defaults, options)
        }

        dataOptions(prefix) {
            let result = {};
            Object.entries(core.data(this.element).attr).forEach(d => {
                // eslint-disable-next-line prefer-destructuring
                result[core.camelCase(d[0].slice(prefix && prefix.length || 0))] = d[1];
            });

            return result;
        }
    }

    return RbpBase;

})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RbpBase);

/***/ }),

/***/ "./src/js/carousel.js":
/*!****************************!*\
  !*** ./src/js/carousel.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _swiper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./swiper */ "./src/js/swiper.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core */ "./src/js/core.js");





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
})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _swiper__WEBPACK_IMPORTED_MODULE_1__["default"], _core__WEBPACK_IMPORTED_MODULE_3__["default"], _base__WEBPACK_IMPORTED_MODULE_2__["default"], window, document);

/* harmony default export */ __webpack_exports__["default"] = (RbpCarousel);


/***/ }),

/***/ "./src/js/conditional.js":
/*!*******************************!*\
  !*** ./src/js/conditional.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "./src/js/core.js");




const RbpConditional = (($d, core, base) => {

    const defaults = {
        xxs: null,
        xs: null,
        s: null,
        m: null,
        l: null,
        fallback: null,
        error: "<p>An error has occured.</p>"
    };

    class RbpConditional extends base {
        constructor(element, options) {
            super(element, defaults, options, "conditional");

            this.eload = "load.rbp";
            this.eloaded = "loaded.rbp";
            this.eerror = "error.rbp";

            this.cache = {};
            this.currentGrid = null;
            this.currentTarget = null;
            this.loading = false;

            // Bind events.
            $d.on(window, "resize", null, core.debounce(this.resize.bind(this), 50));

            // First Run
            this.resize();
        }

        resize() {
            const current = core.currentGrid(),
                grid = current.grid,
                range = current.range;

            if (this.currentGrid === grid) {
                return;
            }

            // Check to see if we need to cache the current content.
            if (!this.options.fallback) {
                range.forEach(r => {
                    if (!this.options[r]) {
                        this.options[r] = "fallback";
                        this.cache[r] = this.element.innerHTML;
                    }
                });
            }

            this.currentGrid = grid;
            const target = this.options[grid] || this.options.fallback;

            if (target === this.currentTarget) {
                return;
            }

            this.currentTarget = target;

            if (this.loading || !$d.trigger(this.element, this.eload)) {
                return;
            }

            this.loading = true;

            // First check the cache.
            if (this.cache[this.currentGrid]) {
                $d.empty(this.element);
                this.element.innerHTML = this.cache[this.currentGrid];
                this.loading = false;
                $d.trigger(this.element, this.eloaded, { relatedTarget: this.element, loadTarget: target, grid: this.currentGrid })
                return;
            }

            const detail = { relatedTarget: this.element, loadTarget: target, grid: this.currentGrid };
            $d.empty(this.element);

            core.loadHtml(target).then(html => {
                this.loading = false;
                // Convert to a string for storage, empty() already deals with any event handlers.
                html = html.outerHTML;
                this.cache[grid] = html;
                this.element.innerHTML = html;
                $d.trigger(this.element, this.eloaded, detail);
            }).catch(e => {
                $d.trigger(this.element, this.eerror, Object.assign({}, detail, { error: e, }));
                this.element.innerHTML = this.options.error;
                this.loading = false;
            });
        }
    }

    // Register plugin and data-api event handler and return
    return core.registerDataApi(RbpConditional, "conditional", defaults);

})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_2__["default"], _base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RbpConditional);

/***/ }),

/***/ "./src/js/core.js":
/*!************************!*\
  !*** ./src/js/core.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");


/**!
 * Responsive v5.0.0 | MIT License | responsivebp.com
 */
const RbpCore = (($d, w, d) => {
  // The initialization event used to trigger component autoloading
  const einit = "init.rpb";

  const raf = w.requestAnimationFrame;

  const okeys = Object.keys;

  const support = {
    touchEvents:
      "ontouchstart" in w ||
      (w.DocumentTouch && document instanceof w.DocumentTouch),
    pointerEvents: w.PointerEvent
  };

  support.transition = (() => {
    const transitionEnd = () => {
      const div = $d.create("div"),
        transEndEventNames = {
          transition: "transitionend",
          WebkitTransition: "webkitTransitionEnd"
        };

      const names = okeys(transEndEventNames);
      for (let i = 0; i < names.length; i++) {
        if (div.style[names[i]] !== undefined) {
          return transEndEventNames[names[i]];
        }
      }

      return null;
    };

    return transitionEnd();
  })();

  const getDurationMs = element =>
    w.getComputedStyle(element).transitionDuration.match(/\d+(.\d+)?/)[0] *
    1000;

  const dataMap = new WeakMap();

  const rdashAlpha = /-([a-z])/g;

  const fcamelCase = (all, letter) => letter.toUpperCase();

  /**
   * Contains information about the current viewport grid definition
   * @class Grid
   */
  class Grid {
    constructor(grid, index, range) {
      /**
       * The grid The current applied grid; either xxs, xs, s, m, or l
       * @type {string}
       */
      this.grid = grid;

      /**
       * The index of the current grid in the range
       * @type {number}
       */
      this.index = index;

      /**
       * The available grid range
       * @type {string[]}
       */
      this.range = range;
    }
  }

  class RbpCore {
    constructor() {
      this.support = support;
      this.einit = einit;

      this.keys = {
        CLICK: 1, // Not really a keyboard event but get passed via which
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        LEFT: 37,
        RIGHT: 39
      };

      this.fn = {
        on: [],
        off: function(api) {
          if (api === "data-api") {
            this.on.forEach(k => {
              $d.off(d, einit + "." + this.on[k]);
              this.on.splice(k, 1);
            });
            return;
          }

          const i = this.on.indexOf(api);
          if (i > -1) {
            $d.off(d, einit + "." + this.on[i]);
            this.on.splice(i, 1);
          }
        },
        support: support
      };
    }

    /**
     * Generates a unique eight character random string prefixed with `uid-`
     * @returns {string}
     * @memberof RbpCore
     */
    uid() {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let id = "";

      for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return `uid-${id}`;
    }

    /**
     * Returns a transformed string in camel case format
     * @param {string} value The string to alter
     * @returns {string}
     * @memberof RbpCore
     */
    camelCase(value) {
      const noDash = value.replace(rdashAlpha, fcamelCase);
      return noDash.charAt(0).toLowerCase() + noDash.substring(1);
    }

    /**
     * Returns a transformed string in dashed case format
     * @param {string} value The string to alter
     * @returns {string}
     * @memberof RbpCore
     */
    dashedCase(value) {
      return value.replace(/([A-Z])/g, $1 => `-${$1.toLowerCase()}`);
    }

    /**
     * Returns a namespaced data attribute CSS selector from the given default options
     * @param {any} defaults
     * @param {any} namespace
     * @returns
     * @memberof RbpCore
     */
    dataSelector(defaults, namespace) {
      return (
        (defaults &&
          `${okeys(defaults)
            .map(x => `[data-${namespace}-${this.dashedCase(x)}]`)
            .join(", ")}`) ||
        `[data-${namespace}]`
      );
    }

    /**
     * Registers the given plugin against the data-api using the given namespace and defaults
     * @param {Class} plugin The plugin type
     * @param {any} namespace The data-api namespace
     * @param {object} defaults The object containing the default data-attribute keys
     * @returns {Class} the plugin type
     * @memberof RbpCore
     */
    registerDataApi(plugin, namespace, defaults) {
      if (this.fn[namespace]) {
        return;
      }

      this.fn[namespace] = [];

      this.fn[namespace] = (e, o) => {
        let result = [];

        $d.queryAll(e).forEach(i => {
          return result.push(
            this.data(i)[namespace] ||
              (this.data(i)[namespace] = new plugin(i, o))
          );
        });

        return result.length === 1 ? result[0] : result;
      };

      this.fn.on.push(`${namespace}.data-api`);
      $d.on(d, this.einit + "." + `${namespace}.data-api`, null, () => {
        this.fn[namespace](this.dataSelector(defaults, namespace));
      });

      return plugin;
    }

    /**
     * Returns any data stored in data-attributes for the given element
     * @param {HTMLElement} element
     * @returns {object}
     * @memberof RbpCore
     */
    data(element) {
      if (!dataMap.has(element)) {
        let attr = {},
          data = Object.values(element.attributes).filter(
            a => a.name.indexOf("data-") === 0
          );

        data.forEach(d => {
          attr[this.camelCase(d.name.slice(5))] = d.value;
        });

        dataMap.set(element, { attr: attr });
      }

      return dataMap.get(element);
    }

    /**
     * Returns a value indicating what grid range the current browser width is within.
     * @returns {Grid}
     * @memberof RbpCore
     */
    currentGrid() {
      const div = $d.create("div");
      $d.addClass(div, "gsi");
      $d.prepend(d.body, div);

      // These numbers match values in the css
      const grids = ["xxs", "xs", "s", "m", "l"],
        key = parseInt(w.getComputedStyle(div).width, 10);

      div.remove();

      return new Grid(grids[key], key, grids);
    }

    /**
     * Returns a value indicating whether the given element is within a right-to-left context
     * @param {HTMLElement} element
     * @returns {boolean}
     * @memberof RbpCore
     */
    isRtl(element) {
      return Boolean(element.closest("[dir=rtl]"));
    }

    /**
     * Returns a value indicating whether the given element both hidden from display and layout in the DOM
     * @param {HTMLElement} element
     * @returns {boolean}
     * @memberof RbpCore
     */
    isHidden(element) {
      const visible = Boolean(
        element.offsetWidth ||
          element.offsetHeight ||
          element.getClientRects().length
      );
      return !visible;
    }

    /**
     * Forces the browser to redraw given element
     * @param {HTMLElement} element
     * @memberof RbpCore
     */
    redraw(element) {
      return element && element.offsetWidth;
    }

    /**
     * Returns the document or element from the given url
     * @param {any} url The path to the target document. if a space prefixed `#selector` is appended to the url then
     * the element matching that selector will be returned.
     * @returns {HtmlDocument | HtmlElement}
     * @memberof RbpCore
     */
    loadHtml(url) {
      const parts = url.split(/\s+/),
        selector = parts.length > 1 ? parts[1].trim() : null;
      url = parts[0];

      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(data => {
          return $d.fromHtml(data, selector);
        });
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * @param {Function} func The function to debounce
     * @param {number} wait The number of milliseconds to delay
     * @param {boolean} immediate Specify execution on the leading edge of the timeout
     * @returns {Function}
     * @memberof RbpCore
     */
    debounce(func, wait, immediate) {
      let timeout;
      return function() {
        const args = arguments;
        w.clearTimeout(timeout);
        timeout = this.setTimeout(() => {
          timeout = null;
          if (!immediate) {
            func.apply(this, args);
          }
        }, wait);
        if (immediate && !timeout) {
          func.apply(this, args);
        }
      };
    }

    /**
     * An enhanced version of `window.setInterval` that uses the enhanced performance and accuracy offered by
     * `window.requestAnimationFrame`.
     * see https://github.com/nk-components/request-interval
     * @param {Function} func A function to be executed every delay milliseconds.
     * @param {number} delay The delay in milliseconds
     * The function is not passed any parameters, and no return value is expected.
     * @returns {object}
     * @memberof RbpCore
     */
    setInterval(func, delay) {
      let start = Date.now(),
        handler = { id: raf(loop) };

      return handler;

      function loop() {
        handler.id = raf(loop);

        if (Date.now() - start >= delay) {
          func();
          start = Date.now();
        }
      }
    }

    /**
     * An enhanced version of `window.clearInterval` that uses the enhanced performance and accuracy offered by
     * `window.cancelAnimationFrame`.
     * @param {object} handler The handler returned by th previous `setInterval` call
     * @memberof RbpCore
     */
    clearInterval(handler) {
      handler && w.cancelAnimationFrame(handler.id);
    }

    /**
     * An enhanced version of `window.setTimeout` that uses the enhanced performance and accuracy offered by
     * `window.requestAnimationFrame`.
     * @param {Function} func A function to be executed after delay milliseconds.
     * @param {number} delay The delay in milliseconds
     * @returns
     * @memberof RbpCore
     */
    setTimeout(func, delay) {
      let start = Date.now(),
        handler = { id: raf(loop) };

      return handler;

      function loop() {
        Date.now() - start >= delay ? func() : (handler.id = raf(loop));
      }
    }

    /**
     * Binds a one-time event handler to the element that is triggered on CSS transition end
     * ensuring that the event is always triggered after the correct duration.
     * @param {HTMLElement} element The element to bind to
     * @param {Function} func The callback function
     * @memberof RbpCore
     */
    onTransitionEnd(element, func) {
      const supportTransition = this.support.transition;

      if (!supportTransition) {
        func();
        return;
      }

      // Register the eventhandler that calls the defined callback
      let called = false;
      $d.one(element, supportTransition, null, () => {
        if (!called) {
          called = true;
          func();
        }
      });

      // Ensure that the event is always triggered.
      const ensure = function() {
        if (!called) {
          $d.trigger(element, supportTransition);
        }
      };
      this.setTimeout(ensure, getDurationMs(element));
    }
  }

  // Create our core instance and bind to the window
  const core = new RbpCore();
  w.$rbp = core.fn;

  // Register the data event handlers on ready
  $d.ready().then(() => {
    // Trigger the einit event
    $d.trigger(d, core.einit);

    // Observe for future changes in the DOM
    new MutationObserver(() => {
      $d.trigger(d, einit);
    }).observe(d.body, {
      childList: true,
      subtree: true
    });
  });

  // Return
  return core;
})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], window, document);

/* harmony default export */ __webpack_exports__["default"] = (RbpCore);


/***/ }),

/***/ "./src/js/dismiss.js":
/*!***************************!*\
  !*** ./src/js/dismiss.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "./src/js/core.js");




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
})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_2__["default"], _base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RbpDismiss);


/***/ }),

/***/ "./src/js/dropdown.js":
/*!****************************!*\
  !*** ./src/js/dropdown.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "./src/js/core.js");




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
})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_2__["default"], _base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RbpDropdown);


/***/ }),

/***/ "./src/js/dum.js":
/*!***********************!*\
  !*** ./src/js/dum.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**!
 * DUM.js | MIT License | https://github.com/JimBobSquarePants/DUM.js
 */

const $d = ((w, d) => {
  // Regular expressions
  // Spaces
  const rspace = /\s+/;

  // Array-like collections that we should slice
  const rslice = /nodelist|htmlcollection/;

  // Event namespace detection
  const rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

  const keys = Object.keys;

  const domParser = new w.DOMParser();

  const parseHtml = html => domParser.parseFromString(html, "text/html");

  // Escape function for RexExp https://github.com/benjamingr/RegExp.escape
  const escape = s => String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");

  // Returns the type of an object in lowercase. Kudos Angus Croll
  // https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
  const type = obj =>
    ({}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase());

  const isString = obj => type(obj) === "string";

  const isArray = obj => type(obj) === "array";

  const isFunc = obj => type(obj) === "function";

  const isNullOrUndefined = obj => obj === null || obj === undefined;

  // Convert, number, string, and collection types to an array
  const toArray = obj => {
    return (
      (obj &&
        (isArray(obj)
          ? obj
          : rslice.test(type(obj))
          ? [].slice.call(obj)
          : [obj])) ||
      []
    );
  };

  const arrayFunction = (items, delegate, args) => {
    let result = [];
    toArray(items).forEach(i => {
      if (isNullOrUndefined(i)) {
        return;
      }
      const r = delegate.apply(i, args);
      result = result.concat(toArray(r));
    });
    return result;
  };

  const classAction = (elements, method, names) => {
    (isArray(names) ? names : (names && names.split(rspace)) || []).forEach(
      n => {
        arrayFunction(elements, function() {
          n && this.classList[method](n);
        });
      }
    );
  };

  const insertAction = (elements, children, reverse, action) => {
    children = toArray(children);
    children = reverse ? children.reverse() : children;
    let i = 0;
    arrayFunction(elements, function() {
      // If we are adding to multiple elements we need to clone
      let clones = i > 0 ? children.map(c => c.cloneNode(true)) : children;
      clones.forEach(c => action.call(this, c));
      i++;
    });
  };

  const sibling = (element, dir, expression) => {
    // eslint-disable-next-line no-empty
    while ((element = element[dir]) && !element.matches(expression)) {}
    return element;
  };

  const doBind = (once, elements, events, selector, handler) => {
    // Handle missing selector param
    const hasSelector = isString(selector);
    if (!hasSelector && !isFunc(handler)) {
      handler = selector;
    }

    arrayFunction(elements, function() {
      let el = this;
      arrayFunction(events, function() {
        Handler.on(
          el,
          this,
          hasSelector ? selector : null,
          handler,
          hasSelector ? false : true,
          once
        );
      });
    });
  };

  // Handles the adding and removing of events.
  // Events can be assigned to the element or delegated to a parent
  const Handler = (() => {
    const handlerMap = new WeakMap();
    let i = 0;

    const getHandlers = function(element, event, set) {
      // Set if the event doesn't exist
      if (set) {
        if (!handlerMap.has(element)) {
          let handlers = {
            [event]: {}
          };
          handlerMap.set(element, handlers);
        } else if (!handlerMap.get(element)[[event]]) {
          let handlers = handlerMap.get(element);
          handlers[[event]] = {};
          handlerMap.set(element, handlers);
        }

        return handlerMap.get(element)[[event]];
      }

      // Get handlers matching type or namespace partial
      if (handlerMap.has(element)) {
        const namespaces = rtypenamespace.exec(event) || [];

        let handlers = handlerMap.get(element);
        for (const h of keys(handlers)) {
          let len = namespaces.length;
          while (len--) {
            if (
              namespaces[len] &&
              new RegExp(`^${escape(h)}$`).exec(namespaces[len])
            ) {
              return handlers[h];
            }
          }
        }
      }

      return {};
    };

    // Bubbled event handling, one-time running
    const handlerDelegate = (
      selector,
      handler,
      element,
      once,
      eventName,
      event
    ) => {
      if (!handler) {
        return;
      }

      if (once) {
        Handler.off(element, eventName);
      }

      if (selector) {
        let target = event.target;
        while (
          target &&
          target !== element &&
          target.matches &&
          !target.matches(selector)
        ) {
          target = target.parentNode;
        }

        if (target && target.matches && target.matches(selector)) {
          handler.call(target, event);
        }
      } else {
        handler.call(element, event);
      }
    };

    return {
      on: function(element, event, selector, handler, capture, once) {
        // Store the full namespaced event binding only the type
        const type = event.split(".")[0];
        handler = handlerDelegate.bind(
          element,
          selector,
          handler,
          element,
          once,
          event
        );
        element.addEventListener(type, handler, capture);
        getHandlers(element, event, true)[i++] = {
          type: type,
          handler: handler,
          capture: capture
        };
      },
      off: function(element, event) {
        let handlers = getHandlers(element, event, false);
        keys(handlers).forEach(l => {
          let h = handlers[l];
          element.removeEventListener(h.type, h.handler, h.capture);
          delete handlers[l];
        });
      }
    };
  })();

  /**
   * Specifies helper methods for traversing and manipulating the Document Object Model (DOM)
   * in an efficient manner
   * @class DUM
   */
  class DUM {
    /**
     * Specifies a function to execute when the element of DOM is fully loaded.
     * @param {HTMLElement | HTMLDocument} context The context to monitor the state of; defaults to `document` if not set
     * @returns {Promise}
     * @memberof DUM
     */
    ready(context) {
      context = context || d;

      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        if (context.readyState !== "loading") {
          resolve();
        } else {
          Handler.on(
            context,
            "DOMContentLoaded",
            null,
            () => resolve(),
            true,
            true
          );
        }
      });
    }

    /**
     * Returns a reference to the first object with the specified value of the `id` or `name` attribute.
     * @param {string} id
     * @returns {HTMLElement | null}
     * @memberof DUM
     */
    id(id) {
      return d.getElementById(id);
    }

    /**
     * Returns the first element that is a descendant of the element on which it is invoked that matches the
     * specified group of selectors.
     * @param {string} expression The selector expression; this must be valid CSS syntax
     * @param {HTMLElement | HTMLDocument} context The context to search within; defaults to `document` if not set
     * @returns {HTMLElement | null}
     * @memberof DUM
     */
    query(expression, context) {
      if ((arguments.length == 2 && !context) || !expression) {
        return null;
      }

      return isString(expression)
        ? (context || d).querySelector(expression)
        : expression || null;
    }

    /**
     * Returns a list of the elements within the element or collection of elements (using depth-first pre-order traversal of the elements nodes)
     * that match the specified group of selectors. The object returned is different from `querySelectorAll` in that it is a true array.
     * @param {string} expression The selector expression; this must be valid CSS syntax
     * @param {HTMLElement | HTMLElement[] | HTMLDocument} contexts The element or collection of elements to search within; defaults to `document` if not set
     * @returns {HTMLElement[]}
     * @memberof DUM
     */
    queryAll(expression, contexts) {
      if (expression instanceof Node || expression instanceof Window) {
        return [expression];
      }

      if (isArray(contexts) && !contexts.length) {
        return [];
      }

      return arrayFunction(contexts || document, function() {
        return toArray(
          isString(expression)
            ? this.querySelectorAll(expression)
            : expression || []
        );
      });
    }

    /**
     * Returns the element matching the optional expression immediately prior to the specified one in its parent's children list,
     * or `null` if the specified element is the first one in the list.
     * @param {HTMLElement} element The element to search from
     * @param {string} expression The optional selector expression; this must be valid CSS syntax
     * @returns {HTMLElement | null}
     * @memberof DUM
     */
    prev(element, expression) {
      return expression
        ? sibling(element, "previousElementSibling", expression)
        : element.previousElementSibling;
    }

    /**
     * Returns the element matching the optional expression immediately following to the specified one in its parent's children list,
     * or `null` if the specified element is the last one in the list.
     * @param {HTMLElement} element The element to search from
     * @param {string} expression The optional selector expression; this must be valid CSS syntax
     * @returns {HTMLElement | null}
     * @memberof DUM
     */
    next(element, expression) {
      return expression
        ? sibling(element, "nextElementSibling", expression)
        : element.nextElementSibling;
    }

    /**
     * Returns an ordered collection of DOM elements that are children of the given element or element collection.
     * If there are no element children, then children contains no elements and has a length of 0.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements to search within
     * @param {string} expression The optional selector expression; this must be valid CSS syntax
     * @returns {HTMLElement[]}
     * @memberof DUM
     */
    children(elements, expression) {
      return arrayFunction(elements, function() {
        return toArray(this && this.children).filter(c =>
          expression ? c.matches(expression) : true
        );
      });
    }

    /**
     * Creates an instance of an element for the specified tag
     * @param {string} type
     * @returns {HTMLElement}
     * @memberof DUM
     */
    create(type) {
      return d.createElement(type);
    }

    /**
     * Creates an instance of an element or elements from the given HTML.
     * @param {string} html
     * @param {string | undefined} selector The optional selector expression; this must be valid CSS syntax or `undefined`
     * @returns {HTMLElement| HTMLElement[]}
     * @memberof DUM
     */
    fromHtml(html, selector) {
      var result = selector
        ? this.queryAll(selector, parseHtml(html))
        : this.children(parseHtml(html).body);

      return result.length === 1 ? result[0] : result;
    }

    /**
     * Prepends the child or collection of child elements to the element or collection of elements.
     * The child collection is reversed before prepending to ensure order is correct.
     * If prepending to multiple elements the nodes are deep cloned for successive elements.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements to prepend within
     * @param {HTMLElement | HTMLElement[]} children The child or collection of child elements
     * @memberof DUM
     */
    prepend(elements, children) {
      insertAction(elements, children, true, function(c) {
        this.insertBefore(c, this.firstChild);
      });
    }

    /**
     * Appends the child or collection of child elements to the element or collection of elements
     * If appending to multiple elements the nodes are deep cloned for successive elements.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements to prepend within
     * @param {HTMLElement | HTMLElement[]} children The child or collection of child elements
     * @memberof DUM
     */
    append(elements, children) {
      insertAction(elements, children, false, function(c) {
        this.appendChild(c);
      });
    }

    /**
     * Detaches an element from the DOM returning the result. Any event handlers bound to the element are still present.
     * @param {HTMLElement} element The element to detach
     * @returns {HTMLElement}
     * @memberof DUM
     */
    detach(element) {
      element && element.remove();
      return element;
    }

    /**
     * Returns a value indicating whether the specified class value exists in class attribute of the element.
     * @param {HTMLElement} element The element to search within
     * @param {string} name The class name
     * @returns {boolean}
     * @memberof DUM
     */
    hasClass(element, name) {
      return element.classList.contains(name);
    }

    /**
     * Add the specified class, space-separated class values or class array to the given element or collection of elements.
     * If these classes already exist in attribute of the element, then they are ignored.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} names
     * @memberof DUM
     */
    addClass(elements, names) {
      classAction(elements, "add", names);
    }

    /**
     * Removes the specified class, space-separated class values or class array from the given element or collection of elements.
     * If these classes already exist in attribute of the element, then they are ignored.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} names
     * @memberof DUM
     */
    removeClass(elements, names) {
      classAction(elements, "remove", names);
    }

    /**
     * Toggles the specified class, space-separated class values or class array to or from the given element or collection of elements.
     * If these classes already exist in attribute of the element, then they are ignored.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} names
     * @memberof DUM
     */
    toggleClass(elements, names) {
      classAction(elements, "toggle", names);
    }

    /**
     * Returns the value of a specified attribute on the element. If the given attribute does not exists the value
     * returned will be `null`.
     * @param {HTMLElement} element The element
     * @param {string} name The string specifying the attribute whose value to return
     * @returns {HTMLElement | null}
     * @memberof DUM
     */
    getAttr(element, name) {
      return element && element.getAttribute(name);
    }

    /**
     * Sets the collection of attribute values on the element or collection of elements.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {object} values The object contining the collection of key-value attribute pairs to set
     * @memberof DUM
     */
    setAttr(elements, values) {
      arrayFunction(elements, function() {
        keys(values).forEach(k => this.setAttribute(k, values[k]));
      });
    }

    /**
     * Removes specified attribute, space-separated attribute names or attribute array from the element or collection of elements.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} names The name or array of names to remove
     * @memberof DUM
     */
    removeAttr(elements, names) {
      (isArray(names) ? names : names.split(rspace)).forEach(n => {
        arrayFunction(elements, function() {
          this.removeAttribute(n);
        });
      });
    }

    /**
     * Sets the collection of style values on the element or collection of elements.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {object} values The object contining the collection of key-value attribute pairs to set
     * @memberof DUM
     */
    setStyle(elements, values) {
      arrayFunction(elements, function() {
        keys(values).forEach(k => {
          if (k in this.style) {
            this.style[k] = values[k];
          } else {
            this.style.setProperty(k, values[k]);
          }
        });
      });
    }

    /**
     * Empties the contents of the given element or collection of elements.
     * Any event handlers bound to the element contents are automatically garbage collected.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @memberof DUM
     */
    empty(elements) {
      arrayFunction(elements, function() {
        let child = this;
        while ((child = this.firstChild)) {
          child.remove(); // Events are automatically garbage collected
        }
      });
    }

    /**
     * Adds an event listener to the given element or collection of elements. Events can be delegated to a parent by passing a CSS selector.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} events The event or collection of event names
     * @param {string | undefined} selector The optional selector expression; this must be valid CSS syntax or `undefined`
     * @param {Function} handler The function to call when the event is triggered
     * @memberof DUM
     */
    on(elements, events, selector, handler) {
      doBind(false, elements, events, selector, handler);
    }

    /**
     * Adds an event listener to the given element or collection of elements that is immediately unbound when the event is triggered.
     * Events can be delegated to a parent by passing a CSS selector.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} events The event or collection of event names
     * @param {string | undefined} selector The selector expression; this must be valid CSS syntax or `undefined`
     * @param {Function} handler The function to call when the event is triggered
     * @memberof DUM
     */
    one(elements, events, selector, handler) {
      doBind(true, elements, events, selector, handler);
    }

    /**
     * Removes any event listener matching the given name or names.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string | string[]} events The event name or names, previously bound using `on`.
     * @memberof DUM
     */
    off(elements, events) {
      arrayFunction(elements, function() {
        let el = this;
        arrayFunction(events, function() {
          Handler.off(el, this);
        });
      });
    }

    /**
     * Triggers an event returning a value indicating whether the event has been cancelled.
     * By default the event bubbles and is cancelable.
     * @param {HTMLElement | HTMLElement[]} elements The element or collection of elements
     * @param {string} event The name of the event to trigger
     * @param {object} detail Optional and defaulting to `null` this contains any event dependant value associated with the event
     * @returns {boolean} A value indicating whether at least one of the bound event handlers called `Event.preventDefault()`
     * @memberof DUM
     */
    trigger(elements, event, detail) {
      const namespaces = rtypenamespace.exec(event) || [];
      detail = detail || {};
      detail.namespace = namespaces[2] || "";
      const params = { bubbles: true, cancelable: true, detail: detail };
      return (
        arrayFunction(elements, function() {
          return this.dispatchEvent(new CustomEvent(namespaces[1], params));
        }).length || false
      );
    }
  }

  return (w.$d = w.DUM = new DUM());
})(window, document);

/* harmony default export */ __webpack_exports__["default"] = ($d);


/***/ }),

/***/ "./src/js/modal.js":
/*!*************************!*\
  !*** ./src/js/modal.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "./src/js/core.js");




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

})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_2__["default"], _base__WEBPACK_IMPORTED_MODULE_1__["default"], window, document);

/* harmony default export */ __webpack_exports__["default"] = (RbpModal);

/***/ }),

/***/ "./src/js/swiper.js":
/*!**************************!*\
  !*** ./src/js/swiper.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");


const Swiper = (($d, w) => {

    const support = {
        touchEvents: "ontouchstart" in w || w.DocumentTouch && document instanceof w.DocumentTouch,
        pointerEvents: w.PointerEvent
    };

    const pointerStart = "pointerdown",
        pointerMove = "pointermove",
        pointerEnd = ["pointerup", "pointerout", "pointercancel", "pointerleave", "lostpointercapture"];

    const touchStart = "touchstart",
        touchMove = "touchmove",
        touchEnd = ["touchend", "touchleave", "touchcancel"];

    const mouseStart = "mousedown",
        mouseMove = "mousemove",
        mouseEnd = ["mouseup", "mouseleave"];

    const getTouchEvents = () => {
        let eend = mouseEnd,
            emove = mouseMove,
            estart = mouseStart;

        // Keep the events separate since support could be crazy.
        if (support.touchEvents) {
            estart = touchStart;
            emove = touchMove;
            eend = touchEnd;
        } else if (support.pointerEvents) {
            estart = pointerStart;
            emove = pointerMove;
            eend = pointerEnd;
        }

        return {
            start: estart,
            move: emove,
            end: eend
        };
    };

    const getSwipeEvents = ns => ({
        swipeStart: `swipestart${ns}`,
        swipeMove: `swipemove${ns}`,
        swipeEnd: `swipeend${ns}`
    });

    const bindTouchEvents = swiper => {

        // Enable extended touch events on supported browsers before any touch events.
        if (support.pointerEvents) {
            swiper.elements.forEach(e => {
                $d.setStyle(e, { touchAction: swiper.touchAction });
            });
        }

        swiper.elements.forEach(element => {

            let delta = {},
                start = {};

            const onMove = event => {

                // Normalize the variables.
                let isMouse = event.type === "mousemove",
                    isPointer = event.type !== "touchmove" && !isMouse;

                // Only left click allowed.
                if (isMouse && event.which !== 1) {
                    return;
                }

                // One touch allowed.
                if (event.touches && event.touches.length > 1) {
                    return;
                }

                // Ensure swiping with one touch and not pinching.
                if (event.scale && event.scale !== 1) {
                    return;
                }

                /* eslint-disable no-nested-ternary */
                const dx = (isMouse ? event.pageX : isPointer ? event.clientX : event.touches[0].pageX) - start.x;
                const dy = (isMouse ? event.pageY : isPointer ? event.clientY : event.touches[0].pageY) - start.y;
                /* eslint-enable no-nested-ternary */

                /* eslint-disable sort-vars, no-extra-parens */
                let doSwipe = false,
                    rectangle = element.getBoundingClientRect(),
                    percentX = Math.abs(parseFloat((dx / rectangle.width) * 100)) || 100,
                    percentY = Math.abs(parseFloat((dy / rectangle.height) * 100)) || 100;
                /* eslint-enable sort-vars, no-extra-parens */

                // Work out whether to do a scroll based on the sensitivity limit.
                switch (swiper.touchAction) {
                    case "pan-x":
                        if (Math.abs(dy) > Math.abs(dx)) {
                            event.preventDefault();
                        }
                        doSwipe = Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > swiper.sensitivity && percentY < 100;
                        break;
                    case "pan-y":
                        if (Math.abs(dx) > Math.abs(dy)) {
                            event.preventDefault();
                        }
                        doSwipe = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swiper.sensitivity && percentX < 100;
                        break;
                    default:
                        event.preventDefault();
                        doSwipe = Math.abs(dy) > swiper.sensitivity || Math.abs(dx) > swiper.sensitivity && percentX < 100 && percentY < 100;
                        break;
                }

                event.stopPropagation();
                if (!doSwipe || !$d.trigger(element, swiper.swipeEvents.swipeMove, { delta: { x: dx, y: dy } })) {
                    return;
                }

                // Measure change in x and y.
                delta = {
                    x: dx,
                    y: dy
                };
            };

            const onEnd = () => {
                // Measure duration
                const duration = Number(new Date()) - start.time;

                // Determine if slide attempt triggers slide.
                if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {

                    // Set the direction and return it.
                    /* eslint-disable sort-vars */
                    const horizontal = delta.x < 0 ? "left" : "right",
                        vertical = delta.y < 0 ? "up" : "down",
                        direction = Math.abs(delta.x) > Math.abs(delta.y) ? horizontal : vertical;
                    /* eslint-disable sort-vars */

                    if (!$d.trigger(element, swiper.swipeEvents.swipeEnd, { delta: delta, direction: direction, duration: duration })) {
                        return;
                    }
                }

                // Disable the touch events till next time.
                $d.off(element, swiper.touchEvents.move);
                $d.off(element, swiper.touchEvents.end);
            };

            const onStart = event => {
                // Normalize the variables.
                const isMouse = event.type === "mousedown";
                const isPointer = event.type !== "touchstart" && !isMouse;

                event.stopPropagation();

                // Measure start values.
                start = {
                    // Get initial touch coordinates.
                    /* eslint-disable no-nested-ternary */
                    x: isMouse ? event.pageX : isPointer ? event.clientX : event.touches[0].pageX,
                    y: isMouse ? event.pageY : isPointer ? event.clientY : event.touches[0].pageY,
                    /* eslint-enable no-nested-ternary */

                    // Store time to determine touch duration.
                    time: Number(new Date())
                };

                if (!$d.trigger(element, swiper.swipeEvents.swipeStart, { start: start })) {
                    return;
                }

                // Reset delta and end measurements.
                delta = { x: 0, y: 0 };

                // Attach touchmove and touchend listeners.
                $d.on(element, swiper.touchEvents.move, null, onMove);
                $d.on(element, swiper.touchEvents.end, null, onEnd);
            };

            $d.off(element, swiper.touchEvents.start);
            $d.on(element, swiper.touchEvents.start, null, onStart);
        });
    };

    class Swiper {
        constructor(selector, namespace, touchAction, sensitivity) {
            this.selector = selector;
            this.namespace = namespace ? `.${namespace}` : "";
            this.touchAction = touchAction || "none";
            this.sensitivity = sensitivity || 5;
            this.swipeEvents = getSwipeEvents(this.namespace);
            this.touchEvents = getTouchEvents();
            this.elements = $d.queryAll(selector);
            bindTouchEvents(this);
        }

        onSwipeStart(element, handler) {
            $d.on(this.elements, this.swipeEvents.swipeStart, null, handler);
            return this;
        }

        onSwipeMove(handler) {
            $d.on(this.elements, this.swipeEvents.swipeMove, null, handler);
            return this;
        }

        onSwipeEnd(handler) {
            $d.on(this.elements, this.swipeEvents.swipeEnd, null, handler);
            return this;
        }

        destroy() {
            $d.off(this.elements, this.swipeEvents.swipeStart);
            $d.off(this.elements, this.swipeEvents.swipeMove);
            $d.off(this.elements, this.swipeEvents.swipeEnd);
        }
    }

    return Swiper;

})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], window);

/* harmony default export */ __webpack_exports__["default"] = (Swiper);

/***/ }),

/***/ "./src/js/tablelist.js":
/*!*****************************!*\
  !*** ./src/js/tablelist.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "./src/js/core.js");




const RbpTableList = (($d, core, base) => {

    const defaults = {};
    class RbpTableList extends base {

        constructor(element, options) {
            super(element, defaults, options, "tablelist");

            this.eadd = "add.rbp";
            this.eadded = "added.rbp";
            this.isAdded = false;

            $d.addClass(this.element, "table-list");
            $d.setAttr(this.element, { "aria-role": "grid" });

            this.thead = $d.children(this.element, "thead");
            this.tfoot = $d.children(this.element, "tfoot");
            this.tbody = $d.children(this.element, "tbody");
            this.hasHeader = this.thead.length;

            this.headerColumns = $d.queryAll("th", this.thead);
            this.footerColumns = $d.queryAll("th", this.tfoot);
            this.footerColumns.forEach(f => $d.setAttr(f, { "aria-role": "columnheader", "aria-hidden": "false" }));
            this.bodyRows = $d.children(this.tbody, "tr");
            $d.setAttr(this.bodyRows, { "aria-role": "row" });

            if (!this.headerColumns.length) {
                this.hasHeader = false;
                $d.addClass(this.element, "no-thead");
                this.headerColumns = $d.children(this.bodyRows, "[scope=row]");
            }
            this.headerColumns.forEach(h => $d.setAttr(h, { "aria-role": "columnheader", "aria-hidden": "false" }));

            this.add();
        }

        add() {

            if (this.isAdded || !$d.trigger(this.element, this.eadd)) {
                return;
            }

            this.isAdded = true;
            this.bodyRows.forEach(r => {
                let selector = this.hasHeader ? "th, td" : "td";
                $d.queryAll(selector, r).forEach((t, i) => {

                    let headerColumn = selector === "td" ? $d.prev(t, "[scope=row]") : this.headerColumns[i],
                        headerId = headerColumn.id || (headerColumn.id = core.uid()),
                        theadAttribute = headerColumn.innerText;

                    $d.setAttr(t, { "data-thead": theadAttribute, "aria-role": "gridcell", "aria-describedby": headerId });

                    if (this.tfoot.length) {
                        let footerColumn = this.footerColumns[i],
                            footerId = footerColumn.id || (footerColumn.id = core.uid()),
                            tfootAttribute = footerColumn.innerText;

                        $d.setAttr(t, { "data-tfoot": tfootAttribute, "aria-role": "gridcell", "aria-describedby": footerId });
                    }
                });
            });

            const complete = () => { $d.trigger(this.element, this.eadded); };

            core.onTransitionEnd(this.element, complete);
            core.redraw(this.element);
            $d.addClass(this.element, "fade-in");
        }
    }

    // Register plugin and data-api event handler and return
    return core.registerDataApi(RbpTableList, "tablelist", null);

})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_2__["default"], _base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RbpTableList);

/***/ }),

/***/ "./src/js/tabs.js":
/*!************************!*\
  !*** ./src/js/tabs.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dum */ "./src/js/dum.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/js/base.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "./src/js/core.js");




const RbpTabs = (($d, core, base) => {

    const defaults = {};
    class RbpTabs extends base {

        constructor(element, options) {
            super(element, defaults, options, "tabs");

            this.eshow = "show.rbp";
            this.eshown = "shown.rbp";

            this.tabbing = false;

            this.tablist = $d.children(this.element, "ul")[0];
            this.tabpanes = $d.children(this.element, ":not(ul)");
            this.triggers = $d.children(this.tablist);

            // A11y.
            let id = core.uid(),
                activeIndex = this.triggers.findIndex(l => $d.query("[aria-selected=true]", l)),
                hasActive = activeIndex > -1;

            $d.setAttr(this.tablist, { "role": "tablist" });
            this.triggers.forEach((t, i) => {

                $d.setAttr(t, { "role": "presentation" });

                let tab = $d.query("a", t),
                    isActive = (hasActive && i === activeIndex) || (!hasActive && i === 0);

                $d.setAttr(tab, {
                    "role": "tab",
                    "id": `${id}-${i}`,
                    "aria-controls": `${id}-${i}`,
                    "aria-selected": isActive ? true : false,
                    "tabindex": 0
                });

                $d.setAttr(this.tabpanes[i], {
                    "role": "tabpanel",
                    "id": `${id}-${i}`,
                    "aria-labelledby": `${id}-${i}`,
                    "tabindex": isActive ? 0 : -1
                });
            });

            const selector = "ul[role=tablist] > li > [role=tab]";
            $d.on(this.element, "click", selector, this.click.bind(this));
            $d.on(this.element, "keydown", selector, this.keydown.bind(this));
        }

        show(position) {

            let activePosition = this.triggers.findIndex(l => $d.query("[aria-selected=true]", l));
            if (position > (this.triggers.length - 1) || position < 0) {

                return false;
            }

            if (activePosition === position) {
                return false;
            }

            this.tab(activePosition, position);
        }

        tab(activePosition, postion) {

            if (this.tabbing || !$d.trigger(this.element, this.eShow)) {
                return;
            }

            this.tabbing = true;

            let nextTab = this.triggers[postion],
                currentPane = this.tabpanes[activePosition],
                nextPane = this.tabpanes[postion];

            $d.setAttr($d.children(this.triggers, "a"), { "aria-selected": false });
            $d.children(nextTab, "a").forEach(a => {
                $d.setAttr(a, { "aria-selected": true }); a.focus();
            });

            // Do some class shuffling to allow the transition.
            $d.addClass(currentPane, "fade-out fade-in");
            $d.setAttr(nextPane, { "tabIndex": 0 })
            $d.addClass(nextPane, "fade-out");

            // Shouldn't this be simply currentPane?
            let inPanes = this.tabpanes.filter(p => $d.hasClass(p, "fade-in"));

            $d.setAttr(inPanes, { "tabIndex": -1 })
            $d.removeClass(inPanes, "fade-in");

            const complete = () => {
                this.tabbing = false;
                $d.removeClass(this.tabpanes, "fade-out fade-in");
                $d.trigger(this.element, this.eshown, { relatedTarget: nextPane })
            };

            core.onTransitionEnd(nextPane, complete);
            core.redraw(nextPane)
            $d.addClass(nextPane, "fade-in");
        }

        click(event) {

            event.preventDefault();
            event.stopPropagation();

            this.show(this.triggers.findIndex(l => $d.query("a", l).id === event.target.id));
        }

        keydown(event) {

            let which = event.which;

            // Ignore anything but left and right.
            if (which === core.keys.SPACE || which === core.keys.LEFT || which === core.keys.RIGHT) {

                event.preventDefault();
                event.stopPropagation();

                let length = this.triggers.length,
                    index = this.triggers.findIndex(l => $d.query("a", l).id === event.target.id);

                if (which === core.keys.SPACE) {
                    this.show(index);
                    return;
                }

                // Select the correct index.
                index = which === core.keys.LEFT ? (this.rtl ? index + 1 : index - 1) : (this.rtl ? index - 1 : index + 1);

                // Ensure that the index stays within bounds.
                if (index === length) {
                    index = 0;
                }

                if (index < 0) {
                    index = length - 1;
                }

                this.show(index);
            }
        }
    }

    // Register plugin and data-api event handler and return
    return core.registerDataApi(RbpTabs, "tabs", null);

})(_dum__WEBPACK_IMPORTED_MODULE_0__["default"], _core__WEBPACK_IMPORTED_MODULE_2__["default"], _base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (RbpTabs);

/***/ }),

/***/ "./src/sass/app.scss":
/*!***************************!*\
  !*** ./src/sass/app.scss ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!*************************************************!*\
  !*** multi ./src/js/app.js ./src/sass/app.scss ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./src/js/app.js */"./src/js/app.js");
module.exports = __webpack_require__(/*! ./src/sass/app.scss */"./src/sass/app.scss");


/***/ })

/******/ });
//# sourceMappingURL=responsive.js.map