<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Show the reports page.
     */
    public function index(Request $request): Response
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());

        // Ticket counts by status
        $byStatus = Ticket::select('status', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->status->value => $item->count]);

        // Ticket counts by priority
        $byPriority = Ticket::select('priority', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])
            ->groupBy('priority')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->priority->value => $item->count]);

        // Ticket counts by category
        $byCategory = Ticket::select('category_id', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get()
            ->map(fn ($item) => [
                'category' => $item->category?->name ?? 'Uncategorized',
                'count' => $item->count,
            ]);

        // Daily ticket creation (last 30 days)
        $dailyCreated = Ticket::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Average resolution time (for closed tickets)
        $avgResolution = Ticket::whereNotNull('closed_at')
            ->whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])
            ->selectRaw('AVG(JULIANDAY(closed_at) - JULIANDAY(created_at)) as avg_days')
            ->first();

        // Summary totals
        $totalTickets = Ticket::whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])->count();
        $closedTickets = Ticket::where('status', TicketStatus::CLOSED)
            ->whereBetween('created_at', [$dateFrom, $dateTo . ' 23:59:59'])->count();

        return Inertia::render('Admin/Reports', [
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'summary' => [
                'total' => $totalTickets,
                'closed' => $closedTickets,
                'resolution_rate' => $totalTickets > 0 ? round(($closedTickets / $totalTickets) * 100, 1) : 0,
                'avg_resolution_days' => $avgResolution?->avg_days ? round($avgResolution->avg_days, 1) : null,
            ],
            'byStatus' => $byStatus,
            'byPriority' => $byPriority,
            'byCategory' => $byCategory,
            'dailyCreated' => $dailyCreated,
        ]);
    }
}
