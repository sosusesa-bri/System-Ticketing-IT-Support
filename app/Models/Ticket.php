<?php

namespace App\Models;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ticket_number',
        'title',
        'description',
        'status',
        'priority',
        'user_id',
        'category_id',
        'assigned_to',
        'solution_notes',
        'due_at',
        'response_due_at',
        'first_responded_at',
        'is_escalated',
        'escalation_level',
        'escalated_at',
        'escalation_reason',
        'rating',
        'feedback_notes',
        'closed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TicketStatus::class,
            'priority' => TicketPriority::class,
            'closed_at' => 'datetime',
            'due_at' => 'datetime',
            'response_due_at' => 'datetime',
            'first_responded_at' => 'datetime',
            'escalated_at' => 'datetime',
            'is_escalated' => 'boolean',
        ];
    }

    /**
     * The user who created this ticket.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The category of this ticket.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    /**
     * The technician assigned to this ticket.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Comments on this ticket.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    /**
     * Attachments on this ticket.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }

    /**
     * Assignment history for this ticket.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(TicketAssignment::class);
    }

    /**
     * Activity logs related to this ticket.
     */
    public function activityLogs()
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }

    /**
     * Tags associated with this ticket.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'ticket_tag')->withTimestamps();
    }

    /**
     * Scope: filter by status.
     */
    public function scopeStatus($query, TicketStatus $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: filter by priority.
     */
    public function scopePriority($query, TicketPriority $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope: only open or reopened tickets.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', [TicketStatus::OPEN, TicketStatus::ON_PROCESS, TicketStatus::REOPENED]);
    }

    /**
     * Scope: urgent tickets (high or critical priority).
     */
    public function scopeUrgent($query)
    {
        return $query->whereIn('priority', [TicketPriority::HIGH, TicketPriority::CRITICAL]);
    }
}
