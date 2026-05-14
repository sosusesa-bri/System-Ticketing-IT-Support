<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminTicketController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\FaqAdminController;
use App\Http\Controllers\Admin\KnowledgeBaseAdminController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SystemHealthController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\NotificationDashboardController;
use App\Http\Controllers\Admin\NotificationBroadcastController;
use App\Http\Controllers\Admin\NotificationTemplateController;
use App\Http\Controllers\Admin\NotificationAutomationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketAttachmentController;
use App\Http\Controllers\TicketCommentController;
use App\Http\Controllers\UserActivityController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/', fn () => redirect()->route('login'));
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
});

// Serve storage files (PHP dev server fallback for Windows symlink issues)
Route::get('/storage/{path}', function (string $path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    return response()->file($fullPath);
})->where('path', '.*')->name('storage.serve');

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // User dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Ticket routes
    Route::resource('tickets', TicketController::class);
    Route::get('/tickets-search/duplicates', [TicketController::class, 'checkDuplicates'])->name('tickets.checkDuplicates');
    Route::get('/tickets-search/suggest', [TicketController::class, 'autoSuggest'])->name('tickets.autoSuggest');
    Route::post('/tickets/{ticket}/reopen', [TicketController::class, 'reopen'])->name('tickets.reopen');
    Route::post('/tickets/{ticket}/rate', [TicketController::class, 'rate'])->name('tickets.rate');
    Route::post('/tickets/{ticket}/comments', [TicketCommentController::class, 'store'])->name('tickets.comments.store');

    // Ticket attachments (secure file serving)
    Route::get('/attachments/{attachment}', [TicketAttachmentController::class, 'show'])->name('attachments.show');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::delete('/profile/photo', [ProfileController::class, 'destroyPhoto'])->name('profile.photo.destroy');
    Route::put('/profile/cover', [ProfileController::class, 'updateCover'])->name('profile.cover');
    Route::delete('/profile/cover', [ProfileController::class, 'destroyCover'])->name('profile.cover.destroy');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('profile.preferences');
    Route::post('/profile/theme', [ProfileController::class, 'updateTheme'])->name('profile.theme');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications-read', [NotificationController::class, 'destroyRead'])->name('notifications.destroyRead');

    // Knowledge Base (public-facing for all authenticated users)
    Route::get('/knowledge-base', [KnowledgeBaseController::class, 'index'])->name('knowledgeBase.index');
    Route::get('/knowledge-base/{article}', [KnowledgeBaseController::class, 'show'])->name('knowledgeBase.show');

    // FAQ (public-facing for all authenticated users)
    Route::get('/faq', [FaqController::class, 'index'])->name('faq.index');

    // My Activity
    Route::get('/my-activity', [UserActivityController::class, 'index'])->name('activity.index');

    // Admin routes
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Admin ticket management
        Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/{ticket}', [AdminTicketController::class, 'show'])->name('tickets.show');
        Route::put('/tickets/{ticket}', [AdminTicketController::class, 'update'])->name('tickets.update');
        Route::post('/tickets/{ticket}/assign', [AdminTicketController::class, 'assign'])->name('tickets.assign');
        Route::post('/tickets/{ticket}/escalate', [AdminTicketController::class, 'escalate'])->name('tickets.escalate');
        Route::post('/tickets/{ticket}/tags', [AdminTicketController::class, 'syncTags'])->name('tickets.syncTags');
        Route::get('/tickets/{ticket}/pdf', [AdminTicketController::class, 'exportPdf'])->name('tickets.exportPdf');
        Route::post('/tickets/bulk-action', [AdminTicketController::class, 'bulkAction'])->name('tickets.bulkAction');

        // User management
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::put('/users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.updateRole');
        Route::put('/users/{user}/department', [UserManagementController::class, 'updateDepartment'])->name('users.updateDepartment');
        Route::put('/users/{user}/email', [UserManagementController::class, 'updateEmail'])->name('users.updateEmail');
        Route::put('/users/{user}/password', [UserManagementController::class, 'updatePassword'])->name('users.updatePassword');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

        // Audit Logs
        Route::get('/audit-log', [AuditLogController::class, 'index'])->name('audit-log');
        Route::get('/export/audit-logs', [AuditLogController::class, 'export'])->name('audit-log.export');

        // Documentation
        Route::get('/documentation', [\App\Http\Controllers\Admin\DocumentationController::class, 'index'])->name('documentation.index');

        // Notification Operations Center
        Route::prefix('notifications')->name('notifications.')->group(function () {
            Route::get('/dashboard', [NotificationDashboardController::class, 'index'])->name('dashboard');
            Route::resource('broadcasts', NotificationBroadcastController::class);
            Route::resource('templates', NotificationTemplateController::class);
            Route::resource('automation', NotificationAutomationController::class);
        });

        // Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::post('/settings/categories', [SettingsController::class, 'storeCategory'])->name('settings.storeCategory');
        Route::put('/settings/categories/{category}/toggle', [SettingsController::class, 'toggleCategory'])->name('settings.toggleCategory');
        Route::delete('/settings/categories/{category}', [SettingsController::class, 'destroyCategory'])->name('settings.destroyCategory');
        Route::post('/settings/macros', [SettingsController::class, 'storeMacro'])->name('settings.storeMacro');
        Route::put('/settings/macros/{macro}/toggle', [SettingsController::class, 'toggleMacro'])->name('settings.toggleMacro');
        Route::delete('/settings/macros/{macro}', [SettingsController::class, 'destroyMacro'])->name('settings.destroyMacro');

        // Tags
        Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
        Route::post('/tags', [TagController::class, 'store'])->name('tags.store');
        Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

        // FAQ Management
        Route::get('/faq', [FaqAdminController::class, 'index'])->name('faq.index');
        Route::post('/faq', [FaqAdminController::class, 'store'])->name('faq.store');
        Route::put('/faq/{faq}', [FaqAdminController::class, 'update'])->name('faq.update');
        Route::delete('/faq/{faq}', [FaqAdminController::class, 'destroy'])->name('faq.destroy');
        Route::put('/faq/{faq}/toggle', [FaqAdminController::class, 'toggleActive'])->name('faq.toggle');
        Route::delete('/faq/attachments/{attachment}', [FaqAdminController::class, 'destroyAttachment'])->name('faq.attachment.destroy');

        // System Health
        Route::get('/system-health', [SystemHealthController::class, 'index'])->name('systemHealth.index');

        // Exports
        Route::get('/export/tickets', [ExportController::class, 'exportTickets'])->name('export.tickets');
        Route::get('/export/audit-logs', [ExportController::class, 'exportAuditLogs'])->name('export.auditLogs');

        // Knowledge Base Management
        Route::resource('knowledge-base', KnowledgeBaseAdminController::class)
            ->parameters(['knowledge-base' => 'article'])
            ->names('knowledgeBase');
    });
});
