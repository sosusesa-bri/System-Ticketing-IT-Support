<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class BroadcastNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $messageTitle;
    public string $messageBody;
    public string $type;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $title, string $body, string $type = 'info')
    {
        $this->messageTitle = $title;
        $this->messageBody = $body;
        $this->type = $type;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->messageTitle,
            'message' => $this->messageBody,
            'type' => $this->type,
            'url' => '#',
        ];
    }
}
