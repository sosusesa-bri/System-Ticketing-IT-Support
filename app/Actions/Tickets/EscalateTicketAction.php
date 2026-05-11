<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Services\AuditService;

class EscalateTicketAction
{
    /**
     * Escalate a ticket.
     */
    public function execute(Ticket $ticket, string $reason, int $level = null): Ticket
    {
        $newLevel = $level ?? ($ticket->escalation_level + 1);

        $ticket->update([
            'is_escalated' => true,
            'escalation_level' => $newLevel,
            'escalated_at' => now(),
            'escalation_reason' => $reason,
        ]);

        AuditService::log(
            'ticket_escalated',
            "Ticket {$ticket->ticket_number} escalated to level {$newLevel}",
            $ticket,
            ['reason' => $reason, 'level' => $newLevel]
        );

        return $ticket;
    }
}
