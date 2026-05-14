import { motion } from 'framer-motion';
import { Tickets, MessageSquare, UserPlus, Star, AlertTriangle, RefreshCw, Trash2, Edit, ArrowUpCircle } from 'lucide-react';

const eventConfig = {
    ticket_created: { icon: Tickets, color: 'bg-emerald-500', label: 'Ticket Created' },
    ticket_updated: { icon: Edit, color: 'bg-blue-500', label: 'Ticket Updated' },
    ticket_assigned: { icon: UserPlus, color: 'bg-violet-500', label: 'Ticket Assigned' },
    ticket_rated: { icon: Star, color: 'bg-amber-500', label: 'Rating Submitted' },
    ticket_reopened: { icon: RefreshCw, color: 'bg-orange-500', label: 'Ticket Reopened' },
    ticket_deleted: { icon: Trash2, color: 'bg-rose-500', label: 'Ticket Deleted' },
    ticket_escalated: { icon: ArrowUpCircle, color: 'bg-rose-500', label: 'Ticket Escalated' },
    comment_added: { icon: MessageSquare, color: 'bg-cyan-500', label: 'Comment Added' },
    status_changed: { icon: Edit, color: 'bg-blue-500', label: 'Status Changed' },
    bulk_ticket_action: { icon: Tickets, color: 'bg-indigo-500', label: 'Bulk Action' },
};

/**
 * Unified visual timeline for ticket activity logs.
 * @param {Array} logs - Array of activity log objects (already sorted desc from backend).
 */
export default function TicketTimeline({ logs = [] }) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-sm text-neutral-500">
                No activity recorded yet.
            </div>
        );
    }

    // Reverse to show oldest first (chronological order)
    const chronological = [...logs].reverse();

    return (
        <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-neutral-200" />

            <div className="space-y-4">
                {chronological.map((log, idx) => {
                    const config = eventConfig[log.action] || { icon: Tickets, color: 'bg-neutral-400', label: log.action };
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="relative flex gap-3"
                        >
                            {/* Dot */}
                            <div className={`absolute -left-6 mt-1 flex h-[22px] w-[22px] items-center justify-center rounded-full ${config.color} ring-2 ring-white`}>
                                <Icon className="h-3 w-3 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 bg-white border border-neutral-100 rounded-lg px-4 py-3 shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="text-xs font-semibold text-neutral-700">{config.label}</span>
                                        <p className="text-sm text-neutral-600 mt-0.5">{log.description}</p>
                                    </div>
                                    <span className="text-[10px] text-neutral-400 whitespace-nowrap shrink-0 mt-0.5">{log.created_at}</span>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-1">
                                    by {log.user || 'System'}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
