<?php

namespace App\Http\Requests\Tickets;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'required', 'exists:ticket_categories,id'],
            'priority' => ['sometimes', 'required', Rule::enum(TicketPriority::class)],
            'description' => ['sometimes', 'required', 'string', 'min:10'],
            'status' => ['sometimes', 'required', Rule::enum(TicketStatus::class)],
            'assigned_to' => ['sometimes', 'nullable', 'exists:users,id'],
            'solution_notes' => ['sometimes', 'nullable', 'string'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => [
                'nullable',
                'file',
                'max:102400',
                'mimes:jpeg,jpg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,csv,txt,md',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-zip-compressed,text/csv,text/plain,text/markdown,application/octet-stream',
            ],
            'remove_attachments' => ['nullable', 'array'],
            'remove_attachments.*' => ['integer', 'exists:ticket_attachments,id'],
        ];
    }
}
