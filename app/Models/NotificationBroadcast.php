<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotificationBroadcast extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'target_audience' => 'array',
        'channels' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function template()
    {
        return $this->belongsTo(NotificationTemplate::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function deliveryLogs()
    {
        return $this->hasMany(NotificationDeliveryLog::class, 'broadcast_id');
    }

    public function attachments()
    {
        return $this->hasMany(NotificationAttachment::class, 'broadcast_id');
    }
}
