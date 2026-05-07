<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('due_at')->nullable()->after('solution_notes')->comment('SLA deadline');
            $table->unsignedTinyInteger('rating')->nullable()->after('due_at')->comment('CSAT rating 1-5');
            $table->text('feedback_notes')->nullable()->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn(['due_at', 'rating', 'feedback_notes']);
        });
    }
};
