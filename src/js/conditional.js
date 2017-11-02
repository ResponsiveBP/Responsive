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
        errorHint: "<p>An error has occured.</p>"
    };

    class RbpConditional extends base {
        constructor(element, options) {
            super(element, defaults, options, "conditional");

            this.cache = {};
            this.currentGrid = null;
            this.currentTarget = null;
            this.loading = null;

            // Bind events.
            $d.on(window, "resize", core.debounce(this.resize.bind(this), 50));

            // First Run
            this.resize();
        }

        resize() { }

    }

    // Register plugin and data-api event handler
    core.fn.conditional = (e, o) => $d.queryAll(e).forEach(i => core.data(i).conditional || (core.data(i).conditional = new RbpConditional(i, o)));
    core.fn.on["conditional.data-api"] = $d.on(document, core.einit, null, () => {
        core.fn.conditional(`${["xxs", "xs", "s", "m", "l"].map(x => `[data-conditional-${x}]`).join(", ")}`);
    });

    $d.ready().then(() => { $d.trigger(document, core.einit); });

    return RbpConditional;

})($d, RbpCore, RbpBase);

export default RbpConditional;