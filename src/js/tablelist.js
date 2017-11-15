import $d from "./dum"
import RbpBase from "./base"
import RbpCore from "./core"

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

})($d, RbpCore, RbpBase);

export default RbpTableList;