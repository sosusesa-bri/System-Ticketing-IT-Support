import { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    Edit3,
    Trash2,
    ToggleLeft,
    ToggleRight,
    ChevronRight,
    Mail,
    Variable,
    Copy,
    Eye,
    X,
    AlertTriangle,
} from 'lucide-react';
import NavCards from '../NavCards';
import * as Dialog from '@radix-ui/react-dialog';

export default function TemplatesIndex({ templates }) {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState('');
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteForm = useForm({});

    const filtered = (templates || []).filter(tp =>
        tp.name.toLowerCase().includes(search.toLowerCase()) ||
        tp.subject.toLowerCase().includes(search.toLowerCase())
    );

    const executeDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        deleteForm.delete(`/admin/notifications/templates/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            }
        });
    };

    const handleToggle = (id, currentStatus) => {
        router.put(`/admin/notifications/templates/${id}`, {
            is_active: !currentStatus,
        }, { preserveScroll: true });
    };

    return (
        <AppLayout title={t('nt_templates')}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">{t('dashboard')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/notifications/dashboard" className="hover:text-primary-700">{t('notifications')}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{t('nt_templates')}</span>
            </nav>

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('nt_templates')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('nt_templatesDesc')}</p>
                </div>
                <Link
                    href="/admin/notifications/templates/create"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary-700 text-white hover:bg-primary-800 h-10 py-2 px-4"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('nt_newTemplate')}
                </Link>
            </div>

            {/* Navigation Cards */}
            <NavCards currentPath="templates" stats={{ active_templates: templates?.filter(t => t.is_active)?.length || 0 }} />

            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('nt_searchTemplates')}
                        className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-10 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                    />
                </div>
            </div>

            {/* Templates Grid */}
            {filtered.length === 0 ? (
                <Card>
                    <div className="py-12 text-center">
                        <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-500 mb-4">
                            {templates?.length === 0 ? t('nt_noTemplatesYet') : t('nt_noMatchingTemplates')}
                        </p>
                        {templates?.length === 0 && (
                            <Link
                                href="/admin/notifications/templates/create"
                                className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                {t('nt_createFirstTemplate')}
                            </Link>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((tp, idx) => (
                        <motion.div
                            key={tp.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                            <Card className="h-full flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                            <Mail className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-neutral-950 truncate">{tp.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(tp.id, tp.is_active)}
                                        className="shrink-0 ml-2"
                                        title={tp.is_active ? t('nt_deactivate') : t('nt_activate')}
                                    >
                                        {tp.is_active ? (
                                            <ToggleRight className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <ToggleLeft className="h-5 w-5 text-neutral-300" />
                                        )}
                                    </button>
                                </div>

                                <p className="text-xs text-neutral-500 mb-1">{t('nt_subject')}</p>
                                <p className="text-sm text-neutral-700 mb-3 line-clamp-1">{tp.subject}</p>

                                {tp.variables && tp.variables.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap mb-3">
                                        <Variable className="h-3 w-3 text-neutral-400 shrink-0" />
                                        {tp.variables.slice(0, 3).map((v, i) => (
                                            <span key={i} className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                                                {`{{${v}}}`}
                                            </span>
                                        ))}
                                        {tp.variables.length > 3 && (
                                            <span className="text-[10px] text-neutral-400">+{tp.variables.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                                    <Badge variant={tp.is_active ? 'success' : 'neutral'}>
                                        {tp.is_active ? t('active') : t('inactive')}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setPreviewTemplate(tp)}
                                            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                                            title={t('nt_preview')}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <Link
                                            href={`/admin/notifications/templates/${tp.id}/edit`}
                                            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-primary-600 transition-colors"
                                            title={t('edit')}
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteTarget(tp)}
                                            className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                                            title={t('delete')}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            <AnimatePresence>
                {previewTemplate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setPreviewTemplate(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                                <h3 className="text-base font-semibold text-neutral-950">{t('nt_templatePreview')}</h3>
                                <button onClick={() => setPreviewTemplate(null)} className="p-1 rounded hover:bg-neutral-100">
                                    <X className="h-4 w-4 text-neutral-500" />
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">{t('nt_templateName')}</p>
                                    <p className="text-sm font-medium text-neutral-900">{previewTemplate.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-1">{t('nt_subject')}</p>
                                    <p className="text-sm text-neutral-900">{previewTemplate.subject}</p>
                                </div>
                                {previewTemplate.content && (
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">{t('nt_content')}</p>
                                        <div className="text-sm text-neutral-700 whitespace-pre-line bg-neutral-50 rounded-md p-3 border border-neutral-100">
                                            {previewTemplate.content}
                                        </div>
                                    </div>
                                )}
                                {previewTemplate.variables && previewTemplate.variables.length > 0 && (
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">{t('nt_variables')}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {previewTemplate.variables.map((v, i) => (
                                                <span key={i} className="text-xs font-mono bg-primary-50 text-primary-700 px-2 py-1 rounded">
                                                    {`{{${v}}}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Template Confirmation Modal */}
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
                                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 dark:backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden"
                                >
                                    <div className="px-6 pt-6 pb-5">
                                        <div className="w-12 h-12 rounded-full bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center mb-4">
                                            <AlertTriangle className="h-6 w-6 text-danger-600 dark:text-danger-500" strokeWidth={1.5} />
                                        </div>
                                        <Dialog.Title className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                            {language === 'id' ? 'Hapus Template' : 'Delete Template'}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            {language === 'id'
                                                ? `Apakah Anda yakin ingin menghapus template "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`
                                                : `Are you sure you want to delete template "${deleteTarget?.name}"? This action cannot be undone.`}
                                        </Dialog.Description>
                                    </div>
                                    <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none"
                                            >
                                                {language === 'id' ? 'Batal' : 'Cancel'}
                                            </motion.button>
                                        </Dialog.Close>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={executeDelete}
                                            disabled={isDeleting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                                        >
                                            {isDeleting && (
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            )}
                                            {language === 'id' ? 'Hapus' : 'Delete'}
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
