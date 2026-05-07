import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import StatCard from '../../components/shared/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
    Tickets,
    Clock,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    UserX,
    Bell,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdminDashboard({ stats, priorityQueue, recentActivity }) {
    const { t, language } = useLanguage();

    return (
        <AppLayout title={t('adminDashboard')}>
            {/* Page header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary-950 tracking-tight">{t('adminDashboard')}</h1>
                    <p className="text-base text-neutral-500 mt-1">
                        {language === 'id' ? 'Gambaran umum operasional dan manajemen sistem.' : 'Operational overview and system management.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/notifications/dashboard">
                        <Button variant="outline" className="bg-white hover:bg-neutral-50">
                            <Bell className="h-4 w-4 mr-2" strokeWidth={2} /> 
                            {language === 'id' ? 'Siaran' : 'Broadcast'}
                        </Button>
                    </Link>
                    <Link href="/admin/reports">
                        <Button>
                            <BarChart3 className="h-4 w-4 mr-2" strokeWidth={2} /> 
                            {language === 'id' ? 'Laporan' : 'Reports'}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stat cards — 3x2 grid */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
            >
                <StatCard label={t('totalTickets')} value={stats.total} icon={Tickets} accent="primary" />
                <StatCard label={t('open')} value={stats.open} icon={AlertCircle} accent="info" />
                <StatCard label={t('inProgress')} value={stats.in_progress} icon={Clock} accent="warning" />
                <StatCard label={t('closed')} value={stats.closed} icon={CheckCircle} accent="success" />
                <StatCard label={language === 'id' ? 'Mendesak' : 'Urgent'} value={stats.urgent} icon={AlertTriangle} accent="danger" />
                <StatCard label={language === 'id' ? 'Belum Ditugaskan' : 'Unassigned'} value={stats.unassigned} icon={UserX} accent="warning" />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* Priority queue */}
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-900">{language === 'id' ? 'Antrean Prioritas' : 'Priority Queue'}</h2>
                            <p className="text-xs text-neutral-500 mt-1">{language === 'id' ? 'Tiket prioritas tinggi dan belum ditugaskan' : 'High priority and unassigned tickets'}</p>
                        </div>
                        <Link href="/admin/tickets?filter=urgent" className="text-sm text-primary-700 font-medium hover:text-primary-900 flex items-center group">
                            {t('viewAll')} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1">
                        {priorityQueue.length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {priorityQueue.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/admin/tickets/${ticket.id}`}
                                        className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50/80 transition-colors group"
                                    >
                                        <div className="min-w-0 flex-1 pr-4">
                                            <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                                                {ticket.title}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                <span className="font-medium text-neutral-700">{ticket.ticket_number}</span> &middot; {ticket.requester}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <PriorityBadge priority={ticket.priority} />
                                            <StatusBadge status={ticket.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center flex flex-col items-center justify-center h-full">
                                <div className="h-16 w-16 bg-success-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-success-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-base font-semibold text-neutral-900">{language === 'id' ? 'Semua bersih' : 'All clear'}</h3>
                                <p className="text-sm text-neutral-500 mt-1 max-w-[200px] mx-auto">{language === 'id' ? 'Tidak ada tiket mendesak atau belum ditugaskan yang memerlukan perhatian segera.' : 'No urgent or unassigned tickets require immediate attention.'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-900">{language === 'id' ? 'Aktivitas Terbaru' : 'Recent Activity'}</h2>
                            <p className="text-xs text-neutral-500 mt-1">{language === 'id' ? 'Tindakan sistem dan pembaruan' : 'System actions and updates'}</p>
                        </div>
                        <Link href="/admin/audit-log" className="text-sm text-primary-700 font-medium hover:text-primary-900 flex items-center group">
                            {language === 'id' ? 'Log Audit' : 'Audit Log'} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1">
                        {recentActivity.length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {recentActivity.map((log) => (
                                    <div key={log.id} className="px-6 py-4 hover:bg-neutral-50/50 transition-colors">
                                        <p className="text-sm text-neutral-800 leading-snug">{log.description}</p>
                                        <p className="text-xs text-neutral-500 mt-1.5 flex items-center gap-2">
                                            <span className="font-medium">{log.user}</span>
                                            <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                            <span>{log.created_at}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center flex flex-col items-center justify-center h-full">
                                <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="h-8 w-8 text-neutral-400" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-base font-semibold text-neutral-900">{language === 'id' ? 'Tidak ada aktivitas terbaru' : 'No recent activity'}</h3>
                                <p className="text-sm text-neutral-500 mt-1">{language === 'id' ? 'Peristiwa sistem akan muncul di sini.' : 'System events will appear here.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
