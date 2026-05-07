import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BarChart3, PieChart, TrendingUp, Calendar, Filter } from 'lucide-react';

export default function Reports({ filters, summary, byStatus, byPriority, byCategory, dailyCreated }) {
    const { t } = useLanguage();
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);

    const applyFilters = (e) => {
        e.preventDefault();
        router.get('/admin/reports', { date_from: dateFrom, date_to: dateTo }, { preserveState: true });
    };

    const StatusBadge = ({ status, count }) => {
        const colors = {
            open: 'bg-blue-100 text-blue-700',
            on_process: 'bg-amber-100 text-amber-700',
            closed: 'bg-emerald-100 text-emerald-700',
            reopened: 'bg-rose-100 text-rose-700',
        };
        const labels = {
            open: 'Open',
            on_process: 'In Progress',
            closed: 'Closed',
            reopened: 'Reopened',
        };
        return (
            <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <Badge className={colors[status] || 'bg-neutral-100 text-neutral-700'}>{labels[status] || status}</Badge>
                <span className="font-semibold text-neutral-900">{count}</span>
            </div>
        );
    };

    const PriorityBadge = ({ priority, count }) => {
        const colors = {
            low: 'bg-slate-100 text-slate-700',
            medium: 'bg-blue-100 text-blue-700',
            high: 'bg-orange-100 text-orange-700',
            critical: 'bg-red-100 text-red-700',
        };
        const labels = {
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            critical: 'Critical',
        };
        return (
            <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <Badge className={colors[priority] || 'bg-neutral-100 text-neutral-700'}>{labels[priority] || priority}</Badge>
                <span className="font-semibold text-neutral-900">{count}</span>
            </div>
        );
    };

    return (
        <AppLayout title="Reports">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('systemReports')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('reportsDesc')}</p>
                </div>
                
                {/* Date Filter */}
                <form onSubmit={applyFilters} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-neutral-400 ml-1" />
                        <input 
                            type="date" 
                            value={dateFrom} 
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="text-sm border-none focus:ring-0 p-1 text-neutral-600"
                        />
                        <span className="text-neutral-300">-</span>
                        <input 
                            type="date" 
                            value={dateTo} 
                            onChange={(e) => setDateTo(e.target.value)}
                            className="text-sm border-none focus:ring-0 p-1 text-neutral-600"
                        />
                    </div>
                    <Button type="submit" size="sm" variant="secondary" className="px-3">
                        <Filter className="h-4 w-4 mr-1" /> Filter
                    </Button>
                </form>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="flex items-center gap-4 p-5">
                    <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <BarChart3 className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{t('totalTickets')}</p>
                        <p className="text-2xl font-bold text-neutral-900">{summary.total}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <PieChart className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{t('closedTickets')}</p>
                        <p className="text-2xl font-bold text-neutral-900">{summary.closed}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{t('resolutionRate')}</p>
                        <p className="text-2xl font-bold text-neutral-900">{summary.resolution_rate}%</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                        <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{t('avgResolution')}</p>
                        <p className="text-2xl font-bold text-neutral-900">{summary.avg_resolution_days !== null ? summary.avg_resolution_days : 'N/A'}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Breakdown */}
                <Card className="col-span-1 p-5">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">{t('ticketsByStatus')}</h2>
                    <div className="space-y-1 mt-2">
                        {Object.entries(byStatus).length > 0 ? (
                            Object.entries(byStatus).map(([status, count]) => (
                                <StatusBadge key={status} status={status} count={count} />
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500 text-center py-4">{t('noData')}</p>
                        )}
                    </div>
                </Card>

                {/* Priority Breakdown */}
                <Card className="col-span-1 p-5">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">{t('ticketsByPriority')}</h2>
                    <div className="space-y-1 mt-2">
                        {Object.entries(byPriority).length > 0 ? (
                            Object.entries(byPriority).map(([priority, count]) => (
                                <PriorityBadge key={priority} priority={priority} count={count} />
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500 text-center py-4">{t('noData')}</p>
                        )}
                    </div>
                </Card>

                {/* Category Breakdown */}
                <Card className="col-span-1 p-5">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">{t('ticketsByCategory')}</h2>
                    <div className="space-y-2 mt-2">
                        {byCategory.length > 0 ? (
                            byCategory.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                                    <span className="text-sm font-medium text-neutral-700">{item.category}</span>
                                    <span className="text-sm font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-full">{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-500 text-center py-4">{t('noData')}</p>
                        )}
                    </div>
                </Card>
                
                {/* Trend Chart placeholder */}
                <Card className="col-span-1 lg:col-span-3 p-5">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">{t('ticketVolumeTrend')}</h2>
                    <div className="h-64 w-full flex items-end gap-1 pt-4 px-2">
                        {dailyCreated.length > 0 ? (
                            (() => {
                                const maxCount = Math.max(...dailyCreated.map(d => d.count));
                                return dailyCreated.map((day, idx) => {
                                    const heightPercentage = Math.max((day.count / maxCount) * 100, 5); // min 5% height
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center justify-end group relative">
                                            <div 
                                                className="w-full bg-primary-200 hover:bg-primary-500 rounded-t-sm transition-colors"
                                                style={{ height: `${heightPercentage}%` }}
                                            ></div>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-neutral-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                                                {day.date}: {day.count} tickets
                                            </div>
                                        </div>
                                    );
                                });
                            })()
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
                                No ticket data for this period.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
