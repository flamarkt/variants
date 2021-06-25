import LinkButton from 'flarum/common/components/LinkButton';
import AbstractList from 'flamarkt/core/backoffice/components/AbstractList';
import Product from 'flamarkt/core/common/models/Product';

export default class ProductVariantList extends AbstractList {
    head() {
        const columns = super.head();

        columns.add('title', m('th', 'Title'), 20);
        columns.add('price', m('th', 'Price'), 10);

        return columns;
    }

    columns(product: Product) {
        const columns = super.columns(product);

        columns.add('title', m('td', m('input.FormControl', {
            type: 'text',
            value: product.title(),
            //TODO: save value
        })), 20);

        columns.add('price', m('td', m('input.FormControl', {
            type: 'number',
            value: product.price(),
            //TODO: save value
        })), 10);

        return columns;
    }

    actions(product: Product) {
        const actions = super.actions(product);

        actions.add('edit', LinkButton.component({
            className: 'Button Button--icon',
            icon: 'fas fa-pen',
            href: app.route.product(product),
        }));

        return actions;
    }
}
