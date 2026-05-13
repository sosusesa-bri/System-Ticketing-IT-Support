<?php

namespace App\Http\Requests\Tickets;

use App\Enums\TicketPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:ticket_categories,id'],
            'priority' => ['required', Rule::enum(TicketPriority::class)],
            'description' => ['required', 'string', 'min:10'],
            'status' => ['sometimes', 'required', 'string', 'in:open,draft'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => [
                'nullable',
                'file',
                'max:102400',
                'mimes:jpeg,jpg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,csv,txt,md',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-zip-compressed,text/csv,text/plain,text/markdown,application/octet-stream',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.min' => 'Please provide at least 10 characters describing the issue.',
            'attachments.*.max' => 'Each file must be less than 100MB.',
        ];
    }
}
