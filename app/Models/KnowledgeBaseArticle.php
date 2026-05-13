<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

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
     * File attachments for this article.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(KbAttachment::class, 'knowledge_base_article_id');
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
        return $lang === 'id' ? ($this->title_id ?: $this->title_en) : ($this->title_en ?: $this->title_id);
    }

    /**
     * Get the content for a given language.
     */
    public function localizedContent(string $lang = 'en'): string
    {
        return $lang === 'id' ? ($this->content_id ?: $this->content_en) : ($this->content_en ?: $this->content_id);
    }

    /**
     * Record a unique view for the given user.
     * Returns true if this is a new view, false if already viewed.
     */
    public function recordView(int $userId): bool
    {
        $inserted = DB::table('kb_article_views')->insertOrIgnore([
            'knowledge_base_article_id' => $this->id,
            'user_id' => $userId,
            'viewed_at' => now(),
        ]);

        if ($inserted) {
            $this->increment('views');
            return true;
        }

        return false;
    }

    /**
     * Get unique view count from the views table.
     */
    public function uniqueViewCount(): int
    {
        return DB::table('kb_article_views')
            ->where('knowledge_base_article_id', $this->id)
            ->count();
    }
}
