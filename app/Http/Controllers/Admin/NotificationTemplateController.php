<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationTemplateController extends Controller
{
    public function index()
    {
        $templates = NotificationTemplate::orderBy('name')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'subject' => $t->subject,
                'content' => $t->content,
                'variables' => $t->variables ?? [],
                'is_active' => $t->is_active,
                'created_at' => $t->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Admin/Notifications/Templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Notifications/Templates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'variables' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $validated['created_by'] = $request->user()->id;

        NotificationTemplate::create($validated);

        return redirect()->route('admin.notifications.templates.index')
            ->with('success', 'Template created successfully.');
    }

    public function edit(NotificationTemplate $template)
    {
        return Inertia::render('Admin/Notifications/Templates/Edit', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'subject' => $template->subject,
                'content' => $template->content,
                'variables' => $template->variables ?? [],
                'is_active' => $template->is_active,
            ],
        ]);
    }

    public function update(Request $request, NotificationTemplate $template)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'subject' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'variables' => ['sometimes', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $template->update($validated);

        return back()->with('success', 'Template updated.');
    }

    public function destroy(NotificationTemplate $template)
    {
        $template->delete();

        return back()->with('success', 'Template deleted.');
    }
}
