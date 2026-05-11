<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    /**
     * Store a new comment on a ticket.
     */
    public function store(Request $request, Ticket $ticket): RedirectResponse
    {
        $this->authorize('view', $ticket);

        $validated = $request->validate([
            'body' => ['required', 'string', 'min:2'],
            'is_internal' => ['boolean'],
        ]);

        // Only admins can post internal notes
        $isInternal = $request->user()->isAdmin() && ($validated['is_internal'] ?? false);

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'is_internal' => $isInternal,
        ]);

        if ($request->user()->isAdmin() && !$ticket->first_responded_at) {
            $ticket->update(['first_responded_at' => now()]);
        }

        AuditService::log(
            'comment_added',
            "Comment added to ticket {$ticket->ticket_number}",
            $ticket,
            ['comment_id' => $comment->id, 'is_internal' => $isInternal],
        );

        return back()->with('success', 'Comment posted.');
    }
}
