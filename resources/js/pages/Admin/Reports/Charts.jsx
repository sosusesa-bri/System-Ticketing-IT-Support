import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
} from 'recharts';

// --- Shared ---
const COLORS = {
    primary: '#1d4ed8',
    primaryLight: '#93c5fd',
    emerald: '#059669',
    emeraldLight: '#6ee7b7',
    amber: '#d97706',
    amberLight: '#fde68a',
    rose: '#e11d48',
    roseLight: '#fda4af',
    slate: '#64748b',
    slateLight: '#cbd5e1',
    indigo: '#4f46e5',
    sky: '#0284c7',
};

const STATUS_COLORS = { open: COLORS.primary, on_process: COLORS.amber, closed: COLORS.emerald, reopened: COLORS.rose };
const PRIORITY_COLORS = { low: COLORS.slateLight, medium: COLORS.primary, high: COLORS.amber, critical: COLORS.rose };
const DONUT_COLORS = [COLORS.primary, COLORS.amber, COLORS.emerald, COLORS.rose, COLORS.indigo, COLORS.sky];

const CustomTooltip = ({ active, payload, label, suffix = '' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <p className="font-medium mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || p.fill }}>
                    {p.name}: {p.value}{suffix}
                </p>
            ))}
        </div>
    );
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

