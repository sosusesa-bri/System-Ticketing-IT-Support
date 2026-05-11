<?php

namespace App\Services;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\ActivityLog;
use App\Models\Ticket;
use App\Models\User;

class DashboardService
{
    /**
     * Get dashboard data for a regular user.
     *
     * @return array<string, mixed>
     */
    public function getUserDashboard(User $user): array
    {
        $ticketsQuery = Ticket::where('user_id', $user->id);

        return [
            'stats' => [
                'total' => (clone $ticketsQuery)->count(),
                'open' => (clone $ticketsQuery)->where('status', TicketStatus::OPEN)->count(),
                'in_progress' => (clone $ticketsQuery)->where('status', TicketStatus::ON_PROCESS)->count(),
                'closed' => (clone $ticketsQuery)->where('status', TicketStatus::CLOSED)->count(),
            ],
            'recentTickets' => Ticket::where('user_id', $user->id)
                ->with(['category', 'assignee'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (Ticket $ticket) => [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'title' => $ticket->title,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'category' => $ticket->category?->name,
                    'created_at' => $ticket->created_at->diffForHumans(),
                ]),
        ];
    }

    /**
     * Get dashboard data for admin.
     *
     * @return array<string, mixed>
     */
    public function getAdminDashboard(): array
    {
        return [
            'stats' => [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', TicketStatus::OPEN)->count(),
                'in_progress' => Ticket::where('status', TicketStatus::ON_PROCESS)->count(),
                'closed' => Ticket::where('status', TicketStatus::CLOSED)->count(),
                'urgent' => Ticket::urgent()->active()->count(),
                'unassigned' => Ticket::whereNull('assigned_to')->active()->count(),
            ],
            'priorityQueue' => Ticket::with(['user', 'category'])
                ->active()
                ->urgent()
                ->latest()
                ->take(10)
                ->get()
                ->map(fn (Ticket $ticket) => [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'title' => $ticket->title,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'requester' => $ticket->user->name,
                    'category' => $ticket->category?->name,
                    'assigned_to' => $ticket->assignee?->name,
                    'created_at' => $ticket->created_at->diffForHumans(),
                ]),
            'recentActivity' => ActivityLog::with('user')
                ->latest('created_at')
                ->take(10)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'user' => $log->user?->name ?? 'System',
                    'created_at' => $log->created_at->diffForHumans(),
                ]),
            'workload' => $this->getWorkloadMonitoring(),
        ];
    }

    /**
     * Workload monitoring data for all admin/technician users.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function getWorkloadMonitoring(): array
    {
        $admins = User::where('role', \App\Enums\UserRole::ADMIN)
            ->withCount([
                'assignedTickets as active_tickets_count' => function ($q) {
                    $q->whereIn('status', [
                        TicketStatus::OPEN,
                        TicketStatus::ON_PROCESS,
                        TicketStatus::REOPENED,
                    ]);
                },
                'assignedTickets as overdue_tickets_count' => function ($q) {
                    $q->whereIn('status', [
                        TicketStatus::OPEN,
                        TicketStatus::ON_PROCESS,
                        TicketStatus::REOPENED,
                    ])->where('due_at', '<', now());
                },
                'assignedTickets as resolved_count' => function ($q) {
                    $q->where('status', TicketStatus::CLOSED);
                },
            ])
            ->get();

        return $admins->map(fn (User $admin) => [
            'id'              => $admin->id,
            'name'            => $admin->name,
            'active'          => $admin->active_tickets_count,
            'overdue'         => $admin->overdue_tickets_count,
            'resolved'        => $admin->resolved_count,
            'avatar_path'     => $admin->avatar_path,
        ])->sortByDesc('active')->values()->toArray();
    }
}
