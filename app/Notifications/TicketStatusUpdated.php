<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public $ticket;
    public $oldStatus;
    public $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, string $oldStatus, string $newStatus)
    {
        $this->ticket = $ticket;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // By default send to database, you can add 'mail' if needed.
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Ticket Status Updated: ' . $this->ticket->ticket_number)
                    ->line('The status of your ticket "' . $this->ticket->title . '" has been updated.')
                    ->line('From: ' . strtoupper($this->oldStatus) . ' -> To: ' . strtoupper($this->newStatus))
                    ->action('View Ticket', route('tickets.show', $this->ticket->id))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'title' => $this->ticket->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message_en' => "Ticket {$this->ticket->ticket_number} status changed to {$this->newStatus}.",
            'message_id' => "Status tiket {$this->ticket->ticket_number} berubah menjadi {$this->newStatus}.",
            'type' => 'status_update'
        ];
    }
}
