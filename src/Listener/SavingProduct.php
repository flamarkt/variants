<?php

namespace Flamarkt\Variants\Listener;

use Flamarkt\Core\Product\Event\Saving;
use Flamarkt\Core\Product\ProductRepository;
use Flarum\Foundation\ValidationException;
use Illuminate\Support\Arr;

class SavingProduct
{
    protected $products;

    public function __construct(ProductRepository $products)
    {
        $this->products = $products;
    }

    public function handle(Saving $event)
    {
        $attributes = Arr::get($event->data, 'data.attributes') ?? [];

        if (Arr::exists($attributes, 'isVariantMaster')) {
            $event->actor->assertCan('backoffice');

            $event->product->is_variant_master = (bool)Arr::get($attributes, 'isVariantMaster');

            if (!$event->product->is_variant_master && $event->product->variants()->exists()) {
                throw new ValidationException([
                    'is_variant_master' => 'Cannot remove master status from a product that has variants',
                ]);
            }
        }

        $relationships = Arr::get($event->data, 'data.relationships') ?? [];

        if (Arr::exists($relationships, 'variantMaster')) {
            $event->actor->assertCan('backoffice');

            $product = $this->products->findUidOrFail(Arr::get($event->data, 'data.relationships.variantMaster.data.id'));

            $event->product->variantMaster()->associate($product);
        }
    }
}
