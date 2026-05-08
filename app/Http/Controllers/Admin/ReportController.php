<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Show the comprehensive reports dashboard.
     */
    public function index(Request $request): Response
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());

        $service = new ReportService($dateFrom, $dateTo);

        return Inertia::render('Admin/Reports/Index', [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'overview' => $service->getOverviewMetrics(),
            'volumeTrend' => $service->getTicketVolumeTrend(),
            'openVsResolved' => $service->getOpenVsResolvedTrend(),
            'statusDistribution' => $service->getStatusDistribution(),
            'priorityDistribution' => $service->getPriorityDistribution(),
            'categoryDistribution' => $service->getCategoryDistribution(),
            'resolutionTrend' => $service->getResolutionTimeTrend(),
            'techPerformance' => $service->getTechnicianPerformance(),
            'activityHeatmap' => $service->getActivityHeatmap(),
            'lifecycleFunnel' => $service->getLifecycleFunnel(),
            'satisfaction' => $service->getSatisfactionAnalytics(),
            'reopenedAnalytics' => $service->getReopenedAnalytics(),
            'slaTrend' => $service->getSlaTrend(),
        ]);
    }
}
