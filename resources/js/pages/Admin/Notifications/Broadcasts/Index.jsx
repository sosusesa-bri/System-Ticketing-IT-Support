import { Link } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Search, Plus } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import NavCards from '../NavCards';

export default function BroadcastsIndex({ broadcasts }) {
    const { t } = useLanguage();

    return (
        <AppLayout title={t('broadcasts')}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('broadcasts')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('nda_broadcastsDesc')}</p>
                </div>
                <Link 
                    href="/admin/notifications/broadcasts/create" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 disabled:opacity-50 disabled:pointer-events-none bg-primary-700 text-white hover:bg-primary-800 h-10 py-2 px-4"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('newBroadcast')}
                </Link>
            </div>

            {/* Quick Actions Navigation */}
            <NavCards currentPath="broadcasts" />

            <Card className="mb-6">
                <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-neutral-100">
                    <div className="w-full sm:w-96 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                        />
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('title')}</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('creator')}</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('type')}</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('status')}</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('date')}</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {broadcasts.data.length > 0 ? broadcasts.data.map((b) => (
                                <tr key={b.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                    <td className="py-3 px-5 text-sm font-medium text-neutral-900">{b.title}</td>
                                    <td className="py-3 px-5 text-sm text-neutral-600">{b.creator}</td>
                                    <td className="py-3 px-5">
                                        <Badge className={
                                            b.type === 'info' ? 'bg-sky-100 text-sky-700' :
                                            b.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                            b.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                            'bg-rose-100 text-rose-700'
                                        }>
                                            {b.type}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-5">
                                        <Badge className={
                                            b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                            b.status === 'draft' ? 'bg-neutral-100 text-neutral-700' :
                                            b.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                                            b.status === 'scheduled' ? 'bg-sky-100 text-sky-700' :
                                            'bg-rose-100 text-rose-700'
                                        }>
                                            {b.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-5 text-sm text-neutral-500">{b.created_at}</td>
                                    <td className="py-3 px-5 text-right">
                                        <Link href={`/admin/notifications/broadcasts/${b.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-800">
                                            {t('view')}
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-sm text-neutral-500">
                                        {t('noBroadcastsFound')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AppLayout>
    );
}
