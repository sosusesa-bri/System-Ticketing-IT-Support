<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBaseArticle;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
     * Show article detail for admin.
     */
    public function show(KnowledgeBaseArticle $article): Response
    {
        $article->load(['author:id,name', 'attachments']);

        return Inertia::render('Admin/KnowledgeBase/Show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title_en ?: $article->title_id,
                'title_en' => $article->title_en,
                'title_id' => $article->title_id,
                'content' => $article->content_en ?: $article->content_id,
                'content_en' => $article->content_en,
                'content_id' => $article->content_id,
                'category' => $article->category,
                'is_published' => $article->is_published,
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
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => [
                'nullable',
                'file',
                'max:102400',
                'mimes:jpeg,jpg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,csv,txt,md',
            ],
        ]);

        $article = KnowledgeBaseArticle::create([
            'title_en' => $validated['title'],
            'title_id' => $validated['title'],
            'content_en' => $validated['content'],
            'content_id' => $validated['content'],
            'category' => $validated['category'] ?? null,
            'is_published' => $validated['is_published'] ?? true,
            'author_id' => $request->user()->id,
        ]);

        // Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('kb-attachments/' . $article->id, 'public');
                $article->attachments()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

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
        $article->load('attachments');

        return Inertia::render('Admin/KnowledgeBase/Edit', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title_en ?: $article->title_id,
                'content' => $article->content_en ?: $article->content_id,
                'category' => $article->category,
                'is_published' => $article->is_published,
                'attachments' => $article->attachments->map(fn ($a) => [
                    'id' => $a->id,
                    'original_name' => $a->original_name,
                    'mime_type' => $a->mime_type,
                    'file_size' => $a->file_size,
                    'url' => asset('storage/' . $a->file_path),
                ]),
            ],
        ]);
    }

    /**
     * Update an article.
     */
    public function update(Request $request, KnowledgeBaseArticle $article): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => [
                'nullable',
                'file',
                'max:102400',
                'mimes:jpeg,jpg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,csv,txt,md',
            ],
            'remove_attachments' => ['nullable', 'array'],
            'remove_attachments.*' => ['integer'],
        ]);

        $article->update([
            'title_en' => $validated['title'],
            'title_id' => $validated['title'],
            'content_en' => $validated['content'],
            'content_id' => $validated['content'],
            'category' => $validated['category'] ?? null,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        // Remove attachments
        if (!empty($validated['remove_attachments'])) {
            $toRemove = $article->attachments()->whereIn('id', $validated['remove_attachments'])->get();
            foreach ($toRemove as $attachment) {
                Storage::disk('public')->delete($attachment->file_path);
                $attachment->delete();
            }
        }

        // Add new attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('kb-attachments/' . $article->id, 'public');
                $article->attachments()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

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
        // Delete attachment files from storage
        foreach ($article->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        AuditService::log('kb_article_deleted', "Knowledge base article deleted: {$article->title_en}", $article);

        $article->delete();

        return redirect()
            ->route('admin.knowledgeBase.index')
            ->with('success', 'Article deleted successfully.');
    }
}
