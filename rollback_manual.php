<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

Schema::table('tickets', function (Blueprint $table) {
    if (Schema::hasColumn('tickets', 'first_responded_at')) {
        $table->dropColumn(['first_responded_at', 'is_escalated', 'escalation_level', 'escalated_at', 'escalation_reason']);
    }
});
