<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * List all users.
     */
    public function index(Request $request): Response
    {
        $query = User::query();

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()
            ->paginate(20)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department,
                'tickets_count' => $user->tickets()->count(),
                'last_login_at' => $user->last_login_at?->diffForHumans(),
                'created_at' => $user->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['department', 'search']),
        ]);
    }

    /**
     * Show detailed user profile.
     */
    public function show(User $user): Response
    {
        $user->loadCount(['tickets', 'comments', 'activityLogs']);
        
        return Inertia::render('Admin/Users/Show', [
            'profileUser' => array_merge($user->toArray(), [
                'tickets_count' => $user->tickets_count,
                'comments_count' => $user->comments_count,
                'activity_logs_count' => $user->activity_logs_count,
                'role' => $user->role->value,
                'created_at_human' => $user->created_at->format('d M Y, H:i'),
                'last_login_human' => $user->last_login_at ? $user->last_login_at->diffForHumans() : 'Never',
            ]),
            'recentActivity' => $user->activityLogs()->latest()->take(10)->get()
        ]);
    }

    /**
     * Update a user's role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:user,admin'],
        ]);

        $oldRole = $user->role->value;
        $user->update(['role' => UserRole::from($validated['role'])]);

        AuditService::log(
            'user_role_changed',
            "User {$user->name} role changed from {$oldRole} to {$validated['role']}",
            $user,
            ['from' => $oldRole, 'to' => $validated['role']],
        );

        return back()->with('success', "User role updated to {$validated['role']}.");
    }
}
