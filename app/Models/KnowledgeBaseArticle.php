<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeBaseArticle extends Model
{
    protected $fillable = [
        'title_en',
        'title_id',
        'content_en',
        'content_id',
        'category',
        'is_published',
        'views',
        'author_id',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'views' => 'integer',
        ];
    }

    /**
     * Author of the article.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope: only published articles.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Get the title for a given language.
     */
    public function localizedTitle(string $lang = 'en'): string
    {
        return $lang === 'id' ? ($this->title_id ?: $this->title_en) : $this->title_en;
    }

    /**
     * Get the content for a given language.
     */
    public function localizedContent(string $lang = 'en'): string
    {
        return $lang === 'id' ? ($this->content_id ?: $this->content_en) : $this->content_en;
    }
}
