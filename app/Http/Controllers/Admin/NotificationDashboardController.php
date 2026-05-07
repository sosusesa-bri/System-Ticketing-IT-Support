<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationBroadcast;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
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
            'templates' => NotificationTemplate::count(),
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
                'creator' => $b->creator->name ?? 'System',
            ]);

        return Inertia::render('Admin/Notifications/Dashboard', [
            'stats' => $stats,
            'recentBroadcasts' => $recentBroadcasts,
        ]);
    }
}
