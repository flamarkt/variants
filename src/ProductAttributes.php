<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Api\Serializer\ProductSerializer;
use Flamarkt\Core\Product\Product;

class ProductAttributes
{
    public function __invoke(ProductSerializer $serializer, Product $product): array
    {
        return [
            'isVariantMaster' => (bool)$product->is_variant_master,
            'isVariantChild' => !is_null($product->variant_master_id),
        ];
    }
}
