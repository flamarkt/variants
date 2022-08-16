import ProductList from 'flamarkt/core/backoffice/components/ProductList';
import ProductShowPage from 'flamarkt/core/backoffice/pages/ProductShowPage';
import Product from 'flamarkt/core/common/models/Product';
import ProductListState from 'flamarkt/core/common/states/ProductListState';
import {extend} from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import ProductVariantList from './components/ProductVariantList';
import {backoffice} from './compat';

export {
    backoffice,
};

app.initializers.add('flamarkt-variants', () => {
    extend(ProductList.prototype, 'head', function (columns) {
        columns.add('balance', m('th', 'Variants'));
    });

    extend(ProductList.prototype, 'columns', function (columns, product) {
        columns.add('balance', m('td', product.attribute('isVariantMaster') ? 'Yes' : 'No'));
    });

    extend(ProductShowPage.prototype, 'oninit', function () {
        this.variantChildrenAttached = true; // We can always start with true. We'll only react if it's set to false
    });

    extend(ProductShowPage.prototype, 'show', function () {
        this.isVariantMaster = this.product!.attribute('isVariantMaster');

        this.variantProductListState = new ProductListState({
            filter: {
                variantOf: this.product!.id(),
            },
        });
        if (this.product!.attribute('isVariantMaster')) {
            this.variantProductListState.refresh();
        }
    });

    extend(ProductShowPage.prototype, 'fields', function (fields) {
        if (this.product!.attribute('isVariantChild')) {
            fields.add('variant-child-toggle', m('.Form-group', [
                m('label', 'Variant Child'),
                Switch.component({
                    state: this.variantChildrenAttached,
                    onchange: (value: boolean) => {
                        this.variantChildrenAttached = value;
                        this.dirty = true;
                    },
                }, 'Attached as child'),
            ]));
        } else {
            fields.add('variant-master-toggle', m('.Form-group', [
                m('label', 'Variant Master'),
                Switch.component({
                    state: this.isVariantMaster,
                    onchange: (value: boolean) => {
                        this.isVariantMaster = value;
                        this.dirty = true;
                    },
                }, 'Make into master'),
            ]));
        }

        if (this.product!.attribute('isVariantMaster')) {
            fields.add('variants', m('.Form-group', [
                m('label', 'Variants'),
                m(ProductVariantList, {
                    state: this.variantProductListState,
                }),
                Button.component({
                    onclick: () => {
                        app.store.createRecord<Product>('flamarkt-products').save({
                            relationships: {
                                variantMaster: this.product,
                            },
                        }).then(product => {
                            this.variantProductListState.add(product);
                            m.redraw();
                        });
                    },
                }, 'Add'),
                Button.component({
                    onclick: () => {
                        this.variantProductListState.refresh();
                    },
                }, 'Refresh'),
            ]), -10);
        }
    });

    extend(ProductShowPage.prototype, 'data', function (data: any) {
        data.isVariantMaster = this.isVariantMaster;

        if (!this.variantChildrenAttached) {
            data.relationships = data.relationships || {};
            data.relationships.variantMaster = null;
        }
    });
});
