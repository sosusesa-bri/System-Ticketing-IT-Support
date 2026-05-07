<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationAttachment extends Model
{
    protected $guarded = [];

    public function broadcast()
    {
        return $this->belongsTo(NotificationBroadcast::class, 'broadcast_id');
    }
}
