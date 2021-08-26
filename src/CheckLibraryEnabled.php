<?php

namespace Flamarkt\Variants;

use Flarum\Extension\ExtensionManager;

/**
 * Used as the callback to check if thumbnail relationships should be loaded
 */
class CheckLibraryEnabled
{
    protected $manager;

    public function __construct(ExtensionManager $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(): bool
    {
        return $this->manager->isEnabled('flamarkt-library');
    }
}