// --- Volume Trend (Area Chart) ---
export function VolumeTrendChart({ data, t }) {
    if (!data?.current?.length) return <EmptyChart t={t} />;
    const showDots = data.current.length <= 2;
    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.current} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name={t('rpt_tickets')} stroke={COLORS.primary} fill="url(#volGrad)" strokeWidth={2} dot={showDots ? { r: 5, fill: COLORS.primary, strokeWidth: 0 } : false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// --- Open vs Resolved (Line Chart) ---
export function OpenVsResolvedChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const showDots = data.length <= 2;
    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="opened" name={t('rpt_opened')} stroke={COLORS.primary} strokeWidth={2} dot={showDots ? { r: 5, fill: COLORS.primary, strokeWidth: 0 } : false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" name={t('rpt_resolved')} stroke={COLORS.emerald} strokeWidth={2} dot={showDots ? { r: 5, fill: COLORS.emerald, strokeWidth: 0 } : false} activeDot={{ r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

// --- Status Distribution (Donut) ---
export function StatusDonutChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const colors = data.map(d => STATUS_COLORS[d.status] || COLORS.slate);
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200} className="sm:w-1/2">
                <PieChart>
                    <Pie data={data} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} strokeWidth={0}>
                        {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i] }} />
                            <span className="text-neutral-600">{d.label}</span>
                        </div>
                        <span className="font-semibold text-neutral-900">{d.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Priority Distribution (Horizontal Bar) ---
export function PriorityBarChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const colored = data.map(d => ({ ...d, fill: PRIORITY_COLORS[d.priority] || COLORS.slate }));
    return (
        <ResponsiveContainer width="100%" height={180}>
            <BarChart data={colored} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: '#475569' }} tickLine={false} axisLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name={t('rpt_tickets')} radius={[0, 4, 4, 0]} barSize={20}>
                    {colored.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

// --- Category Distribution (Horizontal Bar) ---
export function CategoryBarChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: '#475569' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name={t('rpt_tickets')} fill={COLORS.primary} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// --- Resolution Time Trend (Line) ---
export function ResolutionTrendChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const showDots = data.length <= 2;
    return (
        <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} unit="h" />
                <Tooltip content={<CustomTooltip suffix="h" />} />
                <Line type="monotone" dataKey="avgHours" name={t('rpt_avgHours')} stroke={COLORS.indigo} strokeWidth={2} dot={showDots ? { r: 5, fill: COLORS.indigo, strokeWidth: 0 } : false} activeDot={{ r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

// --- SLA Trend (Area) ---
export function SlaTrendChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const showDots = data.length <= 2;
    return (
        <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="slaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Area type="monotone" dataKey="compliance" name={t('rpt_slaCompliance')} stroke={COLORS.emerald} fill="url(#slaGrad)" strokeWidth={2} dot={showDots ? { r: 5, fill: COLORS.emerald, strokeWidth: 0 } : false} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// --- Technician Performance (Stacked Bar) ---
export function TechPerformanceChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 44)}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="resolved" name={t('rpt_resolved')} stackId="a" fill={COLORS.emerald} barSize={20} radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name={t('rpt_pending')} stackId="a" fill={COLORS.amberLight} barSize={20} radius={[0, 0, 0, 0]} />
                <Bar dataKey="overdue" name={t('rpt_overdue')} stackId="a" fill={COLORS.rose} barSize={20} radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// --- Activity Heatmap ---
export function ActivityHeatmap({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getCount = (dayIdx, hour) => {
        const item = data.find(d => d.dayIndex === dayIdx && d.hour === hour);
        return item?.count || 0;
    };

    const getColor = (count) => {
        if (count === 0) return '#f8fafc';
        const intensity = Math.min(count / maxCount, 1);
        if (intensity < 0.25) return '#dbeafe';
        if (intensity < 0.5) return '#93c5fd';
        if (intensity < 0.75) return '#3b82f6';
        return '#1d4ed8';
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px]">
                <div className="flex gap-0.5">
                    <div className="w-10" />
                    {hours.filter(h => h % 3 === 0).map(h => (
                        <div key={h} className="flex-1 text-center text-[10px] text-neutral-400 pb-1" style={{ minWidth: 18 }}>
                            {String(h).padStart(2, '0')}
                        </div>
                    ))}
                </div>
                {days.map(day => (
                    <div key={day} className="flex items-center gap-0.5 mb-0.5">
                        <span className="w-10 text-xs text-neutral-500 text-right pr-2">{day}</span>
                        {hours.map(h => {
                            const count = getCount(dayMap[day], h);
                            return (
                                <div
                                    key={h}
                                    className="flex-1 aspect-square rounded-sm transition-colors group relative"
                                    style={{ backgroundColor: getColor(count), minWidth: 18, minHeight: 18 }}
                                    title={`${day} ${String(h).padStart(2, '0')}:00 - ${count} tickets`}
                                />
                            );
                        })}
                    </div>
                ))}
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-neutral-400">
                    <span>{t('rpt_less')}</span>
                    {['#f8fafc', '#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'].map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                    ))}
                    <span>{t('rpt_more')}</span>
                </div>
            </div>
        </div>
    );
}

// --- Lifecycle Funnel ---
export function LifecycleFunnelChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    const max = data[0]?.count || 1;
    return (
        <div className="space-y-2">
            {data.map((item, i) => {
                const pct = max > 0 ? Math.max((item.count / max) * 100, 8) : 8;
                const dropoff = i > 0 && data[i - 1].count > 0
                    ? Math.round(((data[i - 1].count - item.count) / data[i - 1].count) * 100)
                    : 0;
                return (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-20 text-xs text-neutral-500 text-right">{item.stage}</span>
                        <div className="flex-1 relative h-7 bg-neutral-50 rounded overflow-hidden">
                            <motion.div
                                className="h-full rounded"
                                style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            />
                            <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-neutral-700">
                                {item.count}
                            </span>
                        </div>
                        {i > 0 && dropoff > 0 && (
                            <span className="text-[10px] text-rose-500 w-12">-{dropoff}%</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// --- Satisfaction Distribution ---
export function SatisfactionChart({ data, t }) {
    if (!data?.distribution?.length) return <EmptyChart t={t} />;
    const stars = [1, 2, 3, 4, 5];
    const maxCount = Math.max(...data.distribution.map(d => d.count), 1);
    return (
        <div className="space-y-3">
            <div className="text-center mb-4">
                <p className="text-4xl font-bold text-neutral-900">{data.avgRating ?? '-'}</p>
                <p className="text-sm text-neutral-500">{t('rpt_avgRating')} ({data.totalRated} {t('rpt_ratings')})</p>
            </div>
            {stars.map(star => {
                const item = data.distribution.find(d => d.rating === star);
                const count = item?.count || 0;
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-6 text-right text-neutral-500">{star}</span>
                        <div className="flex-1 bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-xs text-neutral-400">{count}</span>
                    </div>
                );
            })}

            <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-3">{t('recent_feedback', 'Recent Feedback')}</h4>
                {data.feedbacks?.length > 0 ? (
                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.feedbacks.map((fb, idx) => (
                            <div key={idx} className="bg-neutral-50 border border-neutral-100 p-3 rounded-lg text-sm">
                                <div className="flex justify-between items-start mb-1.5">
                                    <span className="font-semibold text-neutral-800">{fb.user}</span>
                                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-medium">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{fb.rating}</span>
                                    </div>
                                </div>
                                <p className="text-neutral-600 text-xs italic line-clamp-3">"{fb.feedback}"</p>
                                <p className="text-[10px] text-neutral-400 mt-2 font-mono">{fb.ticket_number} &bull; {fb.date}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-neutral-500 text-center py-4">{t('no_feedback', 'No detailed feedback available.')}</p>
                )}
            </div>
        </div>
    );
}

// --- SLA Gauge ---
export function SlaGauge({ value, t }) {
    const clampedValue = Math.min(Math.max(value || 0, 0), 100);
    const color = clampedValue >= 90 ? COLORS.emerald : clampedValue >= 70 ? COLORS.amber : COLORS.rose;
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (clampedValue / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                    cx="70" cy="70" r="60" fill="none" stroke={color} strokeWidth="10"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <text x="70" y="66" textAnchor="middle" className="text-2xl font-bold" fill="#0f172a" fontSize="24">{clampedValue}%</text>
                <text x="70" y="86" textAnchor="middle" fill="#94a3b8" fontSize="11">{t('rpt_compliance')}</text>
            </svg>
        </div>
    );
}

// --- Empty State ---
function EmptyChart({ t }) {
    return (
        <div className="flex items-center justify-center h-40 text-sm text-neutral-400">
            {t('noData')}
        </div>
    );
}
