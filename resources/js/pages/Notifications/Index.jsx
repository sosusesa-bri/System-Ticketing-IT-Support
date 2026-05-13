import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
    Bell, BellOff, CheckCheck, ChevronLeft, ChevronRight, Trash2,
    Ticket, MessageSquare, AlertTriangle, Info, UserCheck, Clock,
    Eye, X, Filter, Inbox, MailCheck, MailOpen, CalendarClock,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// Map notification type to icon + color
const TYPE_MAP = {
    TicketCreated: { icon: Ticket, bg: 'bg-primary-50', color: 'text-primary-600' },
    TicketStatusChanged: { icon: Info, bg: 'bg-info-50', color: 'text-info-600' },
    TicketAssigned: { icon: UserCheck, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    TicketCommented: { icon: MessageSquare, bg: 'bg-amber-50', color: 'text-amber-600' },
    TicketClosed: { icon: CheckCheck, bg: 'bg-success-50', color: 'text-success-600' },
    TicketReopened: { icon: AlertTriangle, bg: 'bg-rose-50', color: 'text-rose-600' },
    BroadcastNotification: { icon: Bell, bg: 'bg-indigo-50', color: 'text-indigo-600' },
};

function getTypeConfig(type) {
    return TYPE_MAP[type] || { icon: Bell, bg: 'bg-neutral-50', color: 'text-neutral-500' };
}

export default function NotificationIndex({ notifications, stats, filter }) {
    const { language, t } = useLanguage();
    const [expandedId, setExpandedId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleMarkAsRead = (id) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        router.delete(`/notifications/${id}`, { preserveScroll: true });
        setDeleteConfirm(null);
    };

    const handleClearRead = () => {
        if (confirm(t('nf_confirmClearRead'))) {
            router.delete('/notifications-read', { preserveScroll: true });
        }
    };

    const handleFilter = (newFilter) => {
        router.get('/notifications', { filter: newFilter }, { preserveState: true, preserveScroll: true });
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const FILTERS = [
        { key: 'all', icon: Inbox, label: t('nf_all') },
        { key: 'unread', icon: MailCheck, label: t('nf_unread') },
        { key: 'read', icon: MailOpen, label: t('nf_read') },
    ];

    return (
        <AppLayout title={t('notifications')}>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-2xl font-bold text-primary-900">{t('notifications')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('nf_subtitle')}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    {stats.unread > 0 && (
                        <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="h-4 w-4 mr-1.5" />
                            {t('markAllAsRead')}
                        </Button>
                    )}
                    {stats.read > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearRead} className="text-neutral-500 hover:text-danger-600">
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            {t('nf_clearRead')}
                        </Button>
                    )}
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { icon: Inbox, label: t('nf_totalNotifications'), value: stats.total, color: 'primary' },
                    { icon: MailCheck, label: t('nf_unread'), value: stats.unread, color: 'amber' },
                    { icon: MailOpen, label: t('nf_read'), value: stats.read, color: 'emerald' },
                    { icon: CalendarClock, label: t('nf_today'), value: stats.today, color: 'indigo' },
                ].map((stat, i) => {
                    const bgMap = { primary: 'bg-primary-50', amber: 'bg-amber-50', emerald: 'bg-emerald-50', indigo: 'bg-indigo-50' };
                    const iconMap = { primary: 'text-primary-600', amber: 'text-amber-600', emerald: 'text-emerald-600', indigo: 'text-indigo-600' };
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="flex items-center gap-3 p-4">
                                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', bgMap[stat.color])}>
                                    <stat.icon className={cn('h-5 w-5', iconMap[stat.color])} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
                                    <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-4 bg-neutral-100 rounded-lg p-1 w-fit">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        onClick={() => handleFilter(f.key)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                            filter === f.key
                                ? 'bg-white text-primary-700 shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-700'
                        )}
                    >
                        <f.icon className="h-3.5 w-3.5" />
                        {f.label}
                        {f.key === 'unread' && stats.unread > 0 && (
                            <span className="ml-0.5 bg-primary-600 text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                                {stats.unread}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <Card className="overflow-hidden p-0">
                {notifications.data.length > 0 ? (
                    <>
                        <div className="divide-y divide-neutral-100">
                            {notifications.data.map((notification, idx) => {
                                const cfg = getTypeConfig(notification.type);
                                const Icon = cfg.icon;
                                const isExpanded = expandedId === notification.id;
                                const data = notification.data || {};

                                return (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                    >
                                        {/* Main Row */}
                                        <div
                                            onClick={() => toggleExpand(notification.id)}
                                            className={cn(
                                                'flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer',
                                                !notification.read_at && 'bg-primary-50/50 hover:bg-primary-50',
                                                notification.read_at && 'hover:bg-neutral-50',
                                                isExpanded && 'bg-neutral-50',
                                            )}
                                        >
                                            {/* Icon */}
                                            <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                                                <Icon className={cn('h-4.5 w-4.5', cfg.color)} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className={cn(
                                                            'text-sm leading-snug',
                                                            notification.read_at ? 'text-neutral-600' : 'text-neutral-950 font-medium',
                                                        )}>
                                                            {data[`message_${language}`] || data.message || data.title || `${notification.type}`}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            {data.ticket_number && (
                                                                <span className="inline-flex items-center gap-1 text-xs font-mono bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded">
                                                                    <Ticket className="h-3 w-3" />
                                                                    {data.ticket_number}
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {notification.created_at}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Unread indicator */}
                                                    {!notification.read_at && (
                                                        <div className="h-2.5 w-2.5 rounded-full bg-primary-600 shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Detail Panel */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-4 pt-1 ml-12 space-y-3">
                                                        {/* Detail fields */}
                                                        <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-2">
                                                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">{t('nf_details')}</h4>
                                                            {data.title && (
                                                                <div className="flex items-start gap-2 text-sm">
                                                                    <span className="text-neutral-400 w-20 shrink-0">{t('title')}</span>
                                                                    <span className="text-neutral-900 font-medium">{data.title}</span>
                                                                </div>
                                                            )}
                                                            {(data[`message_${language}`] || data.message) && (
                                                                <div className="flex items-start gap-2 text-sm">
                                                                    <span className="text-neutral-400 w-20 shrink-0">{t('nf_message')}</span>
                                                                    <span className="text-neutral-700">{data[`message_${language}`] || data.message}</span>
                                                                </div>
                                                            )}
                                                            {data.ticket_number && (
                                                                <div className="flex items-start gap-2 text-sm">
                                                                    <span className="text-neutral-400 w-20 shrink-0">{t('ticket')}</span>
                                                                    <Link href={`/tickets/${data.ticket_id || ''}`} className="text-primary-700 hover:underline font-medium">
                                                                        #{data.ticket_number}
                                                                    </Link>
                                                                </div>
                                                            )}
                                                            {data.status && (
                                                                <div className="flex items-start gap-2 text-sm">
                                                                    <span className="text-neutral-400 w-20 shrink-0">{t('status')}</span>
                                                                    <span className="text-neutral-700 capitalize">{data.status}</span>
                                                                </div>
                                                            )}
                                                            {data.assigned_to && (
                                                                <div className="flex items-start gap-2 text-sm">
                                                                    <span className="text-neutral-400 w-20 shrink-0">{t('nf_assignedTo')}</span>
                                                                    <span className="text-neutral-700">{data.assigned_to}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-start gap-2 text-sm">
                                                                <span className="text-neutral-400 w-20 shrink-0">{t('nf_time')}</span>
                                                                <span className="text-neutral-500">{notification.created_at_full}</span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2">
                                                            {data.ticket_id && (
                                                                <Link
                                                                    href={`/tickets/${data.ticket_id}`}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-md transition-colors"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                    {t('nf_viewTicket')}
                                                                </Link>
                                                            )}
                                                            {!notification.read_at && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
                                                                >
                                                                    <CheckCheck className="h-3.5 w-3.5" />
                                                                    {t('markRead')}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-danger-600 bg-neutral-50 hover:bg-danger-50 px-3 py-1.5 rounded-md transition-colors"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                {t('delete')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {notifications.last_page > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-200 bg-neutral-50/50">
                                <p className="text-sm text-neutral-500">
                                    {t('page')} {notifications.current_page} {t('of')} {notifications.last_page}
                                    <span className="text-neutral-400 ml-2">({notifications.total} {t('nf_total')})</span>
                                </p>
                                <div className="flex items-center gap-1">
                                    {notifications.prev_page_url && (
                                        <Link href={notifications.prev_page_url} className="p-2 rounded-md hover:bg-white border border-transparent hover:border-neutral-200 transition-colors">
                                            <ChevronLeft className="h-4 w-4 text-neutral-500" />
                                        </Link>
                                    )}
                                    {notifications.next_page_url && (
                                        <Link href={notifications.next_page_url} className="p-2 rounded-md hover:bg-white border border-transparent hover:border-neutral-200 transition-colors">
                                            <ChevronRight className="h-4 w-4 text-neutral-500" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                            <BellOff className="h-8 w-8 text-neutral-300" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-semibold text-neutral-950">{t('noNotifications')}</p>
                        <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">{t('nf_emptyDesc')}</p>
                    </div>
                )}
            </Card>
        </AppLayout>
    );
}
