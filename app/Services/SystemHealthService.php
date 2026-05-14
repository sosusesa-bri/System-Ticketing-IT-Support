<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\KnowledgeBaseArticle;
use App\Models\Ticket;
use App\Models\User;
use App\Enums\TicketStatus;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SystemHealthService
{
    protected Carbon $from;
    protected Carbon $to;

    public function __construct(string $dateFrom, string $dateTo)
    {
        $this->from = Carbon::parse($dateFrom)->startOfDay();
        $this->to = Carbon::parse($dateTo)->endOfDay();
    }

    public function getActivityTrend(): array
    {
        $logs = ActivityLog::whereBetween('created_at', [$this->from, $this->to])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $this->fillMissingDates($logs, 'total');
    }

    public function getLogActionDistribution(): array
    {
        return ActivityLog::whereBetween('created_at', [$this->from, $this->to])
            ->select('action as name', DB::raw('COUNT(*) as value'))
            ->groupBy('action')
            ->orderByDesc('value')
            ->get()
            ->toArray();
    }

    public function getActiveUsersTrend(): array
    {
        $logins = User::whereNotNull('last_login_at')
            ->whereBetween('last_login_at', [$this->from, $this->to])
            ->select(
                DB::raw('DATE(last_login_at) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $this->fillMissingDates($logins, 'total');
    }

    public function getSlaTrend(): array
    {
        $tickets = Ticket::whereBetween('created_at', [$this->from, $this->to])
            ->whereNotNull('due_at')
            ->where('status', TicketStatus::CLOSED)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN closed_at <= due_at THEN 1 ELSE 0 END) as on_time')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $data = [];
        $current = $this->from->copy();

        while ($current <= $this->to) {
            $dateStr = $current->format('Y-m-d');
            $record = $tickets->firstWhere('date', $dateStr);

            $rate = 100;
            if ($record && $record->total > 0) {
                $rate = round(($record->on_time / $record->total) * 100, 1);
            }

            $data[] = [
                'date' => Carbon::parse($dateStr)->format('M d'),
                'rate' => $rate,
            ];

            $current->addDay();
        }

        return $data;
    }
    
    public function getModelCounts(): array
    {
        return [
            ['name' => 'Tickets', 'value' => Ticket::count()],
            ['name' => 'Users', 'value' => User::count()],
            ['name' => 'KB Articles', 'value' => KnowledgeBaseArticle::count()],
        ];
    }

    private function fillMissingDates($collection, string $valueKey): array
    {
        $data = [];
        $current = $this->from->copy();

        while ($current <= $this->to) {
            $dateStr = $current->format('Y-m-d');
            $record = $collection->firstWhere('date', $dateStr);

            $data[] = [
                'date' => Carbon::parse($dateStr)->format('M d'),
                $valueKey => $record ? (int) $record->{$valueKey} : 0,
            ];

            $current->addDay();
        }

        return $data;
    }
}
