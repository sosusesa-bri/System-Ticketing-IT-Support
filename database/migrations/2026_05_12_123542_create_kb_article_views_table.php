<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kb_article_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_base_article_id')
                ->constrained('knowledge_base_articles')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->timestamp('viewed_at')->useCurrent();

            $table->unique(['knowledge_base_article_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kb_article_views');
    }
};
