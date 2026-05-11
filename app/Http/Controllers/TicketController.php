<?php

namespace App\Http\Controllers;

use App\Actions\Tickets\CreateTicketAction;
use App\Actions\Tickets\ReopenTicketAction;
use App\Actions\Tickets\UpdateTicketAction;
use App\Http\Requests\Tickets\StoreTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\TicketCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * List the current user's tickets.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::where('user_id', $request->user()->id)
            ->with(['category', 'assignee']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        $tickets = $query->latest()
            ->paginate(15)
            ->through(fn (Ticket $ticket) => [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'title' => $ticket->title,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'category' => $ticket->category?->name,
                'assigned_to' => $ticket->assignee?->name,
                'created_at' => $ticket->created_at->format('d M Y'),
            ]);

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'priority', 'search']),
        ]);
    }

    /**
     * Show the create ticket form.
     */
    public function create(): Response
    {
        return Inertia::render('Tickets/Create', [
            'categories' => TicketCategory::active()->get(['id', 'name']),
        ]);
    }

    /**
     * Check for duplicate/similar open tickets.
     */
    public function checkDuplicates(Request $request)
    {
        $title = $request->input('title');
        $categoryId = $request->input('category_id');

        if (!$title || strlen($title) < 5) {
            return response()->json([]);
        }

        $query = Ticket::whereIn('status', ['open', 'on_process', 'reopened'])
            ->where(function ($q) use ($title) {
                $words = array_filter(explode(' ', $title), fn($w) => strlen($w) > 3);
                if (count($words) === 0) {
                    $q->where('title', 'like', "%{$title}%");
                } else {
                    foreach ($words as $word) {
                        $q->orWhere('title', 'like', "%{$word}%");
                    }
                }
            });

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $duplicates = $query->latest()
            ->take(3)
            ->get(['id', 'ticket_number', 'title', 'status', 'created_at'])
            ->map(fn($t) => [
                'id' => $t->id,
                'ticket_number' => $t->ticket_number,
                'title' => $t->title,
                'status' => $t->status->label(),
                'created_at' => $t->created_at->diffForHumans(),
            ]);

        return response()->json($duplicates);
    }

    /**
     * Store a new ticket.
     */
    public function store(StoreTicketRequest $request, CreateTicketAction $action): RedirectResponse
    {
        $ticket = $action->execute(
            array_merge($request->validated(), ['user_id' => $request->user()->id]),
            $request->file('attachments'),
        );

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('success', "Ticket {$ticket->ticket_number} created successfully.");
    }

    /**
     * Show ticket detail.
     */
    public function show(Ticket $ticket): Response
    {
        $this->authorize('view', $ticket);

        $ticket->load([
            'user',
            'category',
            'assignee',
            'comments.user',
            'attachments',
            'assignments.assigner',
            'assignments.assignee',
        ]);

        $activityLogs = $ticket->activityLogs()
            ->with('user')
            ->latest('created_at')
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user' => $log->user?->name ?? 'System',
                'properties' => $log->properties,
                'created_at' => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('Tickets/Show', [
            'ticket' => [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'title' => $ticket->title,
                'description' => $ticket->description,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'solution_notes' => $ticket->solution_notes,
                'due_at' => $ticket->due_at?->format('d M Y, H:i'),
                'response_due_at' => $ticket->response_due_at?->format('d M Y, H:i'),
                'first_responded_at' => $ticket->first_responded_at?->format('d M Y, H:i'),
                'is_escalated' => $ticket->is_escalated,
                'escalation_level' => $ticket->escalation_level,
                'escalated_at' => $ticket->escalated_at?->format('d M Y, H:i'),
                'escalation_reason' => $ticket->escalation_reason,
                'rating' => $ticket->rating,
                'feedback_notes' => $ticket->feedback_notes,
                'created_at' => $ticket->created_at->format('d M Y, H:i'),
                'closed_at' => $ticket->closed_at?->format('d M Y, H:i'),
                'user' => ['id' => $ticket->user->id, 'name' => $ticket->user->name],
                'category' => $ticket->category ? ['id' => $ticket->category->id, 'name' => $ticket->category->name] : null,
                'assignee' => $ticket->assignee ? ['id' => $ticket->assignee->id, 'name' => $ticket->assignee->name] : null,
                'comments' => $ticket->comments->map(fn ($c) => [
                    'id' => $c->id,
                    'body' => $c->body,
                    'is_internal' => $c->is_internal,
                    'user' => ['id' => $c->user->id, 'name' => $c->user->name, 'role' => $c->user->role],
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
                'attachments' => $ticket->attachments->map(fn ($a) => [
                    'id' => $a->id,
                    'original_name' => $a->original_name,
                    'mime_type' => $a->mime_type,
                    'formatted_size' => $a->formatted_size,
                    'url' => route('attachments.show', $a->id),
                ]),
            ],
            'activityLogs' => $activityLogs,
        ]);
    }

    /**
     * Update a ticket.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket, UpdateTicketAction $action): RedirectResponse
    {
        $this->authorize('update', $ticket);

        $action->execute($ticket, $request->validated());

        return back()->with('success', 'Ticket updated successfully.');
    }

    /**
     * Reopen a closed ticket.
     */
    public function reopen(Ticket $ticket, ReopenTicketAction $action): RedirectResponse
    {
        $this->authorize('update', $ticket);

        $action->execute($ticket);

        return back()->with('success', 'Ticket reopened successfully.');
    }

    /**
     * Submit CSAT rating for a closed ticket.
     */
    public function rate(Request $request, Ticket $ticket): RedirectResponse
    {
        $this->authorize('rate', $ticket);

        if ($ticket->status->value !== 'closed') {
            return back()->with('error', 'You can only rate closed tickets.');
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $ticket->update([
            'rating' => $validated['rating'],
            'feedback_notes' => $validated['feedback_notes'] ?? null,
        ]);

        \App\Services\AuditService::log('ticket_rated', "User rated ticket {$ticket->ticket_number} with {$validated['rating']} stars", $ticket);

        return back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * Delete a ticket (admin only, soft delete).
     */
    public function destroy(Ticket $ticket): RedirectResponse
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket deleted.');
    }
}
