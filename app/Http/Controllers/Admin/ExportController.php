<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export all tickets to CSV.
     */
    public function exportTickets(Request $request): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tickets_export_' . now()->format('Ymd_His') . '.csv"',
        ];

        return response()->stream(function () use ($request) {
            $handle = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($handle, [
                'ID', 'Ticket Number', 'Title', 'Status', 'Priority', 
                'Category', 'Requester', 'Assigned To', 'SLA Deadline', 
                'CSAT Rating', 'Created At', 'Closed At'
            ]);

            // Chunk data to avoid memory exhaustion
            Ticket::with(['category', 'user', 'assignee'])
                ->latest()
                ->chunk(500, function ($tickets) use ($handle) {
                    foreach ($tickets as $ticket) {
                        fputcsv($handle, [
                            $ticket->id,
                            $ticket->ticket_number,
                            $ticket->title,
                            $ticket->status->value,
                            $ticket->priority->value,
                            $ticket->category?->name ?? 'None',
                            $ticket->user?->name ?? 'Unknown',
                            $ticket->assignee?->name ?? 'Unassigned',
                            $ticket->due_at?->format('Y-m-d H:i:s') ?? '',
                            $ticket->rating ?? '',
                            $ticket->created_at->format('Y-m-d H:i:s'),
                            $ticket->closed_at?->format('Y-m-d H:i:s') ?? '',
                        ]);
                    }
                });

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Export audit logs to CSV.
     */
    public function exportAuditLogs(Request $request): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="audit_logs_export_' . now()->format('Ymd_His') . '.csv"',
        ];

        return response()->stream(function () use ($request) {
            $handle = fopen('php://output', 'w');
            
            fputcsv($handle, [
                'Date', 'Action', 'Description', 'User', 'IP Address', 'Subject Type', 'Subject ID'
            ]);

            ActivityLog::with('user')
                ->latest('created_at')
                ->chunk(1000, function ($logs) use ($handle) {
                    foreach ($logs as $log) {
                        fputcsv($handle, [
                            $log->created_at->format('Y-m-d H:i:s'),
                            $log->action,
                            $log->description,
                            $log->user?->name ?? 'System',
                            $log->ip_address ?? '',
                            $log->subject_type ?? '',
                            $log->subject_id ?? '',
                        ]);
                    }
                });

            fclose($handle);
        }, 200, $headers);
    }
}
