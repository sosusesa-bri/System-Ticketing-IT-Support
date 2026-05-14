import { motion } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = {
    primary: '#1d4ed8',
    primaryLight: '#93c5fd',
    emerald: '#059669',
    amber: '#d97706',
    rose: '#e11d48',
    indigo: '#4f46e5',
    sky: '#0284c7',
    violet: '#7c3aed',
};

const DONUT_COLORS = [COLORS.primary, COLORS.emerald, COLORS.violet, COLORS.amber, COLORS.rose, COLORS.indigo, COLORS.sky];

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

export function EmptyChart({ t }) {
    return (
        <div className="h-[280px] flex items-center justify-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50">
            <p className="text-sm text-neutral-400">Tidak ada data untuk periode ini</p>
        </div>
    );
}

// 1. Activity Trend (Area)
export function ActivityTrendChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Activity Logs" dataKey="total" stroke={COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// 2. Active Users (Bar)
export function ActiveUsersChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <div className="w-full h-[280px] text-neutral-800 dark:text-white">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'currentColor' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
                    <Bar name="User Logins" dataKey="total" fill={COLORS.emerald} radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// 3. Log Action Distribution (Pie/Donut)
export function LogActionDistributionChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <ResponsiveContainer width="100%" height={380}>
            <PieChart>
                <Pie
                    data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
            </PieChart>
        </ResponsiveContainer>
    );
}

// 4. SLA Trend (Line)
export function SystemSlaTrendChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <ResponsiveContainer width="100%" height={380}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Line type="monotone" name="SLA Compliance" dataKey="rate" stroke={COLORS.amber} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.amber }} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

// 5. Model Counts (Bar)
export function ModelCountsChart({ data, t }) {
    if (!data?.length) return <EmptyChart t={t} />;
    return (
        <div className="w-full h-[380px] text-neutral-800 dark:text-white">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 500 }} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
                <Bar name="Total Data" dataKey="value" fill={COLORS.indigo} radius={[0, 4, 4, 0]} barSize={24}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        </div>
    );
}
