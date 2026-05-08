<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationAutomationRule;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationAutomationController extends Controller
{
    public function index()
    {
        $rules = NotificationAutomationRule::with('template')
            ->orderBy('name')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'trigger_event' => $r->event,
                'conditions' => $r->conditions,
                'is_active' => $r->is_active,
                'template' => $r->template->name ?? 'N/A',
                'created_at' => $r->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Admin/Notifications/Automation/Index', [
            'rules' => $rules,
        ]);
    }

    public function create()
    {
        $templates = NotificationTemplate::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Notifications/Automation/Create', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'event' => ['required', 'string'],
            'conditions' => ['nullable', 'array'],
            'action' => ['required', 'array'],
            'template_id' => ['required', 'exists:notification_templates,id'],
            'is_active' => ['boolean'],
        ]);

        $validated['created_by'] = $request->user()->id;

        NotificationAutomationRule::create($validated);

        return redirect()->route('admin.notifications.automation.index')
            ->with('success', 'Automation rule created successfully.');
    }

    public function edit(NotificationAutomationRule $automation)
    {
        $templates = NotificationTemplate::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Notifications/Automation/Edit', [
            'rule' => [
                'id' => $automation->id,
                'name' => $automation->name,
                'event' => $automation->event,
                'conditions' => $automation->conditions,
                'action' => $automation->action,
                'template_id' => $automation->template_id,
                'is_active' => $automation->is_active,
            ],
            'templates' => $templates,
        ]);
    }

    public function update(Request $request, NotificationAutomationRule $automation)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'event' => ['sometimes', 'string'],
            'conditions' => ['sometimes', 'array'],
            'action' => ['sometimes', 'array'],
            'template_id' => ['sometimes', 'exists:notification_templates,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $automation->update($validated);

        return back()->with('success', 'Automation rule updated.');
    }

    public function destroy(NotificationAutomationRule $automation)
    {
        $automation->delete();

        return back()->with('success', 'Automation rule deleted.');
    }
}
