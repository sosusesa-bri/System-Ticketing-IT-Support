<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * Any authenticated user can view the ticket list (filtered to their own).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Users can view their own tickets. Admins can view all.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() || $ticket->user_id == $user->id;
    }

    /**
     * Any authenticated user can create tickets.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Users can update their own open tickets. Admins can update any.
     */
    public function update(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $ticket->user_id == $user->id && $ticket->status->value !== 'closed';
    }

    /**
     * Users can delete their own draft tickets. Admins can delete any.
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $ticket->user_id == $user->id && $ticket->status->value === 'draft';
    }

    /**
     * Only admins can assign tickets.
     */
    public function assign(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Only admins can change ticket status.
     */
    public function changeStatus(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Ticket owners can rate their own closed tickets.
     */
    public function rate(User $user, Ticket $ticket): bool
    {
        return $ticket->user_id == $user->id && $ticket->status->value === 'closed';
    }

    /**
     * Ticket owners can reopen their own closed tickets.
     */
    public function reopen(User $user, Ticket $ticket): bool
    {
        return ($user->isAdmin() || $ticket->user_id == $user->id) && $ticket->status->value === 'closed';
    }
}
