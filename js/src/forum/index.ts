import {extend, override} from 'flarum/common/extend';
import LinkButton from 'flarum/common/components/LinkButton';
import ItemList from 'flarum/common/utils/ItemList';
import {forum} from './compat';
import Select from 'flarum/common/components/Select';
import Product from 'flamarkt/core/common/models/Product';
import ProductShowLayout from 'flamarkt/core/forum/layouts/ProductShowLayout';
import Model from 'flarum/common/Model';

export {
    forum,
};

app.initializers.add('flamarkt-variants', () => {
    Product.prototype.variants = Model.hasMany('variants');

    extend(ProductShowLayout.prototype, 'oninit', function (this: ProductShowLayout) {
        this.selectedVariantIndex = 0;
    });

    override(ProductShowLayout.prototype, 'product', function (this: ProductShowLayout, original: any) {
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

    extend(ProductShowLayout.prototype, 'priceSection', function (this: ProductShowLayout, items: ItemList) {
        // We need to access the base attr and not use the function parameter because the parameter has already been switched to a variant
        const masterProduct = this.attrs.product;

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
});
