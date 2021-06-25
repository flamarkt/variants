<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('flamarkt_products', function (Blueprint $table) {
            $table->boolean('is_variant_master')->default(false)->index();
            $table->unsignedInteger('variant_master_id')->nullable();

            $table->foreign('variant_master_id')->references('id')->on('flamarkt_products')->onDelete('set null');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('flamarkt_products', function (Blueprint $table) {
            $table->dropForeign(['variant_master_id']);

            $table->dropColumn('is_variant_master');
            $table->dropColumn('variant_master_id');
        });
    },
];
