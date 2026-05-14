<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\KnowledgeBaseArticle;
use App\Models\Ticket;
use App\Models\User;
use App\Services\SystemHealthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemHealthController extends Controller
{
    public function index(Request $request): Response
    {
        $now = now();
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());

        $service = new SystemHealthService($dateFrom, $dateTo);

        return Inertia::render('Admin/SystemHealth', [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'charts' => [
                'activityTrend' => $service->getActivityTrend(),
                'logActionDistribution' => $service->getLogActionDistribution(),
                'activeUsersTrend' => $service->getActiveUsersTrend(),
                'slaTrend' => $service->getSlaTrend(),
                'modelCounts' => $service->getModelCounts(),
            ],
            'metrics' => [
                'totalUsers' => User::count(),
                'totalAdmins' => User::where('role', 'admin')->count(),
                'totalTickets' => Ticket::count(),
                'ticketsToday' => Ticket::whereDate('created_at', $now->toDateString())->count(),
                'ticketsThisWeek' => Ticket::where('created_at', '>=', $now->startOfWeek())->count(),
                'ticketsThisMonth' => Ticket::where('created_at', '>=', $now->startOfMonth())->count(),
                'openTickets' => Ticket::where('status', TicketStatus::OPEN)->count(),
                'inProgressTickets' => Ticket::where('status', TicketStatus::ON_PROCESS)->count(),
                'closedTickets' => Ticket::where('status', TicketStatus::CLOSED)->count(),
                'urgentTickets' => Ticket::urgent()->active()->count(),
                'unassignedTickets' => Ticket::whereNull('assigned_to')->active()->count(),
                'overdueTickets' => Ticket::active()->where('due_at', '<', now())->count(),
                'avgResolutionHours' => round(
                    Ticket::where('status', TicketStatus::CLOSED)
                        ->whereNotNull('closed_at')
                        ->selectRaw('AVG(JULIANDAY(closed_at) - JULIANDAY(created_at)) * 24 as avg_hours')
                        ->value('avg_hours') ?? 0,
                    1
                ),
                'slaComplianceRate' => $this->calculateSlaCompliance(),
                'avgRating' => round(
                    Ticket::whereNotNull('rating')->avg('rating') ?? 0,
                    1
                ),
                'totalRatings' => Ticket::whereNotNull('rating')->count(),
                'totalArticles' => KnowledgeBaseArticle::count(),
                'totalActivityLogs' => ActivityLog::count(),
                'recentLogins' => User::whereNotNull('last_login_at')
                    ->where('last_login_at', '>=', now()->subDays(7))
                    ->count(),
            ],
        ]);
    }

    private function calculateSlaCompliance(): float
    {
        $closedWithDue = Ticket::where('status', TicketStatus::CLOSED)
            ->whereNotNull('due_at')
            ->whereNotNull('closed_at')
            ->count();

        if ($closedWithDue === 0) {
            return 100.0;
        }

        $onTime = Ticket::where('status', TicketStatus::CLOSED)
            ->whereNotNull('due_at')
            ->whereNotNull('closed_at')
            ->whereColumn('closed_at', '<=', 'due_at')
            ->count();

        return round(($onTime / $closedWithDue) * 100, 1);
    }
}
