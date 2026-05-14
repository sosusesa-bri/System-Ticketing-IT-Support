import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Activity, Users, Tickets, Clock, AlertTriangle, CheckCircle, Star, BookOpen, FileText, Shield, TrendingUp, UserCheck, Calendar, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
    ActivityTrendChart,
    ActiveUsersChart,
    LogActionDistributionChart,
    SystemSlaTrendChart,
    ModelCountsChart
} from './SystemHealthCharts';

// --- Quick Range Presets ---
const PRESETS = [
    { key: 'today', labelEn: 'Today', labelId: 'Hari Ini', days: 0 },
    { key: '7d', labelEn: 'Last 7 Days', labelId: '7 Hari Terakhir', days: 7 },
    { key: '30d', labelEn: 'Last 30 Days', labelId: '30 Hari Terakhir', days: 30 },
];

function MetricCard({ label, value, icon: Icon, color = 'primary', suffix = '' }) {
    const colorMap = {
        primary: 'bg-primary-50 text-primary-600', info: 'bg-blue-50 text-blue-600',
        success: 'bg-emerald-50 text-emerald-600', warning: 'bg-amber-50 text-amber-600',
        danger: 'bg-rose-50 text-rose-600', violet: 'bg-violet-50 text-violet-600',
    };
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}><Icon className="h-5 w-5" /></div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{value}{suffix}</p>
        </motion.div>
    );
}

function SectionCard({ title, subtitle, children, className = '', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={className}
        >
            <Card className="p-0 overflow-hidden">
                <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
                    <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
                    {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
                </div>
                <div className="p-5">{children}</div>
            </Card>
        </motion.div>
    );
}

export default function SystemHealth({ metrics, charts, filters }) {
    const { language } = useLanguage();
    const m = metrics;

    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    const applyFilters = (from, to) => {
        router.get('/admin/system-health', { date_from: from, date_to: to }, { preserveState: true, preserveScroll: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        applyFilters(dateFrom, dateTo);
    };

    const handlePreset = (days) => {
        const to = new Date().toISOString().split('T')[0];
        const from = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
        setDateFrom(from);
        setDateTo(to);
        applyFilters(from, to);
    };

    return (
        <AppLayout title="System Health">
            {/* Header with Filters */}
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <h1 className="text-2xl font-bold text-primary-900">{language === 'id' ? 'Kesehatan Sistem' : 'System Health'}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{language === 'id' ? 'Metrik operasional dan performa server.' : 'Operational metrics and server performance.'}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-center gap-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.key}
                            onClick={() => handlePreset(p.days)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                        >
                            {language === 'id' ? p.labelId : p.labelEn}
                        </button>
                    ))}
                    <form onSubmit={handleSubmit} className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-2 py-1">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            className="text-xs border-none focus:ring-0 p-0.5 w-28 text-neutral-600" />
                        <span className="text-neutral-300 text-xs">-</span>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            className="text-xs border-none focus:ring-0 p-0.5 w-28 text-neutral-600" />
                        <Button type="submit" size="sm" variant="secondary" className="px-2 h-7 text-xs">
                            <Filter className="h-3 w-3" />
                        </Button>
                    </form>
                </motion.div>
            </div>

            {/* Overall Metrics KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                <MetricCard label={language === 'id' ? 'Total Pengguna' : 'Users'} value={m.totalUsers} icon={Users} color="primary" />
                <MetricCard label={language === 'id' ? 'Tiket Hari Ini' : 'Tickets Today'} value={m.ticketsToday} icon={Tickets} color="info" />
                <MetricCard label={language === 'id' ? 'Kepatuhan SLA' : 'SLA Rate'} value={m.slaComplianceRate} icon={CheckCircle} color="success" suffix="%" />
                <MetricCard label={language === 'id' ? 'Mendesak' : 'Urgent'} value={m.urgentTickets} icon={AlertTriangle} color="danger" />
                <MetricCard label={language === 'id' ? 'Log Audit' : 'Audit Logs'} value={m.totalActivityLogs} icon={FileText} color="violet" />
                <MetricCard label={language === 'id' ? 'Rating' : 'Rating'} value={m.avgRating} icon={Star} color="warning" suffix="/5" />
            </div>

            {/* Charts Section 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <SectionCard
                    title={language === 'id' ? 'Tren Aktivitas Sistem' : 'System Activity Trend'}
                    subtitle={language === 'id' ? 'Jumlah log aktivitas per hari' : 'Number of activity logs per day'}
                    delay={0.1}
                >
                    <ActivityTrendChart data={charts.activityTrend} t={language} />
                </SectionCard>
                <SectionCard
                    title={language === 'id' ? 'Tren Pengguna Aktif' : 'Active Users Trend'}
                    subtitle={language === 'id' ? 'Login pengguna unik per hari' : 'Unique user logins per day'}
                    delay={0.15}
                >
                    <ActiveUsersChart data={charts.activeUsersTrend} t={language} />
                </SectionCard>
            </div>

            {/* Charts Section 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SectionCard title={language === 'id' ? 'Distribusi Tindakan' : 'Action Distribution'} delay={0.2}>
                    <LogActionDistributionChart data={charts.logActionDistribution} t={language} />
                </SectionCard>
                <SectionCard title={language === 'id' ? 'Tren Kepatuhan SLA' : 'SLA Compliance Trend'} delay={0.25} className="md:col-span-1">
                    <SystemSlaTrendChart data={charts.slaTrend} t={language} />
                </SectionCard>
                <SectionCard title={language === 'id' ? 'Distribusi Data' : 'Data Distribution'} delay={0.3}>
                    <ModelCountsChart data={charts.modelCounts} t={language} />
                </SectionCard>
            </div>

            {/* More Detailed Metrics Cards */}
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">{language === 'id' ? 'Rincian Operasional' : 'Operational Breakdown'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard label={language === 'id' ? 'Total Tiket' : 'Total Tickets'} value={m.totalTickets} icon={Tickets} color="primary" />
                <MetricCard label="Open" value={m.openTickets} icon={Activity} color="info" />
                <MetricCard label="In Progress" value={m.inProgressTickets} icon={Clock} color="warning" />
                <MetricCard label="Closed" value={m.closedTickets} icon={CheckCircle} color="success" />
                
                <MetricCard label={language === 'id' ? 'Melampaui SLA' : 'Overdue'} value={m.overdueTickets} icon={AlertTriangle} color="danger" />
                <MetricCard label={language === 'id' ? 'Rata-rata Resolusi' : 'Avg Resolution'} value={m.avgResolutionHours} icon={Clock} color="info" suffix=" hrs" />
                <MetricCard label={language === 'id' ? 'Belum Ditugaskan' : 'Unassigned'} value={m.unassignedTickets} icon={UserCheck} color="warning" />
                <MetricCard label={language === 'id' ? 'Total Artikel KB' : 'KB Articles'} value={m.totalArticles} icon={BookOpen} color="primary" />
            </div>
            
        </AppLayout>
    );
}
