<?php

namespace App\Services;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\NotificationBroadcast;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    protected Carbon $from;
    protected Carbon $to;
    protected Carbon $prevFrom;
    protected Carbon $prevTo;

    public function __construct(string $dateFrom, string $dateTo)
    {
        $this->from = Carbon::parse($dateFrom)->startOfDay();
        $this->to = Carbon::parse($dateTo)->endOfDay();

        $diff = $this->from->diffInDays($this->to);
        $this->prevFrom = $this->from->copy()->subDays($diff + 1)->startOfDay();
        $this->prevTo = $this->from->copy()->subDay()->endOfDay();
    }

    /**
     * Get all overview metrics.
     */
    public function getOverviewMetrics(): array
    {
        $current = $this->periodQuery();
        $previous = $this->previousPeriodQuery();

        $totalTickets = $current->count();
        $prevTotal = $previous->count();

        $openTickets = (clone $current)->where('status', TicketStatus::OPEN)->count();
        $inProgressTickets = (clone $current)->where('status', TicketStatus::ON_PROCESS)->count();
        $closedTickets = (clone $current)->where('status', TicketStatus::CLOSED)->count();
        $reopenedTickets = (clone $current)->where('status', TicketStatus::REOPENED)->count();

        $resolvedToday = Ticket::where('status', TicketStatus::CLOSED)
            ->whereDate('closed_at', today())
            ->count();

        $overdueTickets = Ticket::where('status', '!=', TicketStatus::DRAFT)->whereIn('status', [TicketStatus::OPEN, TicketStatus::ON_PROCESS, TicketStatus::REOPENED])
            ->where('due_at', '<', now())
            ->count();

        // Average resolution time in hours
        $avgResolution = Ticket::where('status', '!=', TicketStatus::DRAFT)->whereNotNull('closed_at')
            ->whereBetween('created_at', [$this->from, $this->to])
            ->selectRaw('AVG(CAST((JULIANDAY(closed_at) - JULIANDAY(created_at)) * 24 AS REAL)) as avg_hours')
            ->first();

        $prevAvgResolution = Ticket::where('status', '!=', TicketStatus::DRAFT)->whereNotNull('closed_at')
            ->whereBetween('created_at', [$this->prevFrom, $this->prevTo])
            ->selectRaw('AVG(CAST((JULIANDAY(closed_at) - JULIANDAY(created_at)) * 24 AS REAL)) as avg_hours')
            ->first();

        // SLA compliance
        $slaTotal = (clone $current)->whereNotNull('due_at')->count();
        $slaMet = (clone $current)->whereNotNull('due_at')
            ->where(function ($q) {
                $q->where('status', TicketStatus::CLOSED)
                    ->whereColumn('closed_at', '<=', 'due_at');
            })
            ->orWhere(function ($q) {
                $q->whereIn('status', [TicketStatus::OPEN, TicketStatus::ON_PROCESS, TicketStatus::REOPENED])
                    ->where('due_at', '>=', now());
            })
            ->whereBetween('created_at', [$this->from, $this->to])
            ->count();

        $slaCompliance = $slaTotal > 0 ? round(($slaMet / $slaTotal) * 100, 1) : 100;

        return [
            'totalTickets' => $totalTickets,
            'prevTotal' => $prevTotal,
            'openTickets' => $openTickets,
            'inProgressTickets' => $inProgressTickets,
            'closedTickets' => $closedTickets,
            'reopenedTickets' => $reopenedTickets,
            'resolvedToday' => $resolvedToday,
            'overdueTickets' => $overdueTickets,
            'avgResolutionHours' => $avgResolution?->avg_hours ? round($avgResolution->avg_hours, 1) : null,
            'prevAvgResolutionHours' => $prevAvgResolution?->avg_hours ? round($prevAvgResolution->avg_hours, 1) : null,
            'slaCompliance' => $slaCompliance,
            'slaTotal' => $slaTotal,
        ];
    }

    /**
     * Daily ticket volume trend.
     */
    public function getTicketVolumeTrend(): array
    {
        $current = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $previous = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$this->prevFrom, $this->prevTo])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Fill missing dates
        $data = [];
        $date = $this->from->copy();
        while ($date <= $this->to) {
            $key = $date->toDateString();
            $data[] = [
                'date' => $key,
                'label' => $date->format('M d'),
                'count' => $current[$key]->count ?? 0,
            ];
            $date->addDay();
        }

        return [
            'current' => $data,
            'previousTotal' => $previous->sum('count'),
            'currentTotal' => $current->sum('count'),
        ];
    }

    /**
     * Open vs Resolved trend.
     */
    public function getOpenVsResolvedTrend(): array
    {
        $opened = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $resolved = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(DB::raw('DATE(closed_at) as date'), DB::raw('count(*) as count'))
            ->whereNotNull('closed_at')
            ->whereBetween('closed_at', [$this->from, $this->to])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $data = [];
        $date = $this->from->copy();
        while ($date <= $this->to) {
            $key = $date->toDateString();
            $data[] = [
                'date' => $key,
                'label' => $date->format('M d'),
                'opened' => $opened[$key]->count ?? 0,
                'resolved' => $resolved[$key]->count ?? 0,
            ];
            $date->addDay();
        }

        return $data;
    }

    /**
     * Status distribution.
     */
    public function getStatusDistribution(): array
    {
        return Ticket::where('status', '!=', TicketStatus::DRAFT)->select('status', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => $item->status->value,
                'label' => $item->status->label(),
                'count' => $item->count,
            ])
            ->toArray();
    }

    /**
     * Priority distribution.
     */
    public function getPriorityDistribution(): array
    {
        return Ticket::where('status', '!=', TicketStatus::DRAFT)->select('priority', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('priority')
            ->get()
            ->map(fn ($item) => [
                'priority' => $item->priority->value,
                'label' => $item->priority->label(),
                'count' => $item->count,
            ])
            ->toArray();
    }

    /**
     * Category distribution.
     */
    public function getCategoryDistribution(): array
    {
        return Ticket::where('status', '!=', TicketStatus::DRAFT)->select('category_id', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get()
            ->map(fn ($item) => [
                'category' => $item->category?->name ?? 'Uncategorized',
                'count' => $item->count,
            ])
            ->sortByDesc('count')
            ->values()
            ->toArray();
    }

    /**
     * Resolution time trend (daily avg hours).
     */
    public function getResolutionTimeTrend(): array
    {
        $data = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(
                DB::raw('DATE(closed_at) as date'),
                DB::raw('AVG(CAST((JULIANDAY(closed_at) - JULIANDAY(created_at)) * 24 AS REAL)) as avg_hours'),
                DB::raw('count(*) as count')
            )
            ->whereNotNull('closed_at')
            ->whereBetween('closed_at', [$this->from, $this->to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $data->map(fn ($item) => [
            'date' => $item->date,
            'label' => Carbon::parse($item->date)->format('M d'),
            'avgHours' => round($item->avg_hours, 1),
            'count' => $item->count,
        ])->toArray();
    }

    /**
     * Technician performance.
     */
    public function getTechnicianPerformance(): array
    {
        return Ticket::where('status', '!=', TicketStatus::DRAFT)->select(
                'assigned_to',
                DB::raw('count(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as resolved"),
                DB::raw("SUM(CASE WHEN due_at < datetime('now') AND status != 'closed' THEN 1 ELSE 0 END) as overdue"),
                DB::raw("AVG(CASE WHEN closed_at IS NOT NULL THEN CAST((JULIANDAY(closed_at) - JULIANDAY(created_at)) * 24 AS REAL) ELSE NULL END) as avg_hours")
            )
            ->whereNotNull('assigned_to')
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('assigned_to')
            ->with('assignee:id,name')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->assignee?->name ?? 'Unassigned',
                'total' => $item->total,
                'resolved' => $item->resolved,
                'overdue' => $item->overdue,
                'pending' => $item->total - $item->resolved,
                'avgHours' => $item->avg_hours ? round($item->avg_hours, 1) : null,
            ])
            ->sortByDesc('total')
            ->values()
            ->toArray();
    }

    /**
     * Activity heatmap (day of week x hour).
     */
    public function getActivityHeatmap(): array
    {
        $raw = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(
                DB::raw("CAST(strftime('%w', created_at) AS INTEGER) as day_of_week"),
                DB::raw("CAST(strftime('%H', created_at) AS INTEGER) as hour"),
                DB::raw('count(*) as count')
            )
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('day_of_week', 'hour')
            ->get();

        $days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $heatmap = [];

        foreach ($raw as $item) {
            $heatmap[] = [
                'day' => $days[$item->day_of_week] ?? 'N/A',
                'dayIndex' => $item->day_of_week,
                'hour' => $item->hour,
                'count' => $item->count,
            ];
        }

        return $heatmap;
    }

    /**
     * Ticket lifecycle funnel.
     */
    public function getLifecycleFunnel(): array
    {
        $total = $this->periodQuery()->count();
        $assigned = (clone $this->periodQuery())->whereNotNull('assigned_to')->count();
        $inProgress = (clone $this->periodQuery())->whereIn('status', [TicketStatus::ON_PROCESS, TicketStatus::CLOSED])->count();
        $resolved = (clone $this->periodQuery())->where('status', TicketStatus::CLOSED)->count();
        $rated = (clone $this->periodQuery())->whereNotNull('rating')->count();

        return [
            ['stage' => 'Created', 'count' => $total],
            ['stage' => 'Assigned', 'count' => $assigned],
            ['stage' => 'In Progress', 'count' => $inProgress],
            ['stage' => 'Resolved', 'count' => $resolved],
            ['stage' => 'Rated', 'count' => $rated],
        ];
    }

    /**
     * User satisfaction analytics.
     */
    public function getSatisfactionAnalytics(): array
    {
        $ratings = Ticket::where('status', '!=', TicketStatus::DRAFT)->select('rating', DB::raw('count(*) as count'))
            ->whereNotNull('rating')
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('rating')
            ->orderBy('rating')
            ->get();

        $avgRating = Ticket::where('status', '!=', TicketStatus::DRAFT)->whereNotNull('rating')
            ->whereBetween('created_at', [$this->from, $this->to])
            ->avg('rating');

        $totalRated = $ratings->sum('count');

        return [
            'avgRating' => $avgRating ? round($avgRating, 1) : null,
            'totalRated' => $totalRated,
            'distribution' => $ratings->map(fn ($item) => [
                'rating' => $item->rating,
                'count' => $item->count,
            ])->toArray(),
        ];
    }

    /**
     * Reopened tickets analytics.
     */
    public function getReopenedAnalytics(): array
    {
        $total = $this->periodQuery()->count();
        $reopened = (clone $this->periodQuery())->where('status', TicketStatus::REOPENED)->count();
        $prevReopened = $this->previousPeriodQuery()->where('status', TicketStatus::REOPENED)->count();

        return [
            'count' => $reopened,
            'prevCount' => $prevReopened,
            'rate' => $total > 0 ? round(($reopened / $total) * 100, 1) : 0,
        ];
    }

    /**
     * SLA trend over time.
     */
    public function getSlaTrend(): array
    {
        $data = Ticket::where('status', '!=', TicketStatus::DRAFT)->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total'),
                DB::raw("SUM(CASE WHEN due_at IS NOT NULL AND (
                    (status = 'closed' AND closed_at <= due_at) OR
                    (status != 'closed' AND due_at >= datetime('now'))
                ) THEN 1 ELSE 0 END) as met")
            )
            ->whereNotNull('due_at')
            ->whereBetween('created_at', [$this->from, $this->to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $data->map(fn ($item) => [
            'date' => $item->date,
            'label' => Carbon::parse($item->date)->format('M d'),
            'compliance' => $item->total > 0 ? round(($item->met / $item->total) * 100, 1) : 100,
            'total' => $item->total,
            'met' => $item->met,
        ])->toArray();
    }

    // --- Helpers ---

    protected function periodQuery()
    {
        return Ticket::where('status', '!=', TicketStatus::DRAFT)
            ->whereBetween('created_at', [$this->from, $this->to]);
    }

    protected function previousPeriodQuery()
    {
        return Ticket::where('status', '!=', TicketStatus::DRAFT)
            ->whereBetween('created_at', [$this->prevFrom, $this->prevTo]);
    }
}
