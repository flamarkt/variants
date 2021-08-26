<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Api\Serializer\BasicProductSerializer;
use Flamarkt\Core\Product\Product;
use Flarum\Http\SlugManager;

class BasicProductAttributes
{
    protected $slugManager;

    public function __construct(SlugManager $slugManager)
    {
        $this->slugManager = $slugManager;
    }

    public function __invoke(BasicProductSerializer $serializer, Product $product): array
    {
        if (is_null($product->variant_master_id)) {
            return [];
        }

        // Ideally the correct page routing should be done client-side, but since we only have master-as-page
        // for now, it's easier to just replace the slug server-side to point all children to the master
        // since the slug isn't used for anything else except routing
        return [
            'slug' => $this->slugManager->forResource(Product::class)->toSlug($product->variantMaster),
        ];
    }
}
