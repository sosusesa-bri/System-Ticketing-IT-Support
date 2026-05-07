<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationAutomationRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationAutomationController extends Controller
{
    public function index()
    {
        $rules = NotificationAutomationRule::with('template')
            ->orderBy('name')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'trigger_event' => $r->trigger_event,
                'is_active' => $r->is_active,
                'template' => $r->template->name ?? 'N/A',
            ]);

        return Inertia::render('Admin/Notifications/Automation/Index', [
            'rules' => $rules,
        ]);
    }
}
