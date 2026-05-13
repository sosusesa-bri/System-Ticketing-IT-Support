<?php

namespace App\Enums;

enum TicketStatus: string
{
    case OPEN = 'open';
    case ON_PROCESS = 'on_process';
    case CLOSED = 'closed';
    case REOPENED = 'reopened';
    case DRAFT = 'draft';

    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'Open',
            self::ON_PROCESS => 'In Progress',
            self::CLOSED => 'Closed',
            self::REOPENED => 'Reopened',
            self::DRAFT => 'Draft',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::OPEN => 'info',
            self::ON_PROCESS => 'warning',
            self::CLOSED => 'success',
            self::REOPENED => 'info',
            self::DRAFT => 'neutral',
        };
    }

    /**
     * Determine valid transitions from the current status.
     *
     * @return array<TicketStatus>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::OPEN => [self::ON_PROCESS, self::CLOSED],
            self::ON_PROCESS => [self::CLOSED, self::OPEN],
            self::CLOSED => [self::REOPENED, self::OPEN],
            self::REOPENED => [self::ON_PROCESS, self::CLOSED, self::OPEN],
            self::DRAFT => [self::OPEN],
        };
    }

    public function canTransitionTo(TicketStatus $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }
}
