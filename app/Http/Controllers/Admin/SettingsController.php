<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TicketCategory;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Show the settings page.
     */
    public function index(): Response
    {
        $categories = TicketCategory::orderBy('name')
            ->get(['id', 'name', 'description', 'is_active']);

        $macros = \App\Models\CannedResponse::orderBy('title')
            ->get(['id', 'title', 'body', 'is_active']);

        return Inertia::render('Admin/Settings', [
            'categories' => $categories,
            'macros' => $macros,
        ]);
    }

    /**
     * Create a new ticket category.
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:ticket_categories,name'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        TicketCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        AuditService::log('category_created', "Category '{$validated['name']}' created");

        return back()->with('success', "Category '{$validated['name']}' created.");
    }

    /**
     * Toggle a category's active state.
     */
    public function toggleCategory(TicketCategory $category): RedirectResponse
    {
        $category->update(['is_active' => !$category->is_active]);

        $state = $category->is_active ? 'activated' : 'deactivated';
        AuditService::log('category_toggled', "Category '{$category->name}' {$state}", $category);

        return back()->with('success', "Category '{$category->name}' {$state}.");
    }

    /**
     * Create a new canned response macro.
     */
    public function storeMacro(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:canned_responses,title'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        \App\Models\CannedResponse::create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            'is_active' => true,
        ]);

        AuditService::log('macro_created', "Macro '{$validated['title']}' created");

        return back()->with('success', "Macro '{$validated['title']}' created.");
    }

    /**
     * Toggle a macro's active state.
     */
    public function toggleMacro(\App\Models\CannedResponse $macro): RedirectResponse
    {
        $macro->update(['is_active' => !$macro->is_active]);

        $state = $macro->is_active ? 'activated' : 'deactivated';
        AuditService::log('macro_toggled', "Macro '{$macro->title}' {$state}");

        return back()->with('success', "Macro '{$macro->title}' {$state}.");
    }

    /**
     * Delete a category.
     */
    public function destroyCategory(TicketCategory $category): RedirectResponse
    {
        // Check if category is used by tickets
        if ($category->tickets()->exists()) {
            return back()->with('error', "Category '{$category->name}' cannot be deleted because it is used by existing tickets.");
        }

        $categoryName = $category->name;
        $category->delete();

        AuditService::log('category_deleted', "Category '{$categoryName}' deleted");

        return back()->with('success', "Category '{$categoryName}' deleted successfully.");
    }

    /**
     * Delete a macro.
     */
    public function destroyMacro(\App\Models\CannedResponse $macro): RedirectResponse
    {
        $macroTitle = $macro->title;
        $macro->delete();

        AuditService::log('macro_deleted', "Macro '{$macroTitle}' deleted");

        return back()->with('success', "Macro '{$macroTitle}' deleted successfully.");
    }
}
