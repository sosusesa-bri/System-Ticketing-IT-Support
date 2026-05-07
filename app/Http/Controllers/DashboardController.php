<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the user dashboard.
     */
    public function index(Request $request): Response
    {
        $service = new DashboardService();
        $data = $service->getUserDashboard($request->user());

        return Inertia::render('Dashboard/Index', $data);
    }
}
