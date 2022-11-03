import app from 'flarum/forum/app';
import {extend, override} from 'flarum/common/extend';
import {forum} from './compat';
import Select from 'flarum/common/components/Select';
import Product from 'flamarkt/core/common/models/Product';
import ProductShowLayout from 'flamarkt/core/forum/layouts/ProductShowLayout';
import ProductListItem from 'flamarkt/core/forum/components/ProductListItem';
import PriceLabel from 'flamarkt/core/common/components/PriceLabel';
import Model from 'flarum/common/Model';

export {
    forum,
};

app.initializers.add('flamarkt-variants', () => {
    Product.prototype.variants = Model.hasMany<Product>('variants');

    extend(ProductShowLayout.prototype, 'oninit', function () {
        this.selectedVariantIndex = 0;
    });

    override(ProductShowLayout.prototype, 'product', function (original: any) {
        const {product} = this.attrs;

        if (!product || !product.attribute('isVariantMaster')) {
            return original();
        }

        const variants = product.variants();

        const variantsCount = Array.isArray(variants) ? variants.length : 0;

        if (this.selectedVariantIndex > variantsCount - 1) {
            return null;
        }

        return variants[this.selectedVariantIndex];
    });

    extend(ProductShowLayout.prototype, 'priceSection', function (items) {
        // We need to access the base attr and not use the function parameter because the parameter has already been switched to a variant
        const masterProduct = this.attrs.product!;

        if (!masterProduct.attribute('isVariantMaster')) {
            return;
        }

        const variants = masterProduct.variants();

        if (!Array.isArray(variants)) {
            return;
        }

        const options: any = {};

        variants.forEach(variant => {
            options[variant.id()] = variant.title();
        });

        items.add('variants', Select.component({
            value: variants[this.selectedVariantIndex].id(),
            options,
            onchange: (id: string) => {
                this.selectedVariantIndex = variants.findIndex(variant => variant.id() === id);
            },
        }), 60);
    });

    extend(ProductListItem.prototype, 'items', function (items) {
        const {product} = this.attrs;

        if (!product.attribute('isVariantMaster')) {
            return;
        }

        const variants = product.variants();

        if (!Array.isArray(variants) || variants.length < 2) {
            return;
        }

        let minPrice: number | null = null;
        let maxPrice: number | null = null;

        variants.forEach(variant => {
            const value = variant.price();

            if (!value) {
                return;
            }

            if (minPrice === null || value < minPrice) {
                minPrice = value;
            }

            if (maxPrice === null || value > maxPrice) {
                maxPrice = value;
            }
        });

        // If there wasn't a single valid price, minPrice will be null
        // If the min anx max prices are same, no need to do anything
        // TODO: still if the price is the same, the parent might not have any price
        if (minPrice === null || minPrice === maxPrice) {
            return;
        }

        items.replace('price', m('span.ProductListItem--price', [
            m(PriceLabel, {
                value: minPrice,
            }),
            ' - ',
            m(PriceLabel, {
                value: maxPrice,
            }),
        ]))
    });
});
