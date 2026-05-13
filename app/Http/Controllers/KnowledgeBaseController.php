<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBaseArticle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeBaseController extends Controller
{
    /**
     * Public-facing knowledge base listing.
     */
    public function index(Request $request): Response
    {
        $query = KnowledgeBaseArticle::published()->with('author:id,name');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_id', 'like', "%{$search}%")
                    ->orWhere('content_en', 'like', "%{$search}%")
                    ->orWhere('content_id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $articles = $query->latest()
            ->paginate(12)
            ->through(fn (KnowledgeBaseArticle $article) => [
                'id' => $article->id,
                'title_en' => $article->title_en,
                'title_id' => $article->title_id,
                'content_en' => \Illuminate\Support\Str::limit(strip_tags($article->content_en), 150),
                'content_id' => \Illuminate\Support\Str::limit(strip_tags($article->content_id), 150),
                'category' => $article->category,
                'views' => $article->views,
                'author' => $article->author?->name ?? 'System',
                'created_at' => $article->created_at->format('d M Y'),
            ]);

        $categories = KnowledgeBaseArticle::published()
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('KnowledgeBase/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show a single knowledge base article.
     */
    public function show(Request $request, KnowledgeBaseArticle $article): Response
    {
        if (! $article->is_published) {
            abort(404);
        }

        // Record unique view per user
        if ($request->user()) {
            $article->recordView($request->user()->id);
        }

        $article->load(['author:id,name', 'attachments']);

        // Get related articles in the same category
        $related = KnowledgeBaseArticle::published()
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn (KnowledgeBaseArticle $a) => [
                'id' => $a->id,
                'title_en' => $a->title_en,
                'title_id' => $a->title_id,
                'category' => $a->category,
                'created_at' => $a->created_at->format('d M Y'),
            ]);

        return Inertia::render('KnowledgeBase/Show', [
            'article' => [
                'id' => $article->id,
                'title_en' => $article->title_en,
                'title_id' => $article->title_id,
                'content_en' => $article->content_en,
                'content_id' => $article->content_id,
                'category' => $article->category,
                'views' => $article->views,
                'author' => $article->author?->name ?? 'System',
                'created_at' => $article->created_at->format('d M Y'),
                'updated_at' => $article->updated_at->format('d M Y'),
                'attachments' => $article->attachments->map(fn ($a) => [
                    'id' => $a->id,
                    'original_name' => $a->original_name,
                    'mime_type' => $a->mime_type,
                    'file_size' => $a->file_size,
                    'url' => asset('storage/' . $a->file_path),
                ]),
            ],
            'related' => $related,
        ]);
    }
}
