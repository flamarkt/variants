<?php

namespace Flamarkt\Variants\Filter;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class AllVariantsFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'variantOf';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        // This filter doesn't actually do anything, but it'll disable the base filtering in the mutator
        $filterState->getActor()->assertCan('backoffice');
    }
}
