<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentationController extends Controller
{
    /**
     * Display the documentation module.
     */
    public function index()
    {
        return Inertia::render('Admin/Documentation/Index', [
            'version' => '1.0.0',
            'lastUpdated' => now()->format('Y-m-d'),
        ]);
    }
}
