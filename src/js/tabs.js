import $d from "./dum"
import RbpBase from "./base"
import RbpCore from "./core"

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

})($d, RbpCore, RbpBase);

export default RbpTabs;