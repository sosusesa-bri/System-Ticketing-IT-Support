<?php

namespace App\Services;

use App\Models\NotificationBroadcast;
use App\Models\NotificationDeliveryLog;
use App\Models\User;
use App\Notifications\BroadcastNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Resolve target audience into a list of users.
     */
    public function resolveAudience(array $targetData)
    {
        $type = $targetData['type'] ?? 'all';
        $values = $targetData['values'] ?? [];

        if ($type === 'all') {
            return User::get();
        }

        if ($type === 'department' && !empty($values)) {
            return User::whereIn('department', $values)->get();
        }

        if ($type === 'role' && !empty($values)) {
            return User::whereIn('role', $values)->get();
        }

        if ($type === 'user' && !empty($values)) {
            return User::whereIn('id', $values)->get();
        }

        return collect();
    }

    /**
     * Dispatch a broadcast immediately.
     */
    public function dispatchBroadcast(NotificationBroadcast $broadcast)
    {
        $users = $this->resolveAudience($broadcast->target_audience);
        
        if ($users->isEmpty()) {
            $broadcast->update(['status' => 'completed', 'sent_at' => now()]);
            return 0;
        }

        $broadcast->update(['status' => 'processing']);

        $sentCount = 0;
        
        DB::beginTransaction();
        try {
            foreach ($users as $user) {
                // If it's sent to database
                if (in_array('database', $broadcast->channels)) {
                    $user->notify(new BroadcastNotification(
                        $broadcast->title,
                        $broadcast->message,
                        $broadcast->type
                    ));

                    NotificationDeliveryLog::create([
                        'broadcast_id' => $broadcast->id,
                        'user_id' => $user->id,
                        'channel' => 'database',
                        'status' => 'sent',
                        'sent_at' => now(),
                    ]);
                    
                    $sentCount++;
                }

                // If email integration is supported later, add it here.
            }
            
            $broadcast->update([
                'status' => 'completed', 
                'sent_at' => now()
            ]);
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to process broadcast {$broadcast->id}: " . $e->getMessage());
            $broadcast->update(['status' => 'failed']);
        }

        return $sentCount;
    }
}
