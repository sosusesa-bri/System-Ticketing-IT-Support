import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AppLayout from '../../layouts/AppLayout';
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AuditLog({ logs, filters, actions }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key, value) => {
        router.get('/admin/audit-log', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const actionLabels = {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        ticket_created: 'Ticket Created',
        ticket_updated: 'Ticket Updated',
        ticket_status_changed: 'Status Changed',
        ticket_assigned: 'Ticket Assigned',
        comment_added: 'Comment Added',
        profile_updated: 'Profile Updated',
        password_changed: 'Password Changed',
        user_role_changed: 'Role Changed',
    };

    return (
        <AppLayout title="Audit Log">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-900">{t('auditLog')}</h1>
                <p className="text-sm text-neutral-500 mt-1">{t('auditLogDesc')}</p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <form onSubmit={handleSearch} className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchDesc')} className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                    </form>
                    <select value={filters.action || ''} onChange={(e) => applyFilter('action', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{t('allActions')}</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>{actionLabels[action] || action}</option>
                        ))}
                    </select>
                    <input type="date" value={filters.date_from || ''} onChange={(e) => applyFilter('date_from', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" placeholder="From date" />
                </div>
                
                <div className="mt-4 flex justify-end">
                    <a 
                        href="/admin/export/audit-logs" 
                        target="_blank" 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 disabled:pointer-events-none disabled:opacity-50 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 h-9 px-4"
                    >
                        Export CSV
                    </a>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {logs.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-neutral-50">
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('date')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('action')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('description')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('user')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('ip')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-3 text-sm text-neutral-500 whitespace-nowrap">{log.created_at}</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex items-center h-6 px-2 rounded bg-neutral-100 text-xs font-medium text-neutral-600">
                                                    {actionLabels[log.action] || log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-neutral-950 max-w-[300px] truncate">{log.description}</td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{log.user}</td>
                                            <td className="px-6 py-3 text-xs font-mono text-neutral-400">{log.ip_address || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200">
                                <p className="text-sm text-neutral-500">{t('showing')} {logs.from}-{logs.to} {t('of')} {logs.total}</p>
                                <div className="flex items-center gap-1">
                                    {logs.prev_page_url && <Link href={logs.prev_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronLeft className="h-4 w-4 text-neutral-500" /></Link>}
                                    {logs.next_page_url && <Link href={logs.next_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronRight className="h-4 w-4 text-neutral-500" /></Link>}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm text-neutral-500">{t('noAuditLogs')}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
