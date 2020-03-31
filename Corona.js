import Base from 'formiojs/components/_classes/component/Component';
import editForm from 'formiojs/components/editgrid/EditGrid'
import Components from 'formiojs/components/Components';
var InspireTree = require("inspire-tree");
var InspireTreeDOM = require("inspire-tree-dom");
function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

export default class Corona extends Base {
    constructor(component, options, data) {
        super(component, options, data);
    }

    static schema() {
        return Base.schema({
            type: 'Corona'
        });
    }

    static get builderInfo() {
        return {
            title: 'Corona',
            group: 'basic',
            icon: 'fa fa-table',
            weight: 70,
            documentation: 'http://help.form.io/userguide/#table',
            schema: Corona.schema()
        }
    }

    static get editForm() {
        return editForm.editForm;
    }

    /**
     * Render returns an html string of the fully rendered component.
     *
     * @param children - If this class is extendended, the sub string is passed as children.
     * @returns {string}
     */
    render(children) {
        // Calling super.render will wrap it html as a component.
        return super.render(`
   <div><div class='' ref='isc_tree'>Tree Component</div></div>
        `);
    }

    /**
     * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
     * elements to attach functionality to.
     *
     * @param element
     * @returns {Promise}
     */
    attach(element) {
        var superAttach = _get(_getPrototypeOf(Corona.prototype), "attach", this).call(this, element);
        // console.log('attach' + this.data.treeData)
        this.refs.isc_tree = 'single'
        this.loadRefs(element, {
            isc_tree: 'single',
        });
        return superAttach;
    }

    /**
     * Set the value of the component into the dom elements.
     *
     * @param value
     * @returns {boolean}
     */
    setValue(value) {
        // if (!value) return;
        this.loadData()
    }

    loadData() {

        setTimeout(() => {
            var values = this.evaluate(this.component.data.custom, {
                values: []
            }, 'values');
            // console.log(values);
            var tree = new InspireTree({
                selection: {
                    mode: 'checkbox'
                },
                search: "matcher",
                data: values
            });
            //handle check/uncheck items
            tree.on('node.state.changed', (node, prop, oldValue, newValue) => {
                if (prop != "checked") return;
                // console.log(node.text + " " + prop + " " + newValue)
                if (!this.dataValue) {
                    this.dataValue = [];
                }
                var nodeValue = node[this.component.valueProperty ? this.component.valueProperty : 'value'];
                if (!nodeValue) nodeValue = node;
                if (newValue) {
                    this.dataValue.push(nodeValue)
                }
                else {
                    this.dataValue.pop(nodeValue)
                }
                console.log(this.dataValue)
            });
            new InspireTreeDOM(tree, {
                target: this.refs.isc_tree
            });
        }, 0)

    }
}

// Register the component to the Formio.Components registry.
Components.addComponent('Corona', Corona);