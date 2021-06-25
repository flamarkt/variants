<?php

namespace Flamarkt\Variants\Filter;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Illuminate\Database\Query\Builder;

class VariantOfFilter implements FilterInterface
{
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
        $query->where('flamarkt_products.variant_master_id', $negate ? '!=' : '=', $productId);
    }
}
