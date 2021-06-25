<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Api\Serializer\ProductSerializer;
use Flamarkt\Core\Product\Event\Saving;
use Flamarkt\Core\Product\Product;
use Flamarkt\Core\Product\ProductFilterer;
use Flarum\Extend;

return [
    (new Extend\Frontend('backoffice'))
        ->js(__DIR__ . '/js/dist/backoffice.js'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Model(Product::class))
        ->belongsTo('variantParent', Product::class, 'variant_master_id')
        ->hasMany('variants', Product::class, 'variant_master_id'), // TODO: scope

    (new Extend\ApiSerializer(ProductSerializer::class))
        ->attributes(ProductAttributes::class)
        ->hasMany('variants', ProductSerializer::class),

    (new Extend\Filter(ProductFilterer::class))
        ->addFilter(Filter\IsVariantFilter::class)
        ->addFilter(Filter\VariantOfFilter::class),

    (new Extend\Event())
        ->listen(Saving::class, Listener\SavingProduct::class),
];
