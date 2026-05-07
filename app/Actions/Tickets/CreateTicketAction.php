<?php

namespace App\Actions\Tickets;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Services\AuditService;
use App\Support\Helpers\TicketNumberGenerator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateTicketAction
{
    /**
     * Create a new ticket with optional attachments.
     *
     * @param array<string, mixed> $data
     * @param array<UploadedFile>|null $files
     */
    public function execute(array $data, ?array $files = null): Ticket
    {
        return DB::transaction(function () use ($data, $files) {
            $priorityEnum = \App\Enums\TicketPriority::from($data['priority']);
            
            $ticket = Ticket::create([
                'ticket_number' => TicketNumberGenerator::generate(),
                'title' => $data['title'],
                'description' => $data['description'],
                'priority' => $data['priority'],
                'category_id' => $data['category_id'],
                'user_id' => $data['user_id'],
                'status' => 'open',
                'due_at' => now()->addHours($priorityEnum->slaHours()),
            ]);

            if ($files) {
                foreach ($files as $file) {
                    $path = $file->store('ticket-attachments/' . $ticket->id, 'public');

                    TicketAttachment::create([
                        'ticket_id' => $ticket->id,
                        'user_id' => $data['user_id'],
                        'filename' => basename($path),
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'disk' => 'public',
                        'path' => $path,
                    ]);
                }
            }

            AuditService::log(
                'ticket_created',
                "Ticket {$ticket->ticket_number} created: {$ticket->title}",
                $ticket,
                ['priority' => $data['priority'], 'category_id' => $data['category_id']],
            );

            return $ticket;
        });
    }
}
