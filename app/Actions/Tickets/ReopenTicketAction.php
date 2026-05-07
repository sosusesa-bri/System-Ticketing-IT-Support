<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Services\AuditService;
use Illuminate\Support\Facades\DB;

class ReopenTicketAction
{
    /**
     * Reopen a closed ticket.
     *
     * @param Ticket $ticket
     */
    public function execute(Ticket $ticket): Ticket
    {
        return DB::transaction(function () use ($ticket) {
            $ticket->update([
                'status' => 'reopened',
                'closed_at' => null,
            ]);

            AuditService::log(
                'ticket_reopened',
                "Ticket {$ticket->ticket_number} was reopened",
                $ticket,
                ['status' => 'reopened']
            );

            return $ticket;
        });
    }
}
