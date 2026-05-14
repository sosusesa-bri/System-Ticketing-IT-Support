import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Activity, Tickets, MessageSquare, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../../components/shared/StatCard';

const actionIcons = {
    ticket_created: Tickets, ticket_updated: Tickets, ticket_assigned: Tickets,
    ticket_rated: Star, ticket_reopened: Tickets, ticket_deleted: Tickets,
    comment_added: MessageSquare,
};
const actionColors = {
    ticket_created: 'text-emerald-600 bg-emerald-50', ticket_updated: 'text-blue-600 bg-blue-50',
    ticket_assigned: 'text-violet-600 bg-violet-50', ticket_rated: 'text-amber-600 bg-amber-50',
    ticket_reopened: 'text-orange-600 bg-orange-50', ticket_deleted: 'text-rose-600 bg-rose-50',
    comment_added: 'text-cyan-600 bg-cyan-50',
};

export default function ActivityIndex({ activities, stats }) {
    const { language } = useLanguage();
    return (
        <AppLayout title={language === 'id' ? 'Aktivitas Saya' : 'My Activity'}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-900">{language === 'id' ? 'Aktivitas Saya' : 'My Activity'}</h1>
                <p className="text-sm text-neutral-500 mt-1">{language === 'id' ? 'Riwayat aktivitas Anda di dalam sistem.' : 'Your activity history within the system.'}</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard label={language === 'id' ? 'Total Tiket' : 'Total Tickets'} value={stats.totalTickets} icon={Tickets} accent="primary" />
                <StatCard label={language === 'id' ? 'Total Komentar' : 'Total Comments'} value={stats.totalComments} icon={MessageSquare} accent="info" />
                <StatCard label={language === 'id' ? 'Rating Diberikan' : 'Ratings Given'} value={stats.totalRatings} icon={Star} accent="warning" />
                <StatCard label={language === 'id' ? 'Login Terakhir' : 'Last Login'} value={stats.lastLogin || '-'} icon={Clock} accent="success" isText />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
                    <h2 className="text-lg font-semibold text-neutral-900">{language === 'id' ? 'Riwayat Aktivitas' : 'Activity History'}</h2>
                </div>
                {activities.data.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                        {activities.data.map((a) => {
                            const Icon = actionIcons[a.action] || Activity;
                            const color = actionColors[a.action] || 'text-neutral-600 bg-neutral-50';
                            return (
                                <div key={a.id} className="px-6 py-4 flex items-start gap-4 hover:bg-neutral-50/50 transition-colors">
                                    <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${color}`}><Icon className="h-4 w-4" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-neutral-900 font-medium">{a.description}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{a.created_at} ({a.created_at_human})</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <Activity className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-500">{language === 'id' ? 'Belum ada aktivitas.' : 'No activity yet.'}</p>
                    </div>
                )}
                {activities.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200">
                        <p className="text-sm text-neutral-500">{activities.from}-{activities.to} / {activities.total}</p>
                        <div className="flex items-center gap-1">
                            {activities.prev_page_url && <Link href={activities.prev_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronLeft className="h-4 w-4 text-neutral-500" /></Link>}
                            {activities.next_page_url && <Link href={activities.next_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronRight className="h-4 w-4 text-neutral-500" /></Link>}
                        </div>
                    </div>
                )}
            </motion.div>
        </AppLayout>
    );
}
