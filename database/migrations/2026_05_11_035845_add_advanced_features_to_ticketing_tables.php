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
        Schema::create('knowledge_base_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_id');
            $table->text('content_en');
            $table->text('content_id');
            $table->string('category')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedBigInteger('views')->default(0);
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('first_responded_at')->nullable()->after('created_at')->comment('For Response SLA');
            $table->timestamp('response_due_at')->nullable()->after('due_at')->comment('Target for first response');
            $table->boolean('is_escalated')->default(false)->after('status');
            $table->unsignedInteger('escalation_level')->default(0)->after('is_escalated');
            $table->timestamp('escalated_at')->nullable()->after('escalation_level');
            $table->string('escalation_reason')->nullable()->after('escalated_at');
        });

        Schema::table('canned_responses', function (Blueprint $table) {
            $table->dropUnique('canned_responses_title_unique');
            $table->dropColumn(['title', 'body']);
            $table->string('title_en')->nullable()->after('id');
            $table->string('title_id')->nullable()->after('title_en');
            $table->text('body_en')->nullable()->after('title_id');
            $table->text('body_id')->nullable()->after('body_en');
            $table->string('category')->nullable()->after('body_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_base_articles');

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn(['first_responded_at', 'is_escalated', 'escalation_level', 'escalated_at', 'escalation_reason']);
        });

        Schema::table('canned_responses', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'title_id', 'body_en', 'body_id', 'category']);
            $table->string('title')->unique()->nullable();
            $table->text('body')->nullable();
        });
    }
};
