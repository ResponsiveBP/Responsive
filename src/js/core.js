import $d from "./dum";

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
})($d, window, document);

export default RbpCore;
