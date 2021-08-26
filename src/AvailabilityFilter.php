<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Product\AvailabilityManager;
use Flamarkt\Core\Product\Contract\AvailabilityDriverInterface;
use Flamarkt\Core\Product\Product;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;

class AvailabilityFilter implements AvailabilityDriverInterface
{
    protected $manager;

    public function __construct(AvailabilityManager $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(Product $product, User $actor, ServerRequestInterface $request = null)
    {
        // If no driver has been explicitly selected for the child, use the parent values
        if ($product->variant_master_id && is_null($product->availability_driver)) {
            return $this->manager->availability($product->variantMaster, $actor, $request);
        }
    }
}
