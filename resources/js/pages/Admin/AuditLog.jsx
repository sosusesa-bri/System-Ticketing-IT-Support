import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AppLayout from '../../layouts/AppLayout';
import { Search, FileText, ChevronLeft, ChevronRight, Activity, Users, AlertOctagon, Download, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { actionLabels, getActionColor } from '../../utils/audit';

export default function AuditLog({ logs, filters, actions, stats }) {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [selectedLog, setSelectedLog] = useState(null);

    const applyFilter = (key, value) => {
        router.get('/admin/audit-log', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    return (
        <AppLayout title="Audit Log">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('auditLog') || 'Audit Log'}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('auditLogDesc') || 'Track system activities and events'}</p>
                </div>
                <a 
                    href="/admin/export/audit-logs" 
                    target="_blank" 
                    className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 h-10 px-4 shadow-sm"
                >
                    <Download className="h-4 w-4" />
                    {language === 'id' ? 'Ekspor CSV' : 'Export CSV'}
                </a>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="p-3 bg-primary-50 rounded-lg mr-4">
                        <Activity className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{language === 'id' ? 'Total Aktivitas Hari Ini' : 'Total Activity Today'}</p>
                        <h3 className="text-2xl font-bold text-neutral-900">{stats?.total_today || 0}</h3>
                    </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="p-3 bg-blue-50 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{language === 'id' ? 'Login Hari Ini' : 'Logins Today'}</p>
                        <h3 className="text-2xl font-bold text-neutral-900">{stats?.logins_today || 0}</h3>
                    </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="p-3 bg-danger-50 rounded-lg mr-4">
                        <AlertOctagon className="h-6 w-6 text-danger-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{language === 'id' ? 'Aktivitas Kritis Hari Ini' : 'Critical Activity Today'}</p>
                        <h3 className="text-2xl font-bold text-neutral-900">{stats?.critical_today || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <form onSubmit={handleSearch} className="relative lg:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={language === 'id' ? 'Cari deskripsi, nama, IP...' : 'Search desc, name, IP...'} className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                    </form>
                    <select value={filters.action || ''} onChange={(e) => applyFilter('action', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{t('allActions') || 'All Actions'}</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>{actionLabels[action] || action}</option>
                        ))}
                    </select>
                    <select value={filters.role || ''} onChange={(e) => applyFilter('role', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{language === 'id' ? 'Semua Peran' : 'All Roles'}</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="technician">Technician</option>
                    </select>
                    <input type="date" value={filters.date_from || ''} onChange={(e) => applyFilter('date_from', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" placeholder="From date" title={language === 'id' ? 'Dari Tanggal' : 'From Date'} />
                    <input type="date" value={filters.date_to || ''} onChange={(e) => applyFilter('date_to', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" placeholder="To date" title={language === 'id' ? 'Sampai Tanggal' : 'To Date'} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
                {logs.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-medium">
                                        <th className="px-6 py-3">{t('date') || 'Date'}</th>
                                        <th className="px-6 py-3">{t('action') || 'Action'}</th>
                                        <th className="px-6 py-3">{t('description') || 'Description'}</th>
                                        <th className="px-6 py-3">{t('user') || 'User'}</th>
                                        <th className="px-6 py-3">{t('ip') || 'IP Address'}</th>
                                        <th className="px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => setSelectedLog(log)}>
                                            <td className="px-6 py-3 text-neutral-500">{log.created_at}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium border border-transparent ${getActionColor(log.action)}`}>
                                                    {actionLabels[log.action] || log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-neutral-900 max-w-[250px] truncate">{log.description}</td>
                                            <td className="px-6 py-3 text-neutral-600">{log.user}</td>
                                            <td className="px-6 py-3 font-mono text-xs text-neutral-500">{log.ip_address || '-'}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button className="text-neutral-400 hover:text-primary-600 p-1 rounded-md transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 bg-neutral-50/50">
                                <p className="text-sm text-neutral-500">{t('showing')} {logs.from}-{logs.to} {t('of')} {logs.total}</p>
                                <div className="flex items-center gap-1">
                                    {logs.prev_page_url && <Link href={logs.prev_page_url} className="p-2 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600"><ChevronLeft className="h-4 w-4" /></Link>}
                                    {logs.next_page_url && <Link href={logs.next_page_url} className="p-2 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600"><ChevronRight className="h-4 w-4" /></Link>}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-lg font-medium text-neutral-900 mb-1">{t('noAuditLogs') || 'No audit logs found'}</h3>
                        <p className="text-sm text-neutral-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Dialog.Root open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <AnimatePresence>
                    {selectedLog && (
                        <Dialog.Portal forceMount>
                            <Dialog.Overlay asChild>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50"
                                />
                            </Dialog.Overlay>
                            <Dialog.Content asChild>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden flex flex-col max-h-[90vh]"
                                >
                                    <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                                        <Dialog.Title className="text-lg font-bold text-neutral-900">
                                            {language === 'id' ? 'Detail Log Audit' : 'Audit Log Details'}
                                        </Dialog.Title>
                                        <Dialog.Close className="text-neutral-400 hover:text-neutral-700 rounded-md p-1 transition-colors">
                                            <X className="h-5 w-5" />
                                        </Dialog.Close>
                                    </div>
                                    <div className="px-6 py-5 overflow-y-auto">
                                        <div className="space-y-4 text-sm">
                                            <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-3">
                                                <div className="text-neutral-500 font-medium">ID</div>
                                                <div className="col-span-2 text-neutral-900 font-mono text-xs">{selectedLog.id}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-3">
                                                <div className="text-neutral-500 font-medium">{t('date') || 'Date'}</div>
                                                <div className="col-span-2 text-neutral-900">{selectedLog.created_at}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-3">
                                                <div className="text-neutral-500 font-medium">{t('user') || 'User'}</div>
                                                <div className="col-span-2 text-neutral-900 font-medium">{selectedLog.user}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-3">
                                                <div className="text-neutral-500 font-medium">{t('action') || 'Action'}</div>
                                                <div className="col-span-2">
                                                    <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                                                        {actionLabels[selectedLog.action] || selectedLog.action}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-3">
                                                <div className="text-neutral-500 font-medium">{t('description') || 'Description'}</div>
                                                <div className="col-span-2 text-neutral-900">{selectedLog.description}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 border-b border-neutral-100 pb-3">
                                                <div className="text-neutral-500 font-medium">{t('ip') || 'IP Address'}</div>
                                                <div className="col-span-2 text-neutral-900 font-mono text-xs bg-neutral-100 w-max px-2 py-0.5 rounded">{selectedLog.ip_address || '-'}</div>
                                            </div>
                                            
                                            {selectedLog.properties && Object.keys(selectedLog.properties).length > 0 && (
                                                <div className="pt-2">
                                                    <div className="text-neutral-500 font-medium mb-2">Properties Data</div>
                                                    <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-xs overflow-x-auto">
                                                        {JSON.stringify(selectedLog.properties, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
                                        <Dialog.Close asChild>
                                            <button className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors">
                                                {language === 'id' ? 'Tutup' : 'Close'}
                                            </button>
                                        </Dialog.Close>
                                    </div>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    )}
                </AnimatePresence>
            </Dialog.Root>
        </AppLayout>
    );
}
