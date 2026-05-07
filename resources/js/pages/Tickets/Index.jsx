import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Plus, Search, Tickets, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TicketIndex({ tickets, filters }) {
    const { t } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');

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
        </AppLayout>
    );
}
