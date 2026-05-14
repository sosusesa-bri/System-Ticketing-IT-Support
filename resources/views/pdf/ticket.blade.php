<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket #{{ $ticket->ticket_number }}</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.5; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; margin: 0 0 5px 0; color: #1e3a8a; }
        .ticket-number { font-size: 14px; color: #6b7280; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-right: 5px; }
        .badge-open { background-color: #dbeafe; color: #1e40af; }
        .badge-closed { background-color: #d1fae5; color: #065f46; }
        .badge-high { background-color: #fee2e2; color: #991b1b; }
        .badge-medium { background-color: #fef3c7; color: #92400e; }
        .badge-low { background-color: #f3f4f6; color: #374151; }
        .badge-default { background-color: #f3f4f6; color: #374151; }
        
        table { w-full; border-collapse: collapse; margin-bottom: 20px; width: 100%; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        th { font-weight: 600; color: #4b5563; width: 150px; }
        
        .section-title { font-size: 18px; font-weight: bold; margin: 30px 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; color: #1f2937; }
        .description-box { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; margin-bottom: 20px; white-space: pre-wrap; }
        
        .comment { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #e5e7eb; }
        .comment-header { font-weight: bold; font-size: 13px; color: #4b5563; margin-bottom: 5px; }
        .comment-time { font-weight: normal; color: #9ca3af; font-size: 11px; margin-left: 10px; }
        .comment-body { white-space: pre-wrap; }
        .internal-note { background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 10px; }
        
        .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">{{ $ticket->title }}</h1>
        <div class="ticket-number">
            Ticket #{{ $ticket->ticket_number }} | Created: {{ $ticket->created_at->format('M d, Y H:i') }}
        </div>
        <div style="margin-top: 10px;">
            <span class="badge badge-{{ $ticket->status->value === 'closed' ? 'closed' : ($ticket->status->value === 'open' ? 'open' : 'default') }}">
                {{ $ticket->status->value }}
            </span>
            <span class="badge badge-{{ $ticket->priority->value }}">
                {{ $ticket->priority->value }}
            </span>
        </div>
    </div>

    <table>
        <tr>
            <th>Requester:</th>
            <td>{{ $ticket->user->name }} ({{ $ticket->user->email }})</td>
        </tr>
        <tr>
            <th>Category:</th>
            <td>{{ $ticket->category ? $ticket->category->name : '-' }}</td>
        </tr>
        <tr>
            <th>Assigned To:</th>
            <td>{{ $ticket->assignee ? $ticket->assignee->name : 'Unassigned' }}</td>
        </tr>
        @if($ticket->due_at)
        <tr>
            <th>SLA Deadline:</th>
            <td>{{ $ticket->due_at }}</td>
        </tr>
        @endif
        @if($ticket->closed_at)
        <tr>
            <th>Closed At:</th>
            <td>{{ $ticket->closed_at }}</td>
        </tr>
        @endif
        @if($ticket->tags && $ticket->tags->count() > 0)
        <tr>
            <th>Tags:</th>
            <td>{{ $ticket->tags->pluck('name')->join(', ') }}</td>
        </tr>
        @endif
    </table>

    <h2 class="section-title">Description</h2>
    <div class="description-box">
{{ $ticket->description }}
    </div>

    @if($ticket->solution_notes)
    <h2 class="section-title">Solution Notes</h2>
    <div class="description-box" style="background-color: #ecfdf5; border-color: #a7f3d0;">
{{ $ticket->solution_notes }}
    </div>
    @endif

    <h2 class="section-title">Communication History</h2>
    
    @if($ticket->comments->count() > 0)
        @foreach($ticket->comments as $comment)
        <div class="comment {{ $comment->is_internal ? 'internal-note' : '' }}">
            <div class="comment-header">
                {{ $comment->user->name }}
                @if($comment->is_internal)
                <span style="color: #f59e0b; margin-left: 5px;">[Internal Note]</span>
                @endif
                <span class="comment-time">{{ $comment->created_at->format('M d, Y H:i') }}</span>
            </div>
            <div class="comment-body">{{ $comment->body }}</div>
        </div>
        @endforeach
    @else
        <p style="color: #6b7280; font-style: italic;">No communication history.</p>
    @endif

    <div class="footer">
        Generated by POLMIND IT Support System on {{ now()->format('M d, Y H:i') }}
    </div>
</body>
</html>
