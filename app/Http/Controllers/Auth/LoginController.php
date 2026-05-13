<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Authenticate the user.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            $failedUser = \App\Models\User::where('email', $credentials['email'])->first();
            if ($failedUser) {
                // Temporarily log in as the user just for the audit log, then logout, or just create ActivityLog directly to set user_id manually.
                // Wait, it's easier to use AuditService but we can't inject user_id. Let's just create ActivityLog directly.
                \App\Models\ActivityLog::create([
                    'action' => 'login_failed',
                    'description' => 'Failed login attempt',
                    'user_id' => $failedUser->id,
                    'subject_type' => get_class($failedUser),
                    'subject_id' => $failedUser->id,
                    'properties' => ['user_agent' => $request->userAgent()],
                    'ip_address' => $request->ip(),
                    'created_at' => now(),
                ]);
            } else {
                // Log failed attempt for non-existent user
                \App\Models\ActivityLog::create([
                    'action' => 'login_failed',
                    'description' => "Failed login attempt for non-existent email: {$credentials['email']}",
                    'user_id' => null,
                    'properties' => ['user_agent' => $request->userAgent()],
                    'ip_address' => $request->ip(),
                    'created_at' => now(),
                ]);
            }

            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        $user = Auth::user();

        AuditService::log('login', 'User logged in', $user);

        if ($user->role === UserRole::ADMIN) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Log the user out.
     */
    public function destroy(Request $request): RedirectResponse
    {
        AuditService::log('logout', 'User logged out', Auth::user());

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
