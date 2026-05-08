import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
    ChevronRight,
    Plus,
    X,
    Variable,
    Info,
} from 'lucide-react';

export default function TemplateCreate() {
    const { t } = useLanguage();
    const [newVar, setNewVar] = useState('');

    const form = useForm({
        name: '',
        subject: '',
        content: '',
        variables: [],
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post('/admin/notifications/templates');
    };

    const addVariable = () => {
        const trimmed = newVar.trim().replace(/[{}]/g, '');
        if (trimmed && !form.data.variables.includes(trimmed)) {
            form.setData('variables', [...form.data.variables, trimmed]);
            setNewVar('');
        }
    };

    const removeVariable = (v) => {
        form.setData('variables', form.data.variables.filter(x => x !== v));
    };

    const insertVariable = (v) => {
        form.setData('content', form.data.content + `{{${v}}}`);
    };

    return (
        <AppLayout title={t('nt_newTemplate')}>
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">{t('dashboard')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/notifications/templates" className="hover:text-primary-700">{t('nt_templates')}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{t('nt_newTemplate')}</span>
            </nav>

            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-primary-900 mb-1">{t('nt_newTemplate')}</h1>
                <p className="text-sm text-neutral-500 mb-6">{t('nt_createTemplateDesc')}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('nt_templateName')}</label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder={t('nt_templateNamePlaceholder')}
                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    required
                                />
                                {form.errors.name && <p className="text-xs text-red-600">{form.errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('nt_subject')}</label>
                                <input
                                    type="text"
                                    value={form.data.subject}
                                    onChange={(e) => form.setData('subject', e.target.value)}
                                    placeholder={t('nt_subjectPlaceholder')}
                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    required
                                />
                                {form.errors.subject && <p className="text-xs text-red-600">{form.errors.subject}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('nt_content')}</label>
                                <textarea
                                    value={form.data.content}
                                    onChange={(e) => form.setData('content', e.target.value)}
                                    placeholder={t('nt_contentPlaceholder')}
                                    className="w-full min-h-[160px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y font-mono"
                                    required
                                />
                                {form.errors.content && <p className="text-xs text-red-600">{form.errors.content}</p>}
                            </div>
                        </div>
                    </Card>

                    {/* Variables */}
                    <Card>
                        <div className="flex items-center gap-2 mb-3">
                            <Variable className="h-4 w-4 text-neutral-400" />
                            <h3 className="text-sm font-semibold text-neutral-950">{t('nt_variables')}</h3>
                        </div>
                        <div className="flex items-center gap-1 p-2 bg-info-50 rounded-md mb-4">
                            <Info className="h-4 w-4 text-info-500 shrink-0" />
                            <p className="text-xs text-info-600">{t('nt_variablesHint')}</p>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="text"
                                value={newVar}
                                onChange={(e) => setNewVar(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addVariable(); } }}
                                placeholder={t('nt_addVariablePlaceholder')}
                                className="h-9 flex-1 rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                            />
                            <Button type="button" size="sm" variant="secondary" onClick={addVariable}>
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        {form.data.variables.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {form.data.variables.map((v) => (
                                    <span
                                        key={v}
                                        className="inline-flex items-center gap-1 text-xs font-mono bg-primary-50 text-primary-700 pl-2 pr-1 py-1 rounded cursor-pointer hover:bg-primary-100 transition-colors"
                                        onClick={() => insertVariable(v)}
                                        title={t('nt_clickToInsert')}
                                    >
                                        {`{{${v}}}`}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeVariable(v); }}
                                            className="p-0.5 hover:bg-primary-200 rounded"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
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
                                <p className="text-xs text-neutral-500">{t('nt_activeOnCreateDesc')}</p>
                            </div>
                        </label>
                    </Card>

                    <div className="flex items-center gap-3 justify-end">
                        <Link href="/admin/notifications/templates" className="text-sm text-neutral-500 hover:text-neutral-700">
                            {t('cancel')}
                        </Link>
                        <Button type="submit" loading={form.processing}>
                            {t('nt_createTemplate')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
