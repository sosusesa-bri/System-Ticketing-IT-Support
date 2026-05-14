import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * SLA Indicator - shows green/yellow/red based on time remaining.
 * @param {string} dueAt - ISO date string for the SLA deadline.
 * @param {boolean} isClosed - Whether the ticket is already closed.
 */
export default function SlaIndicator({ dueAt, isClosed = false }) {
    if (!dueAt) return null;

    if (isClosed) {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                <CheckCircle className="h-3 w-3" /> Resolved
            </span>
        );
    }

    const now = new Date();
    const due = new Date(dueAt);
    const diffMs = due - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs <= 0) {
        // Breached
        const overdue = Math.abs(Math.round(diffHours));
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 animate-pulse">
                <AlertTriangle className="h-3 w-3" /> Overdue {overdue}h
            </span>
        );
    }

    if (diffHours <= 4) {
        // Warning - less than 4 hours
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                <Clock className="h-3 w-3" /> {Math.round(diffHours)}h left
            </span>
        );
    }

    // On Track
    const days = Math.floor(diffHours / 24);
    const hours = Math.round(diffHours % 24);
    const label = days > 0 ? `${days}d ${hours}h` : `${hours}h`;

    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            <Clock className="h-3 w-3" /> {label} left
        </span>
    );
}
