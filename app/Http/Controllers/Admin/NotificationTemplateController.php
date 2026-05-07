<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationTemplateController extends Controller
{
    public function index()
    {
        $templates = NotificationTemplate::orderBy('name')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'subject' => $t->subject,
                'is_active' => $t->is_active,
            ]);

        return Inertia::render('Admin/Notifications/Templates/Index', [
            'templates' => $templates,
        ]);
    }
}
