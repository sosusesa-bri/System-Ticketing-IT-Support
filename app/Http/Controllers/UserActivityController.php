<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $activities = ActivityLog::where('user_id', $user->id)
            ->latest('created_at')
            ->paginate(20)
            ->through(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'properties' => $log->properties,
                'created_at' => $log->created_at->format('d M Y, H:i'),
                'created_at_human' => $log->created_at->diffForHumans(),
            ]);

        $stats = [
            'totalTickets' => Ticket::where('user_id', $user->id)->count(),
            'totalComments' => $user->comments()->count(),
            'totalRatings' => Ticket::where('user_id', $user->id)->whereNotNull('rating')->count(),
            'lastLogin' => $user->last_login_at?->format('d M Y, H:i'),
        ];

        return Inertia::render('Activity/Index', [
            'activities' => $activities,
            'stats' => $stats,
        ]);
    }
}
