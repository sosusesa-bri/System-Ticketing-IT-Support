import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
    BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertTriangle,
    Calendar, Filter, Download, RefreshCw, Activity, Users, Shield,
    ArrowUpRight, ArrowDownRight, Minus, FileText, Star,
} from 'lucide-react';
import {
    VolumeTrendChart, OpenVsResolvedChart, StatusDonutChart, PriorityBarChart,
    CategoryBarChart, ResolutionTrendChart, SlaTrendChart, TechPerformanceChart,
    ActivityHeatmap, LifecycleFunnelChart, SatisfactionChart, SlaGauge,
} from './Charts';

// --- KPI Card ---
function KpiCard({ icon: Icon, label, value, suffix = '', prev, invertTrend = false, color = 'primary', delay = 0 }) {
    const bgMap = { primary: 'bg-primary-50', emerald: 'bg-emerald-50', amber: 'bg-amber-50', rose: 'bg-rose-50', indigo: 'bg-indigo-50', sky: 'bg-sky-50' };
    const iconMap = { primary: 'text-primary-600', emerald: 'text-emerald-600', amber: 'text-amber-600', rose: 'text-rose-600', indigo: 'text-indigo-600', sky: 'text-sky-600' };

    let delta = null;
    let deltaColor = 'text-neutral-400';
    let DeltaIcon = Minus;
    if (prev !== undefined && prev !== null && value !== null) {
        const numVal = typeof value === 'string' ? parseFloat(value) : value;
        const numPrev = typeof prev === 'string' ? parseFloat(prev) : prev;
        if (numPrev > 0) {
            delta = Math.round(((numVal - numPrev) / numPrev) * 100);
            const isPositive = invertTrend ? delta < 0 : delta > 0;
            const isNegative = invertTrend ? delta > 0 : delta < 0;
            deltaColor = isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-neutral-400';
            DeltaIcon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
        >
            <Card className="flex items-center gap-4 p-5">
                <div className={`h-11 w-11 rounded-lg ${bgMap[color]} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${iconMap[color]}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-neutral-500 truncate">{label}</p>
                    <div className="flex items-baseline gap-1.5">
                        <p className="text-xl font-bold text-neutral-900">{value ?? '-'}{suffix}</p>
                        {delta !== null && (
                            <span className={`flex items-center text-[11px] font-medium ${deltaColor}`}>
                                <DeltaIcon className="h-3 w-3" />
                                {Math.abs(delta)}%
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// --- Section Card ---
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

// --- Quick Range Presets ---
const PRESETS = [
    { key: 'today', days: 0 },
    { key: '7d', days: 7 },
    { key: '30d', days: 30 },
    { key: '90d', days: 90 },
];

export default function ReportsDashboard({
    filters, overview, volumeTrend, openVsResolved, statusDistribution,
    priorityDistribution, categoryDistribution, resolutionTrend,
    techPerformance, activityHeatmap, lifecycleFunnel, satisfaction,
    reopenedAnalytics, slaTrend,
}) {
    const { t } = useLanguage();
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const applyFilters = (from, to) => {
        router.get('/admin/reports', { date_from: from, date_to: to }, { preserveState: true, preserveScroll: true });
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

    const handleExport = () => {
        window.open(`/admin/export/tickets?date_from=${dateFrom}&date_to=${dateTo}`, '_blank');
    };

    // Volume delta
    const volDelta = useMemo(() => {
        if (!volumeTrend) return null;
        const curr = volumeTrend.currentTotal || 0;
        const prev = volumeTrend.previousTotal || 0;
        if (prev === 0) return null;
        return Math.round(((curr - prev) / prev) * 100);
    }, [volumeTrend]);

    return (
        <AppLayout title={t('rpt_title')}>
            {/* Header */}
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <h1 className="text-2xl font-bold text-primary-900">{t('rpt_title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('rpt_subtitle')}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-center gap-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.key}
                            onClick={() => handlePreset(p.days)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                        >
                            {t(`rpt_${p.key}`)}
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
                    <Button onClick={handleExport} size="sm" variant="secondary" className="h-8">
                        <Download className="h-3.5 w-3.5 mr-1" />{t('rpt_export')}
                    </Button>
                </motion.div>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                <KpiCard icon={BarChart3} label={t('totalTickets')} value={overview.totalTickets} prev={overview.prevTotal} color="primary" delay={0} />
                <KpiCard icon={Activity} label={t('open')} value={overview.openTickets} color="sky" delay={0.05} />
                <KpiCard icon={RefreshCw} label={t('inProgress')} value={overview.inProgressTickets} color="amber" delay={0.1} />
                <KpiCard icon={CheckCircle2} label={t('closed')} value={overview.closedTickets} color="emerald" delay={0.15} />
                <KpiCard icon={AlertTriangle} label={t('rpt_overdue')} value={overview.overdueTickets} color="rose" invertTrend delay={0.2} />
                <KpiCard icon={Clock} label={t('rpt_avgResTime')} value={overview.avgResolutionHours} suffix="h" prev={overview.prevAvgResolutionHours} invertTrend color="indigo" delay={0.25} />
                <KpiCard icon={Shield} label={t('rpt_slaCompliance')} value={overview.slaCompliance} suffix="%" color="emerald" delay={0.3} />
                <KpiCard icon={TrendingUp} label={t('rpt_resolvedToday')} value={overview.resolvedToday} color="emerald" delay={0.35} />
                <KpiCard icon={TrendingDown} label={t('rpt_reopened')} value={overview.reopenedTickets} color="rose" invertTrend delay={0.4} />
                <KpiCard icon={Star} label={t('rpt_satisfaction')} value={satisfaction?.avgRating} suffix="/5" color="amber" delay={0.45} />
            </div>

            {/* Row 1: Volume Trend + Open vs Resolved */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <SectionCard
                    title={t('ticketVolumeTrend')}
                    subtitle={volDelta !== null ? `${volDelta >= 0 ? '+' : ''}${volDelta}% ${t('rpt_vsPrev')}` : null}
                    delay={0.1}
                >
                    <VolumeTrendChart data={volumeTrend} t={t} />
                </SectionCard>
                <SectionCard title={t('rpt_openVsResolved')} subtitle={t('rpt_openVsResolvedDesc')} delay={0.15}>
                    <OpenVsResolvedChart data={openVsResolved} t={t} />
                </SectionCard>
            </div>

            {/* Row 2: Status + Priority + Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <SectionCard title={t('ticketsByStatus')} delay={0.2}>
                    <StatusDonutChart data={statusDistribution} t={t} />
                </SectionCard>
                <SectionCard title={t('ticketsByPriority')} delay={0.25}>
                    <PriorityBarChart data={priorityDistribution} t={t} />
                </SectionCard>
                <SectionCard title={t('ticketsByCategory')} delay={0.3}>
                    <CategoryBarChart data={categoryDistribution} t={t} />
                </SectionCard>
            </div>

            {/* Row 3: Resolution Trend + SLA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <SectionCard title={t('rpt_resolutionTrend')} subtitle={t('rpt_resolutionTrendDesc')} className="lg:col-span-2" delay={0.35}>
                    <ResolutionTrendChart data={resolutionTrend} t={t} />
                </SectionCard>
                <SectionCard title={t('rpt_slaOverview')} delay={0.4}>
                    <SlaGauge value={overview.slaCompliance} t={t} />
                    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                        <div className="bg-emerald-50 rounded-lg p-3">
                            <p className="text-lg font-bold text-emerald-700">{overview.slaTotal - overview.overdueTickets}</p>
                            <p className="text-[10px] text-emerald-600">{t('rpt_withinSla')}</p>
                        </div>
                        <div className="bg-rose-50 rounded-lg p-3">
                            <p className="text-lg font-bold text-rose-700">{overview.overdueTickets}</p>
                            <p className="text-[10px] text-rose-600">{t('rpt_breached')}</p>
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* Row 4: SLA Trend + Technician Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <SectionCard title={t('rpt_slaTrend')} subtitle={t('rpt_slaTrendDesc')} delay={0.45}>
                    <SlaTrendChart data={slaTrend} t={t} />
                </SectionCard>
                <SectionCard title={t('rpt_techPerformance')} subtitle={t('rpt_techPerformanceDesc')} delay={0.5}>
                    <TechPerformanceChart data={techPerformance} t={t} />
                </SectionCard>
            </div>

            {/* Row 5: Heatmap + Funnel + Satisfaction */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <SectionCard title={t('rpt_activityHeatmap')} subtitle={t('rpt_activityHeatmapDesc')} className="lg:col-span-2" delay={0.55}>
                    <ActivityHeatmap data={activityHeatmap} t={t} />
                </SectionCard>
                <SectionCard title={t('rpt_satisfaction')} delay={0.6}>
                    <SatisfactionChart data={satisfaction} t={t} />
                </SectionCard>
            </div>

            {/* Row 6: Lifecycle Funnel + Reopened */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SectionCard title={t('rpt_lifecycle')} subtitle={t('rpt_lifecycleDesc')} delay={0.65}>
                    <LifecycleFunnelChart data={lifecycleFunnel} t={t} />
                </SectionCard>
                <SectionCard title={t('rpt_reopenedAnalytics')} delay={0.7}>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-neutral-900">{reopenedAnalytics?.count ?? 0}</p>
                            <p className="text-xs text-neutral-500">{t('rpt_reopenedCount')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-neutral-900">{reopenedAnalytics?.rate ?? 0}%</p>
                            <p className="text-xs text-neutral-500">{t('rpt_reopenRate')}</p>
                        </div>
                        {reopenedAnalytics?.prevCount !== undefined && (
                            <div className="text-center">
                                <p className="text-3xl font-bold text-neutral-400">{reopenedAnalytics.prevCount}</p>
                                <p className="text-xs text-neutral-400">{t('rpt_prevPeriod')}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 bg-neutral-50 rounded-lg p-4">
                        <p className="text-xs text-neutral-500">{t('rpt_reopenedInsight')}</p>
                    </div>
                </SectionCard>
            </div>
        </AppLayout>
    );
}
