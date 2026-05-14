<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaqAttachment extends Model
{
    protected $fillable = [
        'faq_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];

    /**
     * Get the FAQ that owns the attachment.
     */
    public function faq(): BelongsTo
    {
        return $this->belongsTo(Faq::class);
    }
}
