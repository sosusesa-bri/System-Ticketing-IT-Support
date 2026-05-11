<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBaseArticle;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeBaseAdminController extends Controller
{
    /**
     * List all articles for admin management.
     */
    public function index(Request $request): Response
    {
        $query = KnowledgeBaseArticle::with('author:id,name');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_id', 'like', "%{$search}%");
            });
        }

        $articles = $query->latest()
            ->paginate(15)
            ->through(fn (KnowledgeBaseArticle $article) => [
                'id' => $article->id,
                'title_en' => $article->title_en,
                'title_id' => $article->title_id,
                'category' => $article->category,
                'is_published' => $article->is_published,
                'views' => $article->views,
                'author' => $article->author?->name ?? 'System',
                'created_at' => $article->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/KnowledgeBase/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show create form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/KnowledgeBase/Create');
    }

    /**
     * Store a new article.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title_en' => ['required', 'string', 'max:255'],
            'title_id' => ['required', 'string', 'max:255'],
            'content_en' => ['required', 'string'],
            'content_id' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
        ]);

        $article = KnowledgeBaseArticle::create([
            ...$validated,
            'author_id' => $request->user()->id,
        ]);

        AuditService::log('kb_article_created', "Knowledge base article created: {$article->title_en}", $article);

        return redirect()
            ->route('admin.knowledgeBase.index')
            ->with('success', 'Article created successfully.');
    }

    /**
     * Show edit form.
     */
    public function edit(KnowledgeBaseArticle $article): Response
    {
        return Inertia::render('Admin/KnowledgeBase/Edit', [
            'article' => [
                'id' => $article->id,
                'title_en' => $article->title_en,
                'title_id' => $article->title_id,
                'content_en' => $article->content_en,
                'content_id' => $article->content_id,
                'category' => $article->category,
                'is_published' => $article->is_published,
            ],
        ]);
    }

    /**
     * Update an article.
     */
    public function update(Request $request, KnowledgeBaseArticle $article): RedirectResponse
    {
        $validated = $request->validate([
            'title_en' => ['required', 'string', 'max:255'],
            'title_id' => ['required', 'string', 'max:255'],
            'content_en' => ['required', 'string'],
            'content_id' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
        ]);

        $article->update($validated);

        AuditService::log('kb_article_updated', "Knowledge base article updated: {$article->title_en}", $article);

        return redirect()
            ->route('admin.knowledgeBase.index')
            ->with('success', 'Article updated successfully.');
    }

    /**
     * Delete an article.
     */
    public function destroy(KnowledgeBaseArticle $article): RedirectResponse
    {
        AuditService::log('kb_article_deleted', "Knowledge base article deleted: {$article->title_en}", $article);

        $article->delete();

        return redirect()
            ->route('admin.knowledgeBase.index')
            ->with('success', 'Article deleted successfully.');
    }
}
