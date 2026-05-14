<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'department' => $request->user()->department,
                    'avatar_path' => $request->user()->avatar_path,
                    'theme' => $request->user()->theme ?? 'light',
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'id' => fn () => uniqid(),
            ],
            'notifications' => [
                'unread_count' => fn () => $request->user()
                    ? $request->user()->unreadNotifications()->count()
                    : 0,
            ],
            'sidebar_stats' => fn () => $request->user()?->isAdmin()
                ? [
                    'urgent' => \App\Models\Ticket::urgent()->active()->count(),
                    'unassigned' => \App\Models\Ticket::whereNull('assigned_to')->active()->count(),
                    'overdue' => \App\Models\Ticket::active()->where('due_at', '<', now())->count(),
                ]
                : null,
        ];
    }
}
