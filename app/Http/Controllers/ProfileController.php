<?php

namespace App\Http\Controllers;

use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the profile edit page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => [
                'id'                       => $request->user()->id,
                'name'                     => $request->user()->name,
                'email'                    => $request->user()->email,
                'phone'                    => $request->user()->phone,
                'department'               => $request->user()->department,
                'avatar_path'              => $request->user()->avatar_path,
                'cover_path'               => $request->user()->cover_path,
                'role'                     => $request->user()->role->value,
                'language'                 => $request->user()->language,
                'notification_preferences' => $request->user()->notification_preferences ?? [],
                'created_at'               => $request->user()->created_at?->toIso8601String(),
                'last_login_at'            => $request->user()->last_login_at?->toIso8601String(),
            ],
            'recentActivity' => $request->user()->activityLogs()->latest()->take(10)->get()
        ]);
    }

    /**
     * Update the user's profile information.
     * Department is intentionally excluded — only Admins can change it.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9]{9,15}$/'],
        ]);

        $request->user()->update($validated);

        AuditService::log('profile_updated', 'Profile information updated', $request->user());

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        AuditService::log('password_changed', 'Password was changed', $request->user());

        return back()->with('success', 'Password changed successfully.');
    }

    /**
     * Update the user's profile photo (avatar).
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('avatars', 'public');
            $user->update(['avatar_path' => $path]);
            AuditService::log('profile_photo_updated', 'Profile photo updated', $user);
        }

        return back()->with('success', 'Profile photo updated successfully.');
    }

    /**
     * Remove the user's profile photo.
     */
    public function destroyPhoto(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->update(['avatar_path' => null]);
        AuditService::log('profile_photo_removed', 'Profile photo removed', $user);

        return back()->with('success', 'Profile photo removed successfully.');
    }

    /**
     * Update the user's cover photo (LinkedIn-style banner).
     */
    public function updateCover(Request $request): RedirectResponse
    {
        $request->validate([
            'cover' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
        ]);

        $user = $request->user();

        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('covers', 'public');
            $user->update(['cover_path' => $path]);
            AuditService::log('profile_cover_updated', 'Profile cover photo updated', $user);
        }

        return back()->with('success', 'Cover photo updated successfully.');
    }

    /**
     * Remove the user's cover photo.
     */
    public function destroyCover(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->update(['cover_path' => null]);
        AuditService::log('profile_cover_removed', 'Profile cover photo removed', $user);

        return back()->with('success', 'Cover photo removed.');
    }

    /**
     * Update user preferences.
     */
    public function updatePreferences(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'language'                 => ['required', 'in:en,id'],
            'notification_preferences' => ['nullable', 'array'],
        ]);

        $user = $request->user();
        $user->update([
            'language'                 => $validated['language'],
            'notification_preferences' => $validated['notification_preferences'] ?? [],
        ]);

        AuditService::log('preferences_updated', 'Profile preferences updated', $user);

        return back()->with('success', 'Preferences updated successfully.');
    }
}
