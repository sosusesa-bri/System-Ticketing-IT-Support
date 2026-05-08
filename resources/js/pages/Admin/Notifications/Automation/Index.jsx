import { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
    Zap,
    Plus,
    Search,
    Edit3,
    Trash2,
    ToggleLeft,
    ToggleRight,
    ChevronRight,
    FileText,
    ArrowRight,
    Bell,
    Activity,
} from 'lucide-react';

const EVENT_ICONS = {
    ticket_created: Zap,
    ticket_status_changed: Activity,
    ticket_assigned: ArrowRight,
    ticket_commented: FileText,
    ticket_closed: Bell,
};

const EVENT_COLORS = {
    ticket_created: 'bg-blue-50 text-blue-600',
    ticket_status_changed: 'bg-amber-50 text-amber-600',
    ticket_assigned: 'bg-indigo-50 text-indigo-600',
    ticket_commented: 'bg-emerald-50 text-emerald-600',
    ticket_closed: 'bg-neutral-100 text-neutral-600',
};

export default function AutomationIndex({ rules }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const deleteForm = useForm({});

    const filtered = (rules || []).filter(rule =>
        rule.name.toLowerCase().includes(search.toLowerCase()) ||
        rule.trigger_event.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm(t('na_confirmDelete'))) {
            deleteForm.delete(`/admin/notifications/automation/${id}`, { preserveScroll: true });
        }
    };

    const handleToggle = (id, currentStatus) => {
        router.put(`/admin/notifications/automation/${id}`, {
            is_active: !currentStatus,
        }, { preserveScroll: true });
    };

    const formatEvent = (event) => {
        return event.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const activeCount = (rules || []).filter(r => r.is_active).length;
    const inactiveCount = (rules || []).filter(r => !r.is_active).length;

    return (
        <AppLayout title={t('na_automation')}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">{t('dashboard')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/notifications/dashboard" className="hover:text-primary-700">{t('notifications')}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{t('na_automation')}</span>
            </nav>

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('na_automation')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('na_automationDesc')}</p>
                </div>
                <Link
                    href="/admin/notifications/automation/create"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary-700 text-white hover:bg-primary-800 h-10 py-2 px-4"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('na_newRule')}
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                    <div className="text-center py-2">
                        <p className="text-2xl font-bold text-neutral-900">{(rules || []).length}</p>
                        <p className="text-xs text-neutral-500 mt-1">{t('na_totalRules')}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center py-2">
                        <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
                        <p className="text-xs text-neutral-500 mt-1">{t('active')}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center py-2">
                        <p className="text-2xl font-bold text-neutral-400">{inactiveCount}</p>
                        <p className="text-xs text-neutral-500 mt-1">{t('inactive')}</p>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('na_searchRules')}
                        className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-10 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                    />
                </div>
            </div>

            {/* Rules List */}
            {filtered.length === 0 ? (
                <Card>
                    <div className="py-12 text-center">
                        <Zap className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-500 mb-4">
                            {(rules || []).length === 0 ? t('na_noRulesYet') : t('na_noMatchingRules')}
                        </p>
                        {(rules || []).length === 0 && (
                            <Link
                                href="/admin/notifications/automation/create"
                                className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                {t('na_createFirstRule')}
                            </Link>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((rule, idx) => {
                        const EventIcon = EVENT_ICONS[rule.trigger_event] || Zap;
                        const colorClass = EVENT_COLORS[rule.trigger_event] || 'bg-neutral-100 text-neutral-600';

                        return (
                            <motion.div
                                key={rule.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.04 }}
                            >
                                <Card>
                                    <div className="flex items-center gap-4">
                                        {/* Event Icon */}
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                                            <EventIcon className="h-5 w-5" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="text-sm font-semibold text-neutral-950 truncate">{rule.name}</h3>
                                                <Badge variant={rule.is_active ? 'success' : 'neutral'} className="shrink-0">
                                                    {rule.is_active ? t('active') : t('inactive')}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-neutral-500">
                                                <span className="flex items-center gap-1">
                                                    <Zap className="h-3 w-3" />
                                                    {formatEvent(rule.trigger_event)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ArrowRight className="h-3 w-3" />
                                                    {rule.template}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => handleToggle(rule.id, rule.is_active)}
                                                className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
                                                title={rule.is_active ? t('nt_deactivate') : t('nt_activate')}
                                            >
                                                {rule.is_active ? (
                                                    <ToggleRight className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <ToggleLeft className="h-4 w-4 text-neutral-300" />
                                                )}
                                            </button>
                                            <Link
                                                href={`/admin/notifications/automation/${rule.id}/edit`}
                                                className="p-2 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-primary-600 transition-colors"
                                                title={t('edit')}
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                className="p-2 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                                                title={t('delete')}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}
