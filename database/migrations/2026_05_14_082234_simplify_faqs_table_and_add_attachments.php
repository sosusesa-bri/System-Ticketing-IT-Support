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
        Schema::table('faqs', function (Blueprint $table) {
            $table->renameColumn('question_en', 'question');
            $table->renameColumn('answer_en', 'answer');
            $table->dropColumn(['question_id', 'answer_id']);
        });

        Schema::create('faq_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_id')->constrained()->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('file_size');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faq_attachments');

        Schema::table('faqs', function (Blueprint $table) {
            $table->string('question_id')->nullable()->after('question');
            $table->text('answer_id')->nullable()->after('answer');
            $table->renameColumn('question', 'question_en');
            $table->renameColumn('answer', 'answer_en');
        });
    }
};
