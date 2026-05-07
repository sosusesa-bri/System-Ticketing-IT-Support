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
        ];
    }
}
