import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import StatCard from '../../components/shared/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Tickets, Clock, CheckCircle, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DashboardIndex({ stats, recentTickets }) {
    const { t, language } = useLanguage();

    return (
        <AppLayout title={t('dashboard')}>
            {/* Welcome Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-900 rounded-2xl p-8 sm:p-10 mb-8 text-white relative overflow-hidden shadow-lg"
            >
                <div className="absolute -top-24 -right-12 opacity-10 pointer-events-none">
                    <Tickets className="w-96 h-96" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                        {language === 'id' ? 'Selamat Datang di IT Support' : 'Welcome to IT Support'}
                    </h1>
                    <p className="text-primary-100 max-w-xl text-base sm:text-lg">
                        {language === 'id' 
                            ? 'Butuh bantuan dengan perangkat, akun, atau jaringan Anda? Kami siap membantu. Buat tiket untuk memulai.'
                            : 'Need assistance with your devices, accounts, or network? We are here to help. Create a ticket to get started.'}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/tickets/create">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-white text-primary-900 hover:bg-neutral-100 shadow-sm">
                                <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                                {t('createTicket')}
                            </button>
                        </Link>
                        <Link href="/tickets">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary-800 text-white hover:bg-primary-700 border border-primary-700">
                                {t('myTickets')}
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Summary cards */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
            >
                <StatCard
                    label={t('totalTickets')}
                    value={stats.total}
                    icon={Tickets}
                    accent="primary"
                />
                <StatCard
                    label={t('open')}
                    value={stats.open}
                    icon={AlertCircle}
                    accent="info"
                />
                <StatCard
                    label={t('inProgress')}
                    value={stats.in_progress}
                    icon={Clock}
                    accent="warning"
                />
                <StatCard
                    label={t('closed')}
                    value={stats.closed}
                    icon={CheckCircle}
                    accent="success"
                />
            </motion.div>

            {/* Recent tickets */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 bg-neutral-50/50">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900">{t('recentTickets')}</h2>
                        <p className="text-xs text-neutral-500 mt-1">
                            {language === 'id' ? 'Permintaan dukungan Anda yang baru saja dikirim.' : 'Your most recently submitted support requests.'}
                        </p>
                    </div>
                    <Link
                        href="/tickets"
                        className="text-sm flex items-center text-primary-700 hover:text-primary-900 font-medium group"
                    >
                        {t('viewAll')} <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {recentTickets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-200 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">{t('ticketId')}</th>
                                    <th className="px-6 py-4">{t('title')}</th>
                                    <th className="px-6 py-4">{t('status')}</th>
                                    <th className="px-6 py-4">{t('priority')}</th>
                                    <th className="px-6 py-4">{t('date')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {recentTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-neutral-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-primary-700">
                                            <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                                                {ticket.ticket_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 font-medium">
                                            <Link href={`/tickets/${ticket.id}`} className="hover:text-primary-700 transition-colors">
                                                {ticket.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={ticket.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <PriorityBadge priority={ticket.priority} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {ticket.created_at}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center flex flex-col items-center">
                        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                            <Tickets className="h-8 w-8 text-neutral-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-semibold text-neutral-900">
                            {language === 'id' ? 'Belum ada tiket' : 'No tickets found'}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                            {language === 'id' 
                                ? 'Anda belum mengirimkan tiket dukungan IT. Butuh bantuan? Buat tiket pertama Anda sekarang.' 
                                : "You haven't submitted any IT support tickets yet. Need help? Create your first ticket now."}
                        </p>
                        <Link href="/tickets/create" className="mt-6 inline-block">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('createTicket')}
                            </Button>
                        </Link>
                    </div>
                )}
            </motion.div>
        </AppLayout>
    );
}
