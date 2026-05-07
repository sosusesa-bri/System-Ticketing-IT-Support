<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationAutomationRule extends Model
{
    protected $guarded = [];

    protected $casts = [
        'conditions' => 'array',
        'action' => 'array',
        'is_active' => 'boolean',
    ];

    public function template()
    {
        return $this->belongsTo(NotificationTemplate::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
