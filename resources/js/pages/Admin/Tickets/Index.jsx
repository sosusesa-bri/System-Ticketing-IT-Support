import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AppLayout from '../../../layouts/AppLayout';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import SlaIndicator from '../../../components/shared/SlaIndicator';
import Button from '../../../components/ui/Button';
import { Search, Tickets, ChevronLeft, ChevronRight, Filter, CheckSquare, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTicketIndex({ tickets, filters, categories, admins }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [selected, setSelected] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [bulkValue, setBulkValue] = useState('');

    const applyFilter = (key, value) => {
        router.get('/admin/tickets', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => { e.preventDefault(); applyFilter('search', search); };

    const handleQuickUpdate = (ticketId, field, value) => {
        router.put(`/admin/tickets/${ticketId}`, { [field]: value }, { preserveScroll: true, preserveState: true, only: ['tickets'] });
    };

    const toggleSelect = (id) => {
        setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setSelected((prev) => prev.length === tickets.data.length ? [] : tickets.data.map((t) => t.id));
    };

    const executeBulk = () => {
        if (!bulkAction || selected.length === 0) return;
        router.post('/admin/tickets/bulk-action', {
            ticket_ids: selected, action: bulkAction, value: bulkValue || null,
        }, {
            preserveScroll: true,
            onSuccess: () => { setSelected([]); setBulkAction(''); setBulkValue(''); },
        });
    };

    return (
        <AppLayout title="All Tickets">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('allTickets')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage all support tickets across the organization.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{t('filters')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <form onSubmit={handleSearch} className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchPlaceholder')} className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                    </form>
                    <select value={filters.status || ''} onChange={(e) => applyFilter('status', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{t('allStatus')}</option>
                        <option value="open">{t('open')}</option>
                        <option value="on_process">{t('inProgress')}</option>
                        <option value="closed">{t('closed')}</option>
                        <option value="reopened">{t('reopened')}</option>
                    </select>
                    <select value={filters.priority || ''} onChange={(e) => applyFilter('priority', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{t('allPriority')}</option>
                        <option value="low">{t('low')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="high">{t('high')}</option>
                        <option value="critical">{t('critical')}</option>
                    </select>
                    <select value={filters.assigned_to || ''} onChange={(e) => applyFilter('assigned_to', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{t('allAssignee')}</option>
                        <option value="unassigned">{t('unassigned')}</option>
                        {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
                <div className="mt-4 flex justify-end">
                    <a href="/admin/export/tickets" target="_blank" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 h-9 px-4">Export CSV</a>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-primary-800">{selected.length} selected</span>
                        <select value={bulkAction} onChange={(e) => { setBulkAction(e.target.value); setBulkValue(''); }} className="h-8 rounded-md border border-primary-200 bg-white px-2 text-xs">
                            <option value="">Choose action...</option>
                            <option value="assign">Assign To</option>
                            <option value="status">Change Status</option>
                            <option value="priority">Change Priority</option>
                            <option value="close">Close All</option>
                        </select>
                        {bulkAction === 'assign' && (
                            <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="h-8 rounded-md border border-primary-200 bg-white px-2 text-xs">
                                <option value="">Select admin...</option>
                                {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        )}
                        {bulkAction === 'status' && (
                            <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="h-8 rounded-md border border-primary-200 bg-white px-2 text-xs">
                                <option value="">Select status...</option>
                                <option value="open">Open</option>
                                <option value="on_process">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        )}
                        {bulkAction === 'priority' && (
                            <select value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="h-8 rounded-md border border-primary-200 bg-white px-2 text-xs">
                                <option value="">Select priority...</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        )}
                        <Button onClick={executeBulk} className="h-8 text-xs px-3" disabled={!bulkAction || (bulkAction !== 'close' && !bulkValue)}>Apply</Button>
                        <button onClick={() => setSelected([])} className="ml-auto text-neutral-500 hover:text-neutral-700"><X className="h-4 w-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {tickets.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-neutral-50">
                                        <th className="w-10 px-3 py-3">
                                            <button onClick={toggleAll} className="text-neutral-400 hover:text-neutral-600">
                                                {selected.length === tickets.data.length ? <CheckSquare className="h-4 w-4 text-primary-600" /> : <Square className="h-4 w-4" />}
                                            </button>
                                        </th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('id')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('title')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('requester')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('status')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('priority')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">SLA</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('assigned')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">{t('date')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className={`hover:bg-neutral-50 transition-colors ${selected.includes(ticket.id) ? 'bg-primary-50/40' : ''}`}>
                                            <td className="px-3 py-3">
                                                <button onClick={() => toggleSelect(ticket.id)} className="text-neutral-400 hover:text-neutral-600">
                                                    {selected.includes(ticket.id) ? <CheckSquare className="h-4 w-4 text-primary-600" /> : <Square className="h-4 w-4" />}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-primary-700">
                                                <Link href={`/admin/tickets/${ticket.id}`}>{ticket.ticket_number}</Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-neutral-950 max-w-[180px] truncate">
                                                <Link href={`/admin/tickets/${ticket.id}`} className="hover:text-primary-700">{ticket.title}</Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-neutral-500">{ticket.requester}</td>
                                            <td className="px-4 py-3">
                                                <select value={ticket.status} onChange={(e) => handleQuickUpdate(ticket.id, 'status', e.target.value)} className="text-xs font-medium rounded-full px-2.5 py-0.5 border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer w-28">
                                                    <option value="open">{t('open')}</option>
                                                    <option value="on_process">{t('inProgress')}</option>
                                                    <option value="closed">{t('closed')}</option>
                                                    <option value="reopened">{t('reopened')}</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select value={ticket.priority} onChange={(e) => handleQuickUpdate(ticket.id, 'priority', e.target.value)} className="text-xs font-medium rounded-full px-2.5 py-0.5 border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer w-24">
                                                    <option value="low">{t('low')}</option>
                                                    <option value="medium">{t('medium')}</option>
                                                    <option value="high">{t('high')}</option>
                                                    <option value="critical">{t('critical')}</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <SlaIndicator dueAt={ticket.due_at} isClosed={ticket.status === 'closed'} />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-neutral-500">{ticket.assigned_to || <span className="text-warning-600">{t('unassigned')}</span>}</td>
                                            <td className="px-4 py-3 text-sm text-neutral-500">{ticket.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {tickets.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200">
                                <p className="text-sm text-neutral-500">{t('showing')} {tickets.from}-{tickets.to} {t('of')} {tickets.total}</p>
                                <div className="flex items-center gap-1">
                                    {tickets.prev_page_url && <Link href={tickets.prev_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronLeft className="h-4 w-4 text-neutral-500" /></Link>}
                                    {tickets.next_page_url && <Link href={tickets.next_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronRight className="h-4 w-4 text-neutral-500" /></Link>}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Tickets className="h-10 w-10 text-neutral-300 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-neutral-950">{t('noTicketsFound')}</p>
                        <p className="text-sm text-neutral-500 mt-1">{t('adjustFilters')}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
