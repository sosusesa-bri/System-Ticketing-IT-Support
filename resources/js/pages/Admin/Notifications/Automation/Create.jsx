import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
    ChevronRight,
    Zap,
} from 'lucide-react';

const TRIGGER_EVENTS = [
    { value: 'ticket_created', label: 'Ticket Created' },
    { value: 'ticket_status_changed', label: 'Ticket Status Changed' },
    { value: 'ticket_assigned', label: 'Ticket Assigned' },
    { value: 'ticket_commented', label: 'Ticket Commented' },
    { value: 'ticket_closed', label: 'Ticket Closed' },
];

export default function AutomationCreate({ templates }) {
    const { t } = useLanguage();

    const form = useForm({
        name: '',
        event: '',
        template_id: '',
        action: { type: 'send_notification', channels: ['database'] },
        conditions: [],
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/notifications/automation');
    };

    return (
        <AppLayout title={t('na_newRule')}>
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">{t('dashboard')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/notifications/automation" className="hover:text-primary-700">{t('na_automation')}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{t('na_newRule')}</span>
            </nav>

            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-primary-900 mb-1">{t('na_newRule')}</h1>
                <p className="text-sm text-neutral-500 mb-6">{t('na_createRuleDesc')}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('na_ruleName')}</label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder={t('na_ruleNamePlaceholder')}
                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    required
                                />
                                {form.errors.name && <p className="text-xs text-red-600">{form.errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('na_triggerEvent')}</label>
                                <select
                                    value={form.data.event}
                                    onChange={(e) => form.setData('event', e.target.value)}
                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    required
                                >
                                    <option value="">{t('na_selectEvent')}</option>
                                    {TRIGGER_EVENTS.map(ev => (
                                        <option key={ev.value} value={ev.value}>{ev.label}</option>
                                    ))}
                                </select>
                                {form.errors.event && <p className="text-xs text-red-600">{form.errors.event}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('na_template')}</label>
                                <select
                                    value={form.data.template_id}
                                    onChange={(e) => form.setData('template_id', e.target.value)}
                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    required
                                >
                                    <option value="">{t('na_selectTemplate')}</option>
                                    {(templates || []).map(tp => (
                                        <option key={tp.id} value={tp.id}>{tp.name}</option>
                                    ))}
                                </select>
                                {form.errors.template_id && <p className="text-xs text-red-600">{form.errors.template_id}</p>}
                            </div>
                        </div>
                    </Card>

                    {/* Action Config */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="h-4 w-4 text-neutral-400" />
                            <h3 className="text-sm font-semibold text-neutral-950">{t('na_actionConfig')}</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.action.channels?.includes('database')}
                                    onChange={(e) => {
                                        const channels = e.target.checked
                                            ? [...(form.data.action.channels || []), 'database']
                                            : form.data.action.channels.filter(c => c !== 'database');
                                        form.setData('action', { ...form.data.action, channels });
                                    }}
                                    className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700"
                                />
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">{t('na_inAppNotification')}</p>
                                    <p className="text-xs text-neutral-500">{t('na_inAppDesc')}</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.action.channels?.includes('mail')}
                                    onChange={(e) => {
                                        const channels = e.target.checked
                                            ? [...(form.data.action.channels || []), 'mail']
                                            : form.data.action.channels.filter(c => c !== 'mail');
                                        form.setData('action', { ...form.data.action, channels });
                                    }}
                                    className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700"
                                />
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">{t('na_emailNotification')}</p>
                                    <p className="text-xs text-neutral-500">{t('na_emailDesc')}</p>
                                </div>
                            </label>
                        </div>
                    </Card>

                    {/* Active toggle */}
                    <Card>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700"
                            />
                            <div>
                                <p className="text-sm font-medium text-neutral-900">{t('nt_activeOnCreate')}</p>
                                <p className="text-xs text-neutral-500">{t('na_activeOnCreateDesc')}</p>
                            </div>
                        </label>
                    </Card>

                    <div className="flex items-center gap-3 justify-end">
                        <Link href="/admin/notifications/automation" className="text-sm text-neutral-500 hover:text-neutral-700">
                            {t('cancel')}
                        </Link>
                        <Button type="submit" loading={form.processing}>
                            {t('na_createRule')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
