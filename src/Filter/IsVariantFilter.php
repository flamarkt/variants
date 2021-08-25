<?php

namespace Flamarkt\Variants\Filter;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Illuminate\Database\Query\Builder;

class IsVariantFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'isVariant';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $this->constrain($filterState->getQuery(), $filterValue, $negate);
    }

    protected function constrain(Builder $query, $type, $negate)
    {
        if ($type === 'child') {
            $query->whereNull('flamarkt_products.variant_master_id', !$negate);
        } else {
            $query->where('flamarkt_products.is_variant_master', '=', $negate ? 0 : 1);
        }
    }
}
