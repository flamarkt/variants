<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Api\Serializer\ProductSerializer;
use Flamarkt\Core\Product\Product;

class ProductAttributes
{
    public function __invoke(ProductSerializer $serializer, Product $product): array
    {
        $isMaster = (bool)$product->is_variant_master;
        $isChild = !$isMaster && !is_null($product->variant_master_id);

        $attributes = [
            'isVariantMaster' => $isMaster,
            'isVariantChild' => $isChild,
        ];

        // If some attributes are not defined, copy them over from the parent
        if ($isChild) {
            if (!$product->description) {
                $attributes += [
                    'description' => $product->variantMaster->description,
                    'descriptionHtml' => $product->variantMaster->formatDescription($serializer->getRequest()),
                ];
            }
        }

        return $attributes;
    }
}
