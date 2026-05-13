<?php

namespace App\Http\Controllers;

use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TicketAttachmentController extends Controller
{
    /**
     * Serve a ticket attachment file securely.
     *
     * Verifies the authenticated user owns the ticket or is an admin
     * before streaming the file.
     */
    public function show(Request $request, TicketAttachment $attachment): StreamedResponse
    {
        $user = $request->user();
        $ticket = $attachment->ticket;

        // Authorization: user must own the ticket or be admin
        if ($user->id !== $ticket->user_id && !$user->isAdmin()) {
            abort(403);
        }

        $disk = Storage::disk($attachment->disk);

        if (!$disk->exists($attachment->path)) {
            abort(404);
        }

        if ($request->has('download') && $request->download == 1) {
            return Storage::disk($attachment->disk)->download($attachment->path, $attachment->original_name);
        }

        return $disk->response($attachment->path, $attachment->original_name, [
            'Content-Type' => $attachment->mime_type,
        ]);
    }
}
