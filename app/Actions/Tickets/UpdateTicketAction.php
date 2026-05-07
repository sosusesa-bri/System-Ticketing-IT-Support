<?php

namespace App\Actions\Tickets;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\AuditService;
use Illuminate\Support\Facades\DB;

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
                    throw new \InvalidArgumentException(
                        "Cannot transition from {$oldStatus->label()} to {$newStatus->label()}."
                    );
                }

                $changes['status'] = ['from' => $oldStatus->value, 'to' => $data['status']];

                if ($newStatus === TicketStatus::CLOSED) {
                    $data['closed_at'] = now();
                }

                if ($newStatus === TicketStatus::REOPENED) {
                    $data['closed_at'] = null;
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

            AuditService::log(
                $action,
                "Ticket {$ticket->ticket_number} updated",
                $ticket,
                $changes ?: null,
            );

            return $ticket;
        });
    }
}
