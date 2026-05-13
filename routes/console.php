<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Run the audit cleanup command daily at midnight. Default retention is 180 days.
Schedule::command('audit:cleanup')->dailyAt('00:00');
