<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('audit:cleanup {--days=180 : The number of days to retain audit logs}')]
#[Description('Clean up old audit logs from the database.')]
class CleanupAuditLogs extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->option('days');
        
        if ($days <= 0) {
            $this->error('The --days option must be greater than 0.');
            return self::FAILURE;
        }

        $cutoffDate = Carbon::now()->subDays($days);
        
        $this->info("Cleaning up audit logs older than {$days} days ({$cutoffDate->toDateString()})...");

        try {
            $deletedCount = ActivityLog::where('created_at', '<', $cutoffDate)->delete();
            $this->info("Successfully deleted {$deletedCount} old audit log(s).");
            
            if ($deletedCount > 0) {
                Log::info("Audit log cleanup completed. Deleted {$deletedCount} records older than {$days} days.");
            }
            
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Failed to clean up audit logs: {$e->getMessage()}");
            Log::error("Audit log cleanup failed: {$e->getMessage()}");
            return self::FAILURE;
        }
    }
}
