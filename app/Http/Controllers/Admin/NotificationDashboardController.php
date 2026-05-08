<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationAutomationRule;
use App\Models\NotificationBroadcast;
use App\Models\NotificationTemplate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;

class NotificationDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_broadcasts' => NotificationBroadcast::count(),
            'scheduled' => NotificationBroadcast::where('status', 'scheduled')->count(),
            'completed' => NotificationBroadcast::where('status', 'completed')->count(),
            'failed' => NotificationBroadcast::where('status', 'failed')->count(),
            'processing' => NotificationBroadcast::where('status', 'processing')->count(),
            'draft' => NotificationBroadcast::where('status', 'draft')->count(),
            'templates' => NotificationTemplate::count(),
            'active_templates' => NotificationTemplate::where('is_active', true)->count(),
            'automation_rules' => NotificationAutomationRule::count(),
            'active_rules' => NotificationAutomationRule::where('is_active', true)->count(),
            'total_system_notifications' => DatabaseNotification::count(),
            'unread_system_notifications' => DatabaseNotification::whereNull('read_at')->count(),
        ];

        $recentBroadcasts = NotificationBroadcast::with('creator')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'title' => $b->title,
                'status' => $b->status,
                'type' => $b->type,
                'created_at' => $b->created_at->format('Y-m-d H:i'),
                'created_at_human' => $b->created_at->diffForHumans(),
                'creator' => $b->creator->name ?? 'System',
            ]);

        // Recent system notifications across all users
        $recentNotifications = DatabaseNotification::latest()
            ->take(10)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => class_basename($n->type),
                'data' => $n->data,
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at->diffForHumans(),
                'created_at_full' => $n->created_at->format('d M Y, H:i'),
                'user' => $n->notifiable?->name ?? 'Unknown',
            ]);

        return Inertia::render('Admin/Notifications/Dashboard', [
            'stats' => $stats,
            'recentBroadcasts' => $recentBroadcasts,
            'recentNotifications' => $recentNotifications,
        ]);
    }
}
