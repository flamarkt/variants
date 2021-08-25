<?php

namespace Flamarkt\Variants\Filter;

use Flarum\Filter\FilterState;
use Flarum\Query\QueryCriteria;
use Illuminate\Database\Query\Builder;

class DefaultMutator
{
    public function __invoke(FilterState $filterState, QueryCriteria $criteria)
    {
        foreach ($filterState->getActiveFilters() as $activeFilter) {
            if ($activeFilter instanceof AllVariantsFilter) {
                // If the "all variants" filter is active, we won't apply the default filtering logic
                return;
            }
        }

        $filterState->getQuery()->where(function (Builder $builder) {
            $builder->where('flamarkt_products.is_variant_master', '=', 1)
                ->orWhere(function (Builder $builder) {
                    $builder->where('flamarkt_products.is_variant_master', '=', 0)
                        ->whereNull('flamarkt_products.variant_master_id');
                });
        });
    }
}
