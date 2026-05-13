<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationBroadcast;
use App\Models\NotificationTemplate;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationBroadcastController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index()
    {
        $broadcasts = NotificationBroadcast::with('creator')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($b) => [
                'id' => $b->id,
                'title' => $b->title,
                'type' => $b->type,
                'status' => $b->status,
                'created_at' => $b->created_at->format('Y-m-d H:i'),
                'creator' => $b->creator->name ?? 'System',
            ]);

        return Inertia::render('Admin/Notifications/Broadcasts/Index', [
            'broadcasts' => $broadcasts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Notifications/Broadcasts/Create', [
            'templates' => NotificationTemplate::where('is_active', true)->get(['id', 'name', 'subject', 'content']),
            'users' => User::get(['id', 'name', 'role', 'department']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,success,warning,error',
            'priority' => 'required|in:low,normal,high,urgent',
            'target_type' => 'required|in:all,department,role,user',
            'target_values' => 'nullable|array',
            'channels' => 'required|array',
            'template_id' => 'nullable|exists:notification_templates,id',
            'scheduled_at' => 'nullable|date|after_or_equal:today',
        ]);

        $broadcast = NotificationBroadcast::create([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'target_audience' => [
                'type' => $validated['target_type'],
                'values' => $validated['target_values'] ?? [],
            ],
            'channels' => $validated['channels'],
            'status' => empty($validated['scheduled_at']) ? 'sending' : 'scheduled',
            'template_id' => $validated['template_id'],
            'created_by' => auth()->id(),
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        // Process immediately if not scheduled
        if ($broadcast->status === 'sending') {
            $this->notificationService->dispatchBroadcast($broadcast);
            \App\Services\AuditService::log('broadcast_sent', "Broadcast sent: {$broadcast->title}", $broadcast);
            return redirect()->route('admin.notifications.broadcasts.index')->with('success', 'Broadcast sent successfully!');
        }

        \App\Services\AuditService::log('broadcast_scheduled', "Broadcast scheduled: {$broadcast->title}", $broadcast);
        return redirect()->route('admin.notifications.broadcasts.index')->with('success', 'Broadcast scheduled successfully!');
    }

    public function show(NotificationBroadcast $broadcast)
    {
        $broadcast->load(['creator', 'deliveryLogs.user', 'attachments']);

        return Inertia::render('Admin/Notifications/Broadcasts/Show', [
            'broadcast' => [
                'id' => $broadcast->id,
                'title' => $broadcast->title,
                'message' => $broadcast->message,
                'type' => $broadcast->type,
                'status' => $broadcast->status,
                'priority' => $broadcast->priority,
                'created_at' => $broadcast->created_at->format('Y-m-d H:i'),
                'sent_at' => $broadcast->sent_at ? $broadcast->sent_at->format('Y-m-d H:i') : null,
                'creator' => $broadcast->creator->name ?? 'System',
                'target_audience' => $broadcast->target_audience,
                'channels' => $broadcast->channels,
            ],
            'logs' => $broadcast->deliveryLogs->map(fn ($log) => [
                'id' => $log->id,
                'user' => $log->user->name,
                'channel' => $log->channel,
                'status' => $log->status,
                'sent_at' => $log->sent_at ? $log->sent_at->format('Y-m-d H:i') : null,
                'read_at' => $log->read_at ? $log->read_at->format('Y-m-d H:i') : null,
            ]),
        ]);
    }
}
