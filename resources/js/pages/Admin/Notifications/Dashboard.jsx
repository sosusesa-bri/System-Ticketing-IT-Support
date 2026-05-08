import { Link } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
    Bell, Send, CheckCircle2, AlertCircle, FileText, Play,
    Activity, BarChart3, Zap, Users, Clock, Eye, ChevronRight,
    Inbox, MailCheck, Settings, TrendingUp, Layers, Radio,
    Ticket, MessageSquare, UserCheck, Info,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Map notification type to icon + color
const TYPE_MAP = {
    TicketCreated: { icon: Ticket, color: 'text-primary-600', bg: 'bg-primary-50' },
    TicketStatusChanged: { icon: Info, color: 'text-info-600', bg: 'bg-info-50' },
    TicketAssigned: { icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    TicketCommented: { icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
    TicketClosed: { icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
    BroadcastNotification: { icon: Radio, color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

function getTypeConfig(type) {
    return TYPE_MAP[type] || { icon: Bell, color: 'text-neutral-500', bg: 'bg-neutral-50' };
}

function KpiCard({ icon: Icon, label, value, subValue, color = 'primary', delay = 0 }) {
    const bgMap = { primary: 'bg-primary-50', emerald: 'bg-emerald-50', amber: 'bg-amber-50', rose: 'bg-rose-50', indigo: 'bg-indigo-50', sky: 'bg-sky-50' };
    const iconMap = { primary: 'text-primary-600', emerald: 'text-emerald-600', amber: 'text-amber-600', rose: 'text-rose-600', indigo: 'text-indigo-600', sky: 'text-sky-600' };
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
            <Card className="flex items-center gap-4 p-5">
                <div className={cn('h-11 w-11 rounded-lg flex items-center justify-center shrink-0', bgMap[color])}>
                    <Icon className={cn('h-5 w-5', iconMap[color])} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-500 truncate">{label}</p>
                    <div className="flex items-baseline gap-1.5">
                        <p className="text-xl font-bold text-neutral-900">{value ?? 0}</p>
                        {subValue && <span className="text-xs text-neutral-400">{subValue}</span>}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function NavCard({ href, icon: Icon, label, description, isActive = false, delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
            <Link
                href={href}
                className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border transition-all group',
                    isActive
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300',
                )}
            >
                <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isActive ? 'bg-primary-100' : 'bg-neutral-100 group-hover:bg-neutral-200',
                )}>
                    <Icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-neutral-500')} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className={cn('text-xs mt-0.5', isActive ? 'text-primary-500' : 'text-neutral-400')}>{description}</p>
                </div>
                <ChevronRight className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-400' : 'text-neutral-300')} />
            </Link>
        </motion.div>
    );
}

export default function NotificationDashboard({ stats, recentBroadcasts, recentNotifications }) {
    const { t } = useLanguage();

    const statusBadge = (status) => {
        const map = {
            completed: { variant: 'success', label: t('completed') },
            draft: { variant: 'neutral', label: t('nda_draft') },
            processing: { variant: 'info', label: t('nda_processing') },
            scheduled: { variant: 'warning', label: t('scheduled') },
            failed: { variant: 'danger', label: t('failed') },
        };
        const cfg = map[status] || map.draft;
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    };

    const typeBadge = (type) => {
        const map = {
            info: { variant: 'info', label: t('nda_info') },
            success: { variant: 'success', label: t('nda_success') },
            warning: { variant: 'warning', label: t('warning') },
            danger: { variant: 'danger', label: t('nda_danger') },
        };
        const cfg = map[type] || map.info;
        return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    };

    return (
        <AppLayout title={t('nda_title')}>
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-2xl font-bold text-primary-900">{t('nda_title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('nda_subtitle')}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                    <Link
                        href="/admin/notifications/broadcasts/create"
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary-700 text-white hover:bg-primary-800 h-10 px-4 transition-colors"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        {t('newBroadcast')}
                    </Link>
                </motion.div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <NavCard href="/admin/notifications/dashboard" icon={BarChart3} label={t('overview')} description={t('nda_overviewDesc')} isActive delay={0} />
                <NavCard href="/admin/notifications/broadcasts" icon={Send} label={t('broadcasts')} description={t('nda_broadcastsDesc')} delay={0.05} />
                <NavCard href="/admin/notifications/templates" icon={FileText} label={t('templates')} description={`${stats.active_templates} ${t('active')}`} delay={0.1} />
                <NavCard href="/admin/notifications/automation" icon={Zap} label={t('automation')} description={`${stats.active_rules} ${t('nda_rulesActive')}`} delay={0.15} />
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <KpiCard icon={Send} label={t('totalBroadcasts')} value={stats.total_broadcasts} color="primary" delay={0} />
                <KpiCard icon={CheckCircle2} label={t('completed')} value={stats.completed} color="emerald" delay={0.05} />
                <KpiCard icon={Clock} label={t('scheduled')} value={stats.scheduled} color="amber" delay={0.1} />
                <KpiCard icon={AlertCircle} label={t('failed')} value={stats.failed} color="rose" delay={0.15} />
                <KpiCard icon={Inbox} label={t('nda_systemNotifs')} value={stats.total_system_notifications} subValue={`${stats.unread_system_notifications} ${t('nf_unread').toLowerCase()}`} color="indigo" delay={0.2} />
                <KpiCard icon={Layers} label={t('templates')} value={stats.templates} subValue={`${stats.active_templates} ${t('active').toLowerCase()}`} color="sky" delay={0.25} />
            </div>

            {/* Main Content: Recent Broadcasts + System Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Broadcasts */}
                <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="p-0 overflow-hidden">
                        <div className="px-5 pt-5 pb-3 border-b border-neutral-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-neutral-900">{t('recentBroadcasts')}</h2>
                                <p className="text-xs text-neutral-400 mt-0.5">{t('nda_broadcastsTableDesc')}</p>
                            </div>
                            <Link href="/admin/notifications/broadcasts" className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1">
                                {t('viewAll')} <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        {recentBroadcasts.length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {recentBroadcasts.map((b) => (
                                    <Link key={b.id} href={`/admin/notifications/broadcasts/${b.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors">
                                        <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                            <Send className="h-4 w-4 text-primary-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">{b.title}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">{t('nda_by')} {b.creator} - {b.created_at_human}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {typeBadge(b.type)}
                                            {statusBadge(b.status)}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mb-3">
                                    <Send className="h-5 w-5 text-neutral-400" />
                                </div>
                                <h3 className="text-sm font-medium text-neutral-900">{t('noBroadcastsFound')}</h3>
                                <p className="text-xs text-neutral-500 mt-1 mb-4">{t('noBroadcastsDesc')}</p>
                                <Link
                                    href="/admin/notifications/broadcasts/create"
                                    className="inline-flex items-center text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors"
                                >
                                    {t('createBroadcast')}
                                </Link>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Right Sidebar: System Notifications Feed + Quick Stats */}
                <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    {/* Recent System Notifications */}
                    <Card className="p-0 overflow-hidden">
                        <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
                            <h2 className="text-sm font-semibold text-neutral-900">{t('nda_recentSystemNotifs')}</h2>
                            <p className="text-xs text-neutral-400 mt-0.5">{t('nda_recentSystemNotifsDesc')}</p>
                        </div>
                        {(recentNotifications || []).length > 0 ? (
                            <div className="divide-y divide-neutral-50 max-h-[400px] overflow-y-auto">
                                {recentNotifications.map((n) => {
                                    const cfg = getTypeConfig(n.type);
                                    const Icon = cfg.icon;
                                    return (
                                        <div key={n.id} className={cn('flex items-start gap-3 px-5 py-3', !n.read_at && 'bg-primary-50/30')}>
                                            <div className={cn('h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                                                <Icon className={cn('h-3.5 w-3.5', cfg.color)} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-neutral-800 leading-snug line-clamp-2">
                                                    {n.data?.message || n.data?.title || n.type}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-neutral-400">{n.user}</span>
                                                    <span className="text-[10px] text-neutral-300">-</span>
                                                    <span className="text-[10px] text-neutral-400">{n.created_at}</span>
                                                </div>
                                            </div>
                                            {!n.read_at && <div className="h-2 w-2 rounded-full bg-primary-500 shrink-0 mt-2" />}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <Bell className="h-8 w-8 text-neutral-200 mx-auto mb-2" />
                                <p className="text-xs text-neutral-400">{t('nda_noSystemNotifs')}</p>
                            </div>
                        )}
                    </Card>

                    {/* System Capacity */}
                    <Card className="p-0 overflow-hidden">
                        <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
                            <h2 className="text-sm font-semibold text-neutral-900">{t('systemCapacity')}</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-neutral-600 font-medium">{t('templates')}</span>
                                    <span className="text-neutral-500">{stats.templates} / 50</span>
                                </div>
                                <div className="w-full bg-neutral-100 rounded-full h-1.5">
                                    <div className="bg-primary-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((stats.templates / 50) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-neutral-600 font-medium">{t('nda_automationRules')}</span>
                                    <span className="text-neutral-500">{stats.automation_rules} / 25</span>
                                </div>
                                <div className="w-full bg-neutral-100 rounded-full h-1.5">
                                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((stats.automation_rules / 25) * 100, 100)}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-neutral-600 font-medium">{t('nda_monthlyQuota')}</span>
                                    <span className="text-neutral-500">{t('unlimited')}</span>
                                </div>
                                <div className="w-full bg-neutral-100 rounded-full h-1.5">
                                    <div className="bg-amber-500 h-1.5 rounded-full transition-all" style={{ width: '8%' }} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
