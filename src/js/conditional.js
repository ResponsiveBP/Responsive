import $d from "./dum"
import RbpBase from "./base"
import RbpCore from "./core"

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

})($d, RbpCore, RbpBase);

export default RbpConditional;