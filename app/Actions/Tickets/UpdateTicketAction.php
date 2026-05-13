<?php

namespace App\Actions\Tickets;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\AuditService;
use Illuminate\Support\Facades\DB;

use Illuminate\Validation\ValidationException;

class UpdateTicketAction
{
    /**
     * Update a ticket with status transition validation.
     *
     * @param array<string, mixed> $data
     */
    public function execute(Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($ticket, $data) {
            $oldStatus = $ticket->status;
            $changes = [];

            // Track status change
            if (isset($data['status'])) {
                $newStatus = TicketStatus::from($data['status']);

                if (! $oldStatus->canTransitionTo($newStatus)) {
                    throw ValidationException::withMessages([
                        'status' => 'td_invalidTransition'
                    ]);
                }

                $changes['status'] = ['from' => $oldStatus->value, 'to' => $data['status']];

                if ($newStatus === TicketStatus::CLOSED) {
                    $data['closed_at'] = now();
                }

                if ($newStatus === TicketStatus::REOPENED) {
                    $data['closed_at'] = null;
                }

                // If submitting a draft
                if ($oldStatus === TicketStatus::DRAFT && $newStatus === TicketStatus::OPEN) {
                    $priorityEnum = $ticket->priority;
                    if (isset($data['priority'])) {
                        $priorityEnum = \App\Enums\TicketPriority::from($data['priority']);
                    }
                    $data['due_at'] = now()->addHours($priorityEnum->slaHours());
                    $data['response_due_at'] = now()->addHours($priorityEnum->responseSlaHours());

                    // Auto-assign logic
                    $assignedAdmin = \App\Models\User::where('role', \App\Enums\UserRole::ADMIN)
                        ->withCount(['assignedTickets' => function ($query) {
                            $query->whereIn('status', ['open', 'on_process', 'reopened']);
                        }])
                        ->orderBy('assigned_tickets_count', 'asc')
                        ->first();
                    
                    if ($assignedAdmin && empty($data['assigned_to']) && empty($ticket->assigned_to)) {
                        $data['assigned_to'] = $assignedAdmin->id;
                        \App\Models\TicketAssignment::create([
                            'ticket_id' => $ticket->id,
                            'assigned_by' => $ticket->user_id,
                            'assigned_to' => $assignedAdmin->id,
                            'notes' => 'Auto-assigned by intelligent workload distribution.',
                        ]);
                    }
                }
            }

            // Track assignment change
            if (isset($data['assigned_to']) && $data['assigned_to'] !== $ticket->assigned_to) {
                $changes['assigned_to'] = [
                    'from' => $ticket->assigned_to,
                    'to' => $data['assigned_to'],
                ];
            }

            $ticket->update($data);
            $ticket->refresh();

            $action = isset($changes['status'])
                ? 'ticket_status_changed'
                : 'ticket_updated';

            if (isset($changes['status']) && $changes['status']['from'] === TicketStatus::DRAFT->value && $changes['status']['to'] === TicketStatus::OPEN->value) {
                $action = 'ticket_draft_submitted';
            }

            AuditService::log(
                $action,
                "Ticket {$ticket->ticket_number} updated",
                $ticket,
                $changes ?: null,
            );

            // Trigger notification if status changed
            if (isset($changes['status']) && $oldStatus->value !== $data['status']) {
                $ticket->user->notify(new \App\Notifications\TicketStatusUpdated($ticket, $oldStatus->value, $data['status']));
            }

            return $ticket;
        });
    }
}
