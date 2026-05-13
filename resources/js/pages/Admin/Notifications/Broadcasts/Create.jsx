import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { Send, ArrowLeft, Info, Calendar } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function BroadcastCreate({ templates, users }) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        type: 'info',
        priority: 'normal',
        target_type: 'all',
        target_values: [],
        channels: ['database'],
        template_id: '',
        scheduled_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/notifications/broadcasts');
    };

    return (
        <AppLayout title={t('brc_newBroadcast')}>
            <div className="mb-6 flex items-center">
                <Link href="/admin/notifications/broadcasts" className="mr-4 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('brc_newBroadcast')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('brc_newBroadcastDesc')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-5 border-b border-neutral-100 flex items-center bg-primary-50 rounded-t-lg">
                            <Info className="h-5 w-5 text-primary-600 mr-2" />
                            <p className="text-sm text-primary-800">{t('brc_infoNote')}</p>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        id="title"
                                        label={t('brc_title')}
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={errors.title}
                                        required
                                        placeholder={t('brc_titlePlaceholder')}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t('brc_messageBody')}</label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        rows={6}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                        placeholder={t('brc_messagePlaceholder')}
                                    ></textarea>
                                    {errors.message && <p className="text-sm text-rose-500 mt-1">{errors.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t('brc_typeTheme')}</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="info">{t('brc_infoBlue')}</option>
                                        <option value="success">{t('brc_successGreen')}</option>
                                        <option value="warning">{t('brc_warningYellow')}</option>
                                        <option value="error">{t('brc_errorRed')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t('brc_priority')}</label>
                                    <select
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="low">{t('brc_low')}</option>
                                        <option value="normal">{t('brc_normal')}</option>
                                        <option value="high">{t('brc_high')}</option>
                                        <option value="urgent">{t('brc_urgent')}</option>
                                    </select>
                                </div>
                            </div>
                            
                            <hr className="border-neutral-100" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t('brc_targetAudience')}</label>
                                    <select
                                        value={data.target_type}
                                        onChange={(e) => setData('target_type', e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="all">{t('brc_allUsers')}</option>
                                        <option value="role">{t('brc_specificRoles')}</option>
                                        <option value="department">{t('brc_specificDepartments')}</option>
                                    </select>
                                </div>
                                
                                {data.target_type === 'role' && (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">{t('brc_selectRoles')}</label>
                                        <select
                                            multiple
                                            value={data.target_values}
                                            onChange={(e) => setData('target_values', Array.from(e.target.selectedOptions, option => option.value))}
                                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                        >
                                            <option value="user">{t('brc_user')}</option>
                                            <option value="admin">{t('brc_admin')}</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <hr className="border-neutral-100" />
                            
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-neutral-500">
                                    {t('brc_deliveryNote')}
                                </div>
                                <Button type="submit" loading={processing}>
                                    <Send className="h-4 w-4 mr-2" />
                                    {t('brc_sendBroadcast')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="col-span-1 space-y-6">
                    <Card>
                        <div className="p-5 border-b border-neutral-100 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-neutral-500" />
                            <h2 className="text-lg font-semibold text-neutral-900">{t('brc_scheduling')}</h2>
                        </div>
                        <div className="p-5">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t('brc_sendAt')}</label>
                            <Input
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                error={errors.scheduled_at}
                            />
                            <p className="text-xs text-neutral-500 mt-2">{t('brc_leaveBlank')}</p>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-5 border-b border-neutral-100">
                            <h2 className="text-lg font-semibold text-neutral-900">{t('brc_useTemplate')}</h2>
                        </div>
                        <div className="p-5">
                            <select
                                value={data.template_id}
                                onChange={(e) => {
                                    setData('template_id', e.target.value);
                                    // Normally we would fetch and apply the template content here
                                }}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                            >
                                <option value="">{t('brc_noTemplate')}</option>
                                {templates.map(tmpl => (
                                    <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                                ))}
                            </select>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
