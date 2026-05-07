import { Link, router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/ui/Button';
import { Bell, BellOff, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export default function NotificationIndex({ notifications }) {
    const { t } = useLanguage();
    const handleMarkAsRead = (id) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const hasUnread = notifications.data.some((n) => !n.read_at);

    return (
        <AppLayout title="Notifications">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('notifications')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('stayUpdated')}</p>
                </div>
                {hasUnread && (
                    <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
                        <CheckCheck className="h-4 w-4" />
                        {t('markAllAsRead')}
                    </Button>
                )}
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {notifications.data.length > 0 ? (
                    <>
                        <div className="divide-y divide-neutral-200">
                            {notifications.data.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        'flex items-start gap-4 px-6 py-4 transition-colors',
                                        !notification.read_at && 'bg-primary-50',
                                    )}
                                >
                                    <div className={cn(
                                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                                        notification.read_at ? 'bg-neutral-100' : 'bg-primary-100',
                                    )}>
                                        <Bell className={cn('h-4 w-4', notification.read_at ? 'text-neutral-400' : 'text-primary-700')} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            'text-sm',
                                            notification.read_at ? 'text-neutral-500' : 'text-neutral-950 font-medium',
                                        )}>
                                            {notification.data?.message || notification.data?.title || `${notification.type} notification`}
                                        </p>
                                        {notification.data?.ticket_number && (
                                            <p className="text-xs text-primary-700 mt-0.5">
                                                {t('ticket')}: {notification.data.ticket_number}
                                            </p>
                                        )}
                                        <p className="text-xs text-neutral-400 mt-1">{notification.created_at}</p>
                                    </div>
                                    {!notification.read_at && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-xs text-primary-700 hover:text-primary-900 font-medium shrink-0"
                                        >
                                            {t('markRead')}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {notifications.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200">
                                <p className="text-sm text-neutral-500">{t('page')} {notifications.current_page} {t('of')} {notifications.last_page}</p>
                                <div className="flex items-center gap-1">
                                    {notifications.prev_page_url && <Link href={notifications.prev_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronLeft className="h-4 w-4 text-neutral-500" /></Link>}
                                    {notifications.next_page_url && <Link href={notifications.next_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronRight className="h-4 w-4 text-neutral-500" /></Link>}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <BellOff className="h-10 w-10 text-neutral-300 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-neutral-950">{t('noNotifications')}</p>
                        <p className="text-sm text-neutral-500 mt-1">{t('allCaughtUp')}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
