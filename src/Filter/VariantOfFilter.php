<?php

namespace Flamarkt\Variants\Filter;

use Flamarkt\Core\Product\ProductRepository;
use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Illuminate\Database\Query\Builder;

class VariantOfFilter implements FilterInterface
{
    public function __construct(
        protected ProductRepository $products
    )
    {
    }

    public function getFilterKey(): string
    {
        return 'variantOf';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $this->constrain($filterState->getQuery(), $filterValue, $negate);
    }

    protected function constrain(Builder $query, $productId, $negate)
    {
        $product = $this->products->findUidOrFail($productId);

        $query->where('flamarkt_products.variant_master_id', $negate ? '!=' : '=', $product->id);
    }
}
