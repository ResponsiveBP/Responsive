import $d from "./dum"
import RbpCore from "./core"

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

})($d, RbpCore);

export default RbpBase;