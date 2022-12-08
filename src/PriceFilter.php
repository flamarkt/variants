<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Product\Contract\PriceDriverInterface;
use Flamarkt\Core\Product\PriceManager;
use Flamarkt\Core\Product\Product;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;

class PriceFilter implements PriceDriverInterface
{
    public function __construct(
        protected PriceManager $manager
    )
    {
    }

    public function __invoke(Product $product, User $actor, ServerRequestInterface $request = null): ?int
    {
        // If no price has been explicitly selected for the child, use the parent values
        if ($product->variant_master_id && is_null($product->price)) {
            return $this->manager->price($product->variantMaster, $actor, $request);
        }

        return null;
    }
}
