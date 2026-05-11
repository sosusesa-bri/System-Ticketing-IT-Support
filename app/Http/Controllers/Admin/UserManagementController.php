<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
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

        if ($request->filled('role')) {
            $query->where('role', $request->role);
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
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'role'          => $user->role,
                'department'    => $user->department,
                'avatar_path'   => $user->avatar_path,
                'tickets_count' => $user->tickets()->count(),
                'last_login_at' => $user->last_login_at ? $user->last_login_at->format('d M Y, H:i') : null,
                'created_at'    => $user->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['department', 'search', 'role']),
        ]);
    }

    /**
     * Show detailed user profile.
     */
    public function show(User $user): Response
    {
        $user->loadCount(['tickets', 'comments', 'activityLogs']);

        return Inertia::render('Admin/Users/Show', [
            'profileUser'    => array_merge($user->toArray(), [
                'tickets_count'      => $user->tickets_count,
                'comments_count'     => $user->comments_count,
                'activity_logs_count'=> $user->activity_logs_count,
                'role'               => $user->role->value,
                'created_at_human'   => $user->created_at->format('d M Y, H:i'),
                'last_login_human'   => $user->last_login_at ? $user->last_login_at->format('d M Y, H:i') : 'Never',
            ]),
            'recentActivity' => $user->activityLogs()->latest()->take(10)->get(),
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

    /**
     * Update a user's department (admin only action).
     */
    public function updateDepartment(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'department' => ['required', 'string', 'max:255'],
        ]);

        $oldDept = $user->department;
        $user->update(['department' => $validated['department']]);

        AuditService::log(
            'user_department_changed',
            "Admin changed {$user->name}'s department from {$oldDept} to {$validated['department']}",
            $user,
            ['from' => $oldDept, 'to' => $validated['department']],
        );

        return back()->with('success', 'Department updated successfully.');
    }

    /**
     * Update a user's email (admin only action).
     */
    public function updateEmail(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $oldEmail = $user->email;
        $user->update(['email' => $validated['email']]);

        AuditService::log(
            'user_email_changed',
            "Admin changed {$user->name}'s email from {$oldEmail} to {$validated['email']}",
            $user,
            ['from' => $oldEmail, 'to' => $validated['email']],
        );

        return back()->with('success', 'Email updated successfully.');
    }

    /**
     * Reset/update a user's password (admin only action).
     */
    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user->update(['password' => Hash::make($validated['password'])]);

        AuditService::log(
            'user_password_reset',
            "Admin reset password for user {$user->name}",
            $user,
        );

        return back()->with('success', 'Password reset successfully.');
    }

    /**
     * Soft-delete a user account.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $userName = $user->name;
        $user->delete();

        AuditService::log(
            'user_deleted',
            "Admin deleted user account: {$userName}",
            null,
            ['deleted_user' => $userName],
        );

        return redirect()->route('admin.users.index')->with('success', "User {$userName} has been deleted.");
    }
}
