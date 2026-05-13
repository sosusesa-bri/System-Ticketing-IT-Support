<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Tickets\UpdateTicketAction;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\TicketAssignment;
use App\Models\TicketCategory;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTicketController extends Controller
{
    /**
     * List all tickets with filters.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::with(['user', 'category', 'assignee']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', '!=', 'draft');
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('assigned_to')) {
            if ($request->assigned_to === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $request->assigned_to);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('dir', 'desc');
        $query->orderBy($sortField, $sortDir);

        $tickets = $query->paginate(20)->through(fn (Ticket $ticket) => [
            'id' => $ticket->id,
            'ticket_number' => $ticket->ticket_number,
            'title' => $ticket->title,
            'status' => $ticket->status,
            'priority' => $ticket->priority,
            'requester' => $ticket->user->name,
            'category' => $ticket->category?->name,
            'assigned_to' => $ticket->assignee?->name,
            'created_at' => $ticket->created_at->format('d M Y'),
        ]);

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'priority', 'category', 'assigned_to', 'search', 'sort', 'dir']),
            'categories' => TicketCategory::active()->get(['id', 'name']),
            'admins' => User::where('role', UserRole::ADMIN)->get(['id', 'name']),
        ]);
    }

    /**
     * Show ticket detail with admin controls.
     */
    public function show(Ticket $ticket): Response
    {
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
                'avatar_path' => $log->user?->avatar_path,
                'properties' => $log->properties,
                'created_at' => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Tickets/Show', [
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
                'user' => ['id' => $ticket->user->id, 'name' => $ticket->user->name, 'email' => $ticket->user->email, 'department' => $ticket->user->department, 'avatar_path' => $ticket->user->avatar_path],
                'category' => $ticket->category ? ['id' => $ticket->category->id, 'name' => $ticket->category->name] : null,
                'assignee' => $ticket->assignee ? ['id' => $ticket->assignee->id, 'name' => $ticket->assignee->name] : null,
                'comments' => $ticket->comments->map(fn ($c) => [
                    'id' => $c->id,
                    'body' => $c->body,
                    'is_internal' => $c->is_internal,
                    'user' => ['id' => $c->user->id, 'name' => $c->user->name, 'role' => $c->user->role, 'avatar_path' => $c->user->avatar_path],
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
                'attachments' => $ticket->attachments->map(fn ($a) => [
                    'id' => $a->id,
                    'original_name' => $a->original_name,
                    'mime_type' => $a->mime_type,
                    'formatted_size' => $a->formatted_size,
                    'url' => route('attachments.show', $a->id),
                ]),
                'assignments' => $ticket->assignments->map(fn ($a) => [
                    'id' => $a->id,
                    'assigner' => $a->assigner->name,
                    'assignee' => $a->assignee->name,
                    'notes' => $a->notes,
                    'created_at' => $a->created_at->diffForHumans(),
                ]),
            ],
            'activityLogs' => $activityLogs,
            'admins' => User::where('role', UserRole::ADMIN)->get(['id', 'name']),
            'macros' => \App\Models\CannedResponse::where('is_active', true)->get(['id', 'title_en', 'title_id', 'body_en', 'body_id']),
        ]);
    }

    /**
     * Update ticket status, priority, or solution notes.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket, UpdateTicketAction $action): RedirectResponse
    {
        $action->execute($ticket, $request->validated());
        return back()->with('success', 'td_ticketUpdatedSuccess');
    }

    /**
     * Assign ticket to an admin/support staff.
     */
    public function assign(Request $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'assigned_to' => ['required', 'exists:users,id'],
            'notes' => ['nullable', 'string'],
        ]);

        $ticket->update(['assigned_to' => $validated['assigned_to']]);

        TicketAssignment::create([
            'ticket_id' => $ticket->id,
            'assigned_by' => $request->user()->id,
            'assigned_to' => $validated['assigned_to'],
            'notes' => $validated['notes'] ?? null,
        ]);

        AuditService::log(
            'ticket_assigned',
            "Ticket {$ticket->ticket_number} assigned",
            $ticket,
            ['assigned_to' => $validated['assigned_to']],
        );

        return back()->with('success', 'td_ticketAssignedSuccess');
    }

    /**
     * Escalate a ticket.
     */
    public function escalate(Request $request, Ticket $ticket, \App\Actions\Tickets\EscalateTicketAction $action): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $action->execute($ticket, $validated['reason']);

        return back()->with('success', 'td_ticketEscalatedSuccess');
    }
}
