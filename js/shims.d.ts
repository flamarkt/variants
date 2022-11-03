import ProductShowLayout from 'flamarkt/core/forum/layouts/ProductShowLayout';

declare module 'flamarkt/core/forum/layouts/ProductShowLayout' {
    export default interface ProductShowLayout {
        selectedVariantIndex: number
    }
}

import ProductShowPage from 'flamarkt/core/backoffice/pages/ProductShowPage';
import ProductListState from 'flamarkt/core/common/states/ProductListState';

declare module 'flamarkt/core/backoffice/pages/ProductShowPage' {
    export default interface ProductShowPage {
        variantChildrenAttached: boolean
        isVariantMaster: boolean
        variantProductListState: ProductListState
    }
}

declare module 'flamarkt/core/common/models/Product' {
    export default interface Product {
        variants: () => (Product | undefined)[] | false
        variantMaster: () => Product | false
    }
}
