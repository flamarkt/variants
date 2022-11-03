import app from 'flamarkt/backoffice/backoffice/app';
import ProductList from 'flamarkt/core/backoffice/components/ProductList';
import ProductIndexPage from 'flamarkt/core/backoffice/pages/ProductIndexPage';
import ProductShowPage from 'flamarkt/core/backoffice/pages/ProductShowPage';
import Product from 'flamarkt/core/common/models/Product';
import ProductListState from 'flamarkt/core/common/states/ProductListState';
import {extend} from 'flarum/common/extend';
import Model from 'flarum/common/Model';
import Button from 'flarum/common/components/Button';
import LinkButton from 'flarum/common/components/LinkButton';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import ProductVariantList from './components/ProductVariantList';
import {backoffice} from './compat';

export {
    backoffice,
};

app.initializers.add('flamarkt-variants', () => {
    Product.prototype.variantMaster = Model.hasOne('variantMaster');

    extend(ProductList.prototype, 'head', function (columns) {
        columns.add('balance', m('th', 'Variants'));
    });

    extend(ProductList.prototype, 'columns', function (columns, product) {
        let label: string;

        if (product.attribute('isVariantChild')) {
            label = 'Child';
        } else {
            label = product.attribute('isVariantMaster') ? 'Yes' : 'No';
        }

        columns.add('balance', m('td', label));
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
            const master = this.product!.variantMaster();

            fields.add('variant-child-toggle', m('.Form-group', [
                m('label', 'Variant Child'),
                Switch.component({
                    state: this.variantChildrenAttached,
                    onchange: (value: boolean) => {
                        this.variantChildrenAttached = value;
                        this.dirty = true;
                    },
                }, 'Attached as child'),
                master ? LinkButton.component({
                    className: 'Button',
                    href: app.route.product(master),
                }, 'Edit Master') : null,
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

    extend(ProductIndexPage.prototype, 'filters', function (items) {
        const filter = this.list.params.filter || {};

        items.add('variants', Select.component({
            value: filter.allVariantTypes ? 'all' : (filter.isVariant ? 'with' : (filter['-isVariant'] ? 'without' : 'default')),
            options: {
                default: 'Variants: default',
                with: 'With variants only',
                without: 'Without variants only',
                all: 'All including children',
            },
            onchange: (value: string) => {
                this.list.params.filter = filter;

                // TODO: compatibility or feedback of incompatibility with search query
                switch (value) {
                    case 'default':
                        delete this.list.params.filter.isVariant;
                        delete this.list.params.filter['-isVariant'];
                        delete this.list.params.filter.allVariantTypes;
                        break;
                    case 'with':
                        this.list.params.filter.isVariant = '1';
                        delete this.list.params.filter['-isVariant'];
                        delete this.list.params.filter.allVariantTypes;
                        break;
                    case 'without':
                        delete this.list.params.filter.isVariant;
                        this.list.params.filter['-isVariant'] = '1';
                        delete this.list.params.filter.allVariantTypes;
                        break;
                    case 'all':
                        delete this.list.params.filter.isVariant;
                        delete this.list.params.filter['-isVariant'];
                        this.list.params.filter.allVariantTypes = '1';
                        break;
                }

                this.list.refresh();
            }
        }), 80);
    });
});
