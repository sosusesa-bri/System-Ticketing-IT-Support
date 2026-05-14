import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { HelpCircle, Plus, Trash2, Check, X, Pencil, Paperclip, FileText, UploadCloud, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqAdminIndex({ faqs }) {
    const { language } = useLanguage();
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteAttachmentTarget, setDeleteAttachmentTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        question: '', answer: '', category: '', sort_order: 0, attachments: []
    });

    const { data: editData, setData: setEditData, post: putEdit, processing: editProcessing, errors: editErrors } = useForm({
        _method: 'PUT', question: '', answer: '', category: '', sort_order: 0, attachments: []
    });

    const submitCreate = (e) => {
        e.preventDefault();
        post('/admin/faq', { onSuccess: () => reset() });
    };

    const startEdit = (faq) => {
        setEditingId(faq.id);
        setEditData({ _method: 'PUT', question: faq.question, answer: faq.answer, category: faq.category, sort_order: faq.sort_order, attachments: [] });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        // Use POST with _method=PUT to support file uploads in Laravel
        putEdit(`/admin/faq/${editingId}`, { onSuccess: () => setEditingId(null) });
    };

    const executeDeleteFaq = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(`/admin/faq/${deleteTarget.id}`, { 
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            }
        });
    };

    const toggleFaq = (id) => {
        router.put(`/admin/faq/${id}/toggle`, {}, { preserveScroll: true });
    };

    const executeDeleteAttachment = () => {
        if (!deleteAttachmentTarget) return;
        setIsDeleting(true);
        router.delete(`/admin/faq/attachments/${deleteAttachmentTarget.id}`, { 
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteAttachmentTarget(null);
            }
        });
    };

    const handleFileChange = (e, isEdit = false) => {
        const files = Array.from(e.target.files);
        if (isEdit) {
            setEditData('attachments', [...editData.attachments, ...files]);
        } else {
            setData('attachments', [...data.attachments, ...files]);
        }
    };

    const removeFile = (index, isEdit = false) => {
        if (isEdit) {
            const newFiles = [...editData.attachments];
            newFiles.splice(index, 1);
            setEditData('attachments', newFiles);
        } else {
            const newFiles = [...data.attachments];
            newFiles.splice(index, 1);
            setData('attachments', newFiles);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AppLayout title="FAQ Management">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">
                    {language === 'id' ? 'Manajemen FAQ' : 'FAQ Management'}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {language === 'id' ? 'Kelola pertanyaan yang sering diajukan.' : 'Manage frequently asked questions.'}
                </p>
            </div>

            {/* Create Form */}
            <Card className="mb-6">
                <div className="p-5 border-b border-neutral-100">
                    <h2 className="text-lg font-semibold text-neutral-900">{language === 'id' ? 'Tambah FAQ' : 'Add FAQ'}</h2>
                </div>
                <form onSubmit={submitCreate} className="p-5 space-y-4">
                    <Input id="question" label={language === 'id' ? 'Pertanyaan' : 'Question'} value={data.question} onChange={(e) => setData('question', e.target.value)} error={errors.question} required />
                    
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">{language === 'id' ? 'Jawaban' : 'Answer'}</label>
                        <textarea value={data.answer} onChange={(e) => setData('answer', e.target.value)} required rows={4} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                        {errors.answer && <p className="text-sm text-rose-500 mt-1">{errors.answer}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                            id="category" 
                            label={language === 'id' ? 'Kategori' : 'Category'} 
                            placeholder={language === 'id' ? 'Contoh: Umum, Akun, Jaringan' : 'Example: General, Account, Network'}
                            value={data.category} 
                            onChange={(e) => setData('category', e.target.value)} 
                            required 
                        />
                        <Input 
                            id="sort_order" 
                            label={language === 'id' ? 'Urutan Sortir' : 'Sort Order'} 
                            type="number" 
                            value={data.sort_order} 
                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {language === 'id' ? 'Lampiran File' : 'File Attachments'}
                        </label>
                        <div className="mt-1 relative flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md hover:bg-neutral-50 transition-colors">
                            <label htmlFor="file-upload" className="absolute inset-0 w-full h-full cursor-pointer z-10"></label>
                            <div className="space-y-1 text-center relative z-0">
                                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UploadCloud className="h-8 w-8" />
                                </div>
                                <div className="flex text-sm text-neutral-600 justify-center">
                                    <span className="font-medium text-primary-600">{language === 'id' ? 'Unggah file' : 'Upload a file'}</span>
                                    <input id="file-upload" type="file" multiple className="sr-only" onChange={(e) => handleFileChange(e)} />
                                    <p className="pl-1">{language === 'id' ? 'atau seret dan lepas' : 'or drag and drop'}</p>
                                </div>
                                <p className="text-xs text-neutral-500">
                                    {language === 'id' ? 'Maksimal ukuran 100MB per file' : 'Maximum size 100MB per file'}
                                </p>
                            </div>
                        </div>
                        {errors.attachments && <p className="text-sm text-rose-500 mt-1">{errors.attachments}</p>}

                        {/* File Previews */}
                        {data.attachments.length > 0 && (
                            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {data.attachments.map((file, idx) => (
                                    <li key={idx} className="col-span-1 flex flex-col rounded-md shadow-sm border border-neutral-200 bg-white">
                                        {file.type.startsWith('image/') ? (
                                            <div className="h-32 w-full border-b border-neutral-200 overflow-hidden bg-neutral-100 rounded-t-md relative">
                                                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="h-32 w-full border-b border-neutral-200 bg-neutral-50 flex items-center justify-center rounded-t-md">
                                                <FileText className="h-10 w-10 text-neutral-400" />
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between p-3">
                                            <div className="flex-1 truncate text-sm">
                                                <p className="font-medium text-neutral-900 truncate" title={file.name}>{file.name}</p>
                                                <p className="text-neutral-500">{formatBytes(file.size)}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                <button type="button" onClick={() => removeFile(idx)} className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-rose-50 hover:text-rose-500 focus:outline-none transition-colors">
                                                    <span className="sr-only">Remove</span>
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-neutral-100">
                        <Button type="submit" loading={processing}><Plus className="h-4 w-4 mr-2" /> {language === 'id' ? 'Tambah' : 'Add FAQ'}</Button>
                    </div>
                </form>
            </Card>

            {/* FAQ List */}
            <Card>
                <div className="p-5 border-b border-neutral-100">
                    <h2 className="text-lg font-semibold text-neutral-900">{language === 'id' ? 'Daftar FAQ' : 'FAQ List'} ({faqs.length})</h2>
                </div>
                <div className="divide-y divide-neutral-100">
                    {faqs.length > 0 ? faqs.map((faq) => (
                        <div key={faq.id} className="px-5 py-4 hover:bg-neutral-50 transition-colors">
                            {editingId === faq.id ? (
                                <form onSubmit={submitEdit} className="space-y-4">
                                    <Input label={language === 'id' ? 'Pertanyaan' : 'Question'} value={editData.question} onChange={(e) => setEditData('question', e.target.value)} required />
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">{language === 'id' ? 'Jawaban' : 'Answer'}</label>
                                        <textarea value={editData.answer} onChange={(e) => setEditData('answer', e.target.value)} required rows={4} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input 
                                            label={language === 'id' ? 'Kategori' : 'Category'} 
                                            placeholder={language === 'id' ? 'Contoh: Umum, Akun, Jaringan' : 'Example: General, Account, Network'}
                                            value={editData.category} 
                                            onChange={(e) => setEditData('category', e.target.value)} 
                                            required 
                                        />
                                        <Input 
                                            label={language === 'id' ? 'Urutan Sortir' : 'Sort Order'} 
                                            type="number" 
                                            value={editData.sort_order} 
                                            onChange={(e) => setEditData('sort_order', parseInt(e.target.value) || 0)} 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            {language === 'id' ? 'Lampiran File' : 'File Attachments'}
                                        </label>
                                        
                                        {/* Existing Attachments */}
                                        {faq.attachments && faq.attachments.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2">{language === 'id' ? 'File Saat Ini' : 'Current Files'}</p>
                                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {faq.attachments.map(att => (
                                                        <li key={att.id} className="col-span-1 flex flex-col rounded-md shadow-sm border border-neutral-200 bg-white">
                                                            {att.file_type.startsWith('image/') ? (
                                                                <div className="h-32 w-full border-b border-neutral-200 overflow-hidden bg-neutral-100 rounded-t-md relative">
                                                                    <img src={att.url} alt={att.file_name} className="w-full h-full object-contain" />
                                                                </div>
                                                            ) : (
                                                                <div className="h-32 w-full border-b border-neutral-200 bg-neutral-50 flex items-center justify-center rounded-t-md">
                                                                    <FileText className="h-10 w-10 text-neutral-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between p-3">
                                                                <div className="flex-1 truncate text-sm">
                                                                    <p className="font-medium text-neutral-900 truncate" title={att.file_name}>{att.file_name}</p>
                                                                    <p className="text-neutral-500">{formatBytes(att.file_size)}</p>
                                                                </div>
                                                                <div className="flex-shrink-0 ml-2 flex gap-2">
                                                                    <a href={att.url} download={att.file_name} className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:outline-none transition-colors" title={language === 'id' ? 'Unduh' : 'Download'}>
                                                                        <Download className="h-4 w-4" />
                                                                    </a>
                                                                    <a href={att.url} target="_blank" rel="noreferrer" className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:outline-none transition-colors" title={language === 'id' ? 'Lihat' : 'View'}>
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </a>
                                                                    <button type="button" onClick={() => setDeleteAttachmentTarget(att)} className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-rose-50 hover:text-rose-500 focus:outline-none transition-colors" title={language === 'id' ? 'Hapus' : 'Delete'}>
                                                                        <span className="sr-only">Remove</span>
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Upload New Attachments */}
                                        <div className="mt-2 relative flex justify-center px-6 pt-4 pb-4 border-2 border-neutral-300 border-dashed rounded-md hover:bg-neutral-50 transition-colors">
                                            <label htmlFor={`file-upload-${faq.id}`} className="absolute inset-0 w-full h-full cursor-pointer z-10"></label>
                                            <div className="space-y-1 text-center relative z-0">
                                                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <UploadCloud className="h-6 w-6" />
                                                </div>
                                                <div className="flex text-sm text-neutral-600 justify-center">
                                                    <span className="font-medium text-primary-600">{language === 'id' ? 'Unggah file baru' : 'Upload new files'}</span>
                                                    <input id={`file-upload-${faq.id}`} type="file" multiple className="sr-only" onChange={(e) => handleFileChange(e, true)} />
                                                </div>
                                                <p className="text-xs text-neutral-500">
                                                    {language === 'id' ? 'Maksimal ukuran 100MB per file' : 'Maximum size 100MB per file'}
                                                </p>
                                            </div>
                                        </div>

                                        {editErrors.attachments && <p className="text-sm text-rose-500 mt-1">{editErrors.attachments}</p>}

                                        {/* New Attachments Preview for Edit */}
                                        {editData.attachments && editData.attachments.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2">{language === 'id' ? 'File Baru' : 'New Files'}</p>
                                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {editData.attachments.map((file, idx) => (
                                                        <li key={idx} className="col-span-1 flex flex-col rounded-md shadow-sm border border-neutral-200 bg-white">
                                                            {file.type.startsWith('image/') ? (
                                                                <div className="h-32 w-full border-b border-neutral-200 overflow-hidden bg-neutral-100 rounded-t-md relative">
                                                                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-contain" />
                                                                </div>
                                                            ) : (
                                                                <div className="h-32 w-full border-b border-neutral-200 bg-neutral-50 flex items-center justify-center rounded-t-md">
                                                                    <FileText className="h-10 w-10 text-neutral-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between p-3">
                                                                <div className="flex-1 truncate text-sm">
                                                                    <p className="font-medium text-neutral-900 truncate" title={file.name}>{file.name}</p>
                                                                    <p className="text-neutral-500">{formatBytes(file.size)}</p>
                                                                </div>
                                                                <div className="flex-shrink-0 ml-2">
                                                                    <button type="button" onClick={() => removeFile(idx, true)} className="inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-rose-50 hover:text-rose-500 focus:outline-none transition-colors">
                                                                        <span className="sr-only">Remove</span>
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2 border-t border-neutral-100">
                                        <Button variant="outline" type="button" onClick={() => setEditingId(null)}>{language === 'id' ? 'Batal' : 'Cancel'}</Button>
                                        <Button type="submit" loading={editProcessing}>{language === 'id' ? 'Simpan' : 'Save'}</Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-neutral-900">{faq.question}</p>
                                        <div className="text-sm text-neutral-600 mt-2 whitespace-pre-wrap">{faq.answer}</div>
                                        
                                        {faq.attachments && faq.attachments.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {faq.attachments.map(att => (
                                                    <a key={att.id} href={att.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                                                        <Paperclip className="h-3.5 w-3.5 text-neutral-400" />
                                                        <span className="truncate max-w-[150px]">{att.file_name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-3">
                                            <Badge className="bg-primary-50 text-primary-700 text-[10px] uppercase tracking-wider">{faq.category}</Badge>
                                            {faq.is_active
                                                ? <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Active</Badge>
                                                : <Badge className="bg-neutral-100 text-neutral-500 text-[10px]">Disabled</Badge>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button onClick={() => startEdit(faq)} className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600" title="Edit"><Pencil className="h-4 w-4" /></button>
                                        <button onClick={() => toggleFaq(faq.id)} className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600" title={faq.is_active ? 'Disable' : 'Enable'}>
                                            {faq.is_active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => setDeleteTarget(faq)} className="p-1.5 rounded-md hover:bg-rose-50 text-neutral-400 hover:text-rose-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="py-12 text-center">
                            <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                            <p className="text-sm text-neutral-500">{language === 'id' ? 'Belum ada FAQ.' : 'No FAQs yet.'}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Delete FAQ Confirmation Modal */}
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
                                            {language === 'id' ? 'Hapus FAQ' : 'Delete FAQ'}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            {language === 'id'
                                                ? 'Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan.'
                                                : 'Are you sure you want to delete this FAQ? This action cannot be undone.'}
                                        </Dialog.Description>
                                    </div>
                                    <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
                                            >
                                                {language === 'id' ? 'Batal' : 'Cancel'}
                                            </motion.button>
                                        </Dialog.Close>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={executeDeleteFaq}
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

            {/* Delete Attachment Confirmation Modal */}
            <Dialog.Root open={!!deleteAttachmentTarget} onOpenChange={(open) => { if (!open) setDeleteAttachmentTarget(null); }}>
                <AnimatePresence>
                    {deleteAttachmentTarget && (
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
                                            {language === 'id' ? 'Hapus Lampiran' : 'Delete Attachment'}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            {language === 'id'
                                                ? `Apakah Anda yakin ingin menghapus "${deleteAttachmentTarget?.file_name}"? Tindakan ini tidak dapat dibatalkan.`
                                                : `Are you sure you want to delete "${deleteAttachmentTarget?.file_name}"? This action cannot be undone.`}
                                        </Dialog.Description>
                                    </div>
                                    <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
                                            >
                                                {language === 'id' ? 'Batal' : 'Cancel'}
                                            </motion.button>
                                        </Dialog.Close>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={executeDeleteAttachment}
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
