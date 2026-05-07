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
        ];
    }
}
