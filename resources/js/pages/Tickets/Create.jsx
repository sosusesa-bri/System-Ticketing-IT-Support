import { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ChevronRight, AlertCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

export default function TicketCreate({ categories }) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        priority: 'medium',
        description: '',
        attachments: [],
    });

    const [similarTickets, setSimilarTickets] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!data.title || data.title.length < 5) {
            setSimilarTickets([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await axios.get('/tickets-search/duplicates', {
                    params: {
                        title: data.title,
                        category_id: data.category_id || null
                    }
                });
                setSimilarTickets(response.data);
            } catch (error) {
                console.error("Failed to check similar tickets", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.title, data.category_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/tickets', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title={t('createTicket')}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/dashboard" className="hover:text-primary-700">{t('dashboard')}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{t('createTicket')}</span>
            </nav>

            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-primary-900 mb-1">{t('createNewTicket')}</h1>
                <p className="text-sm text-neutral-500 mb-6">
                    {t('createTicketDesc')}
                </p>

                <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 space-y-5">
                    <Input
                        id="title"
                        label={t('title')}
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
                        helpText={t('titleHelpText')}
                        placeholder={t('titlePlaceholder')}
                        autoFocus
                        required
                    />

                    <AnimatePresence>
                        {similarTickets.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex gap-3 items-start">
                                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-amber-900">
                                                {t('similarTicketsFound')}
                                            </h4>
                                            <p className="text-sm text-amber-700 mt-1 mb-3">
                                                {t('similarTicketsDesc')}
                                            </p>
                                            <ul className="space-y-2">
                                                {similarTickets.map(ticket => (
                                                    <li key={ticket.id} className="bg-white/60 rounded px-3 py-2 text-sm border border-amber-100 flex justify-between items-center">
                                                        <div>
                                                            <span className="font-medium text-neutral-900">{ticket.ticket_number}</span>
                                                            <span className="mx-2 text-neutral-300">|</span>
                                                            <span className="text-neutral-700">{ticket.title}</span>
                                                            <span className="mx-2 text-neutral-300">|</span>
                                                            <span className="text-neutral-500 text-xs">{ticket.status}</span>
                                                        </div>
                                                        <a 
                                                            href={`/tickets/${ticket.id}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium text-xs whitespace-nowrap"
                                                        >
                                                            {t('viewTicket')} <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="category_id" className="block text-xs font-medium text-neutral-500">
                                {t('category')}
                            </label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                required
                            >
                                <option value="">{t('selectCategory')}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-xs text-danger-600">{errors.category_id}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="priority" className="block text-xs font-medium text-neutral-500">
                                {t('priority')}
                            </label>
                            <select
                                id="priority"
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                required
                            >
                                <option value="low">{t('low')}</option>
                                <option value="medium">{t('medium')}</option>
                                <option value="high">{t('high')}</option>
                                <option value="critical">{t('critical')}</option>
                            </select>
                            {errors.priority && (
                                <p className="text-xs text-danger-600">{errors.priority}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="description" className="block text-xs font-medium text-neutral-500">
                            {t('description')}
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full min-h-[96px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                            placeholder={t('descriptionPlaceholder')}
                            required
                        />
                        {errors.description && (
                            <p className="text-xs text-danger-600">{errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-neutral-500">
                            {t('attachmentsOptional')}
                        </label>
                        <div className="border-2 border-dashed border-neutral-300 rounded-md p-4 text-center hover:border-primary-700 transition-colors">
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setData('attachments', Array.from(e.target.files))}
                                className="w-full text-sm text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-50"
                            />
                            <p className="text-xs text-neutral-400 mt-2">
                                {t('attachmentHint')}
                            </p>
                        </div>
                        {errors['attachments.0'] && (
                            <p className="text-xs text-danger-600">{errors['attachments.0']}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" loading={processing} disabled={processing}>
                            {t('submitTicket')}
                        </Button>
                        <Link href="/tickets">
                            <Button variant="secondary" type="button">{t('cancel')}</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
