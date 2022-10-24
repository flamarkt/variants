<?php

namespace Flamarkt\Variants;

use Flamarkt\Core\Api\Controller;
use Flamarkt\Core\Api\Serializer\BasicProductSerializer;
use Flamarkt\Core\Api\Serializer\ProductSerializer;
use Flamarkt\Core\Extend as FlamarktExtend;
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
        ->belongsTo('variantMaster', Product::class, 'variant_master_id')
        ->hasMany('variants', Product::class, 'variant_master_id'), // TODO: scope

    (new Extend\ApiSerializer(ProductSerializer::class))
        ->attributes(ProductAttributes::class)
        ->hasOne('variantMaster', ProductSerializer::class)
        ->hasMany('variants', ProductSerializer::class),

    (new Extend\ApiSerializer(BasicProductSerializer::class))
        ->attributes(BasicProductAttributes::class),

    (new Extend\Filter(ProductFilterer::class))
        ->addFilter(Filter\AllVariantsFilter::class)
        ->addFilter(Filter\IsVariantFilter::class)
        ->addFilter(Filter\VariantOfFilter::class)
        ->addFilterMutator(Filter\DefaultMutator::class),

    (new Extend\Event())
        ->listen(Saving::class, Listener\SavingProduct::class),

    (new Extend\ApiController(Controller\ProductIndexController::class))
        ->addInclude('variantMaster')
        ->addInclude('variants')
        ->addInclude('variants.thumbnail', CheckLibraryEnabled::class),
    (new Extend\ApiController(Controller\ProductShowController::class))
        ->addInclude('variantMaster')
        ->addInclude('variants')
        ->addInclude('variants.thumbnail', CheckLibraryEnabled::class),

    (new FlamarktExtend\Availability())
        ->globalFilter(AvailabilityFilter::class),
    (new FlamarktExtend\Price())
        ->globalFilter(PriceFilter::class),
];
