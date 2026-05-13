    import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Plus, Search, Tickets, ChevronLeft, ChevronRight, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';

export default function TicketIndex({ tickets, filters }) {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilter = (key, value) => {
        router.get('/tickets', {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleDeleteDraft = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(`/tickets/${deleteTarget.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AppLayout title={t('myTickets')}>
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('myTickets')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {t('trackTicketsDesc')}
                    </p>
                </div>
                <Link href="/tickets/create">
                    <Button>
                        <Plus className="h-4 w-4" strokeWidth={2} />
                        {t('newTicket')}
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('searchByIdOrTitle')}
                            className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                        />
                    </form>

                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyFilter('status', e.target.value)}
                        className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                    >
                        <option value="">{t('allStatus')}</option>
                        <option value="draft">{t('draft')}</option>
                        <option value="open">{t('open')}</option>
                        <option value="on_process">{t('inProgress')}</option>
                        <option value="closed">{t('closed')}</option>
                        <option value="reopened">{t('reopened')}</option>
                    </select>

                    <select
                        value={filters.priority || ''}
                        onChange={(e) => applyFilter('priority', e.target.value)}
                        className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                    >
                        <option value="">{t('allPriority')}</option>
                        <option value="low">{t('low')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="high">{t('high')}</option>
                        <option value="critical">{t('critical')}</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {tickets.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-neutral-50">
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('id')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('title')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('category')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('status')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('priority')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('date')}</th>
                                        <th className="text-right text-xs font-medium text-neutral-500 px-6 py-3">{language === 'id' ? 'Aksi' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-3 text-sm font-medium text-primary-700">
                                                <Link href={`/tickets/${ticket.id}`}>{ticket.ticket_number}</Link>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-neutral-950">
                                                <Link href={`/tickets/${ticket.id}`} className="hover:text-primary-700">
                                                    {ticket.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{ticket.category || '-'}</td>
                                            <td className="px-6 py-3"><StatusBadge status={ticket.status} /></td>
                                            <td className="px-6 py-3"><PriorityBadge priority={ticket.priority} /></td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{ticket.created_at}</td>
                                            <td className="px-6 py-3 text-right">
                                                {ticket.status === 'draft' && (
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/tickets/${ticket.id}/edit`}
                                                            className="p-1.5 rounded-md hover:bg-primary-50 text-neutral-400 hover:text-primary-700 transition-colors"
                                                            title={language === 'id' ? 'Edit Draf' : 'Edit Draft'}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteTarget(ticket)}
                                                            className="p-1.5 rounded-md hover:bg-danger-50 text-neutral-400 hover:text-danger-600 transition-colors"
                                                            title={language === 'id' ? 'Hapus Draf' : 'Delete Draft'}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {tickets.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200">
                                <p className="text-sm text-neutral-500">
                                    {t('showing')} {tickets.from}-{tickets.to} {t('of')} {tickets.total} {t('tickets').toLowerCase()}
                                </p>
                                <div className="flex items-center gap-1">
                                    {tickets.prev_page_url && (
                                        <Link href={tickets.prev_page_url} className="p-2 rounded-md hover:bg-neutral-50">
                                            <ChevronLeft className="h-4 w-4 text-neutral-500" />
                                        </Link>
                                    )}
                                    {tickets.next_page_url && (
                                        <Link href={tickets.next_page_url} className="p-2 rounded-md hover:bg-neutral-50">
                                            <ChevronRight className="h-4 w-4 text-neutral-500" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Tickets className="h-10 w-10 text-neutral-300 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-neutral-950">{t('noTicketsFound')}</p>
                        <p className="text-sm text-neutral-500 mt-1">
                            {filters.search || filters.status || filters.priority
                                ? t('adjustFilters')
                                : t('createFirstTicket')}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Draft Confirmation Modal */}
            <Dialog.Root open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <AnimatePresence>
                    {deleteTarget && (
                        <Dialog.Portal forceMount>
                            <Dialog.Overlay asChild>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50"
                                />
                            </Dialog.Overlay>
                            <Dialog.Content asChild>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
                                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                                >
                                    <div className="px-6 pt-6 pb-5">
                                        <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mb-4">
                                            <AlertTriangle className="h-6 w-6 text-danger-600" strokeWidth={1.5} />
                                        </div>
                                        <Dialog.Title className="text-xl font-bold text-neutral-900 mb-2">
                                            {language === 'id' ? 'Hapus Draf Tiket' : 'Delete Draft Ticket'}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-neutral-500 leading-relaxed">
                                            {language === 'id'
                                                ? `Apakah Anda yakin ingin menghapus draf tiket "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`
                                                : `Are you sure you want to delete the draft ticket "${deleteTarget?.title}"? This action cannot be undone.`}
                                        </Dialog.Description>
                                    </div>
                                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors"
                                            >
                                                {language === 'id' ? 'Batal' : 'Cancel'}
                                            </motion.button>
                                        </Dialog.Close>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleDeleteDraft}
                                            disabled={isDeleting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                                        >
                                            {isDeleting && (
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            )}
                                            {isDeleting
                                                ? (language === 'id' ? 'Menghapus...' : 'Deleting...')
                                                : (language === 'id' ? 'Hapus Draf' : 'Delete Draft')}
                                        </motion.button>
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
