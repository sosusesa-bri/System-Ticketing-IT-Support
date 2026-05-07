<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(): Response
    {
        $service = new DashboardService();
        $data = $service->getAdminDashboard();

        return Inertia::render('Admin/Dashboard', $data);
    }
}
