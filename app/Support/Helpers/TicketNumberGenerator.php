<?php

namespace App\Support\Helpers;

use App\Models\Ticket;

class TicketNumberGenerator
{
    /**
     * Generate a unique ticket number in format: TK-YYYYMMDD-XXXX
     */
    public static function generate(): string
    {
        $prefix = 'TK-' . now()->format('Ymd') . '-';

        $lastTicket = Ticket::withTrashed()
            ->where('ticket_number', 'like', $prefix . '%')
            ->orderByDesc('ticket_number')
            ->first();

        if ($lastTicket) {
            $lastNumber = (int) substr($lastTicket->ticket_number, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
