import { useState, useRef, useCallback } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { ChevronRight, UploadCloud, FileText, File as FileIcon, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AdminKnowledgeBaseEdit({ article }) {
    const { language } = useLanguage();
    const { data, setData, processing, errors } = useForm({
        title: article.title || '',
        content: article.content || '',
        category: article.category || '',
        is_published: article.is_published ?? true,
        attachments: [],
        remove_attachments: [],
    });

    const [existingAttachments, setExistingAttachments] = useState(article.attachments || []);
    const [previews, setPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Allowed MIME types & extensions
    const ALLOWED_MIME_TYPES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip', 'application/x-zip-compressed',
        'text/csv', 'text/plain', 'text/markdown',
    ];
    const ALLOWED_EXTENSIONS = ['jpg','jpeg','png','gif','webp','pdf','doc','docx','xls','xlsx','ppt','pptx','zip','csv','txt','md'];
    const FILE_ACCEPT = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,.txt,.md,image/*,application/pdf';

    const handleFiles = (files) => {
        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(f => {
            if (f.size > 100 * 1024 * 1024) return false;
            const ext = f.name.split('.').pop()?.toLowerCase();
            return ALLOWED_MIME_TYPES.includes(f.type) || ALLOWED_EXTENSIONS.includes(ext);
        });

        const updatedAttachments = [...data.attachments, ...validFiles];
        setData('attachments', updatedAttachments);

        const newPreviews = validFiles.map(file => {
            const isImage = file.type.startsWith('image/');
            return {
                file,
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type,
                url: isImage ? URL.createObjectURL(file) : null,
            };
        });
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewFile = (index) => {
        const newAttachments = [...data.attachments];
        newAttachments.splice(index, 1);
        setData('attachments', newAttachments);

        const newPreviews = [...previews];
        if (newPreviews[index]?.url) URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const removeExistingAttachment = (attachmentId) => {
        setExistingAttachments(prev => prev.filter(a => a.id !== attachmentId));
        setData('remove_attachments', [...data.remove_attachments, attachmentId]);
    };

    const onDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
    const onDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
    }, [data.attachments, previews]);

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 KB';
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/admin/knowledge-base/${article.id}`, {
            _method: 'PUT',
            title: data.title,
            content: data.content,
            category: data.category,
            is_published: data.is_published,
            attachments: data.attachments,
            remove_attachments: data.remove_attachments,
        }, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title={language === 'id' ? 'Edit Artikel' : 'Edit Article'}>
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/knowledge-base" className="hover:text-primary-700">
                    {language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{language === 'id' ? 'Edit' : 'Edit'}</span>
            </nav>

            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-primary-950 mb-1">
                    {language === 'id' ? 'Edit Artikel' : 'Edit Article'}
                </h1>
                <p className="text-sm text-neutral-500 mb-6">
                    {language === 'id' ? 'Perbarui konten artikel ini.' : 'Update the article content.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            {language === 'id' ? 'Konten Artikel' : 'Article Content'}
                        </h2>
                        <div className="space-y-4">
                            <Input
                                id="title"
                                label={language === 'id' ? 'Judul' : 'Title'}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                required
                            />
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">
                                    {language === 'id' ? 'Konten' : 'Content'}
                                </label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="w-full min-h-[200px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                    required
                                />
                                {errors.content && <p className="text-xs text-danger-600">{errors.content}</p>}
                            </div>
                        </div>
                    </Card>

                    {/* Attachments */}
                    <Card>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            {language === 'id' ? 'Lampiran' : 'Attachments'}
                        </h2>

                        {/* Existing attachments */}
                        {existingAttachments.length > 0 && (
                            <div className="mb-4 space-y-2">
                                <h4 className="text-sm font-medium text-neutral-700">
                                    {language === 'id' ? 'File yang sudah ada' : 'Existing Files'}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {existingAttachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg shadow-sm">
                                            <div className="h-10 w-10 shrink-0 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-200">
                                                {attachment.mime_type?.startsWith('image/') ? (
                                                    <img src={attachment.url} alt="preview" className="h-full w-full object-cover" />
                                                ) : attachment.mime_type?.includes('pdf') ? (
                                                    <FileText className="h-5 w-5 text-danger-500" />
                                                ) : (
                                                    <FileIcon className="h-5 w-5 text-neutral-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{attachment.original_name}</p>
                                                <p className="text-xs text-neutral-500">{formatFileSize(attachment.file_size)}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingAttachment(attachment.id)}
                                                className="p-1.5 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                                                title={language === 'id' ? 'Hapus file' : 'Remove file'}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload new files */}
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'}`}
                        >
                            <input
                                type="file"
                                multiple
                                accept={FILE_ACCEPT}
                                ref={fileInputRef}
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UploadCloud className="h-7 w-7" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900 mb-1">
                                {language === 'id' ? 'Seret & lepas file di sini atau' : 'Drag & drop files here or'}{' '}
                                <span className="text-primary-600">{language === 'id' ? 'telusuri file' : 'browse files'}</span>
                            </p>
                            <p className="text-xs text-neutral-500">
                                {language === 'id' ? 'Maks. 100MB per file. Mendukung gambar, PDF, Office, ZIP.' : 'Max 100MB per file. Supports images, PDF, Office, ZIP.'}
                            </p>
                        </div>
                        {errors['attachments.0'] && <p className="text-sm text-danger-600 mt-2">{errors['attachments.0']}</p>}

                        {/* New file previews */}
                        {previews.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium text-neutral-700">
                                    {language === 'id' ? `File baru (${previews.length})` : `New Files (${previews.length})`}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {previews.map((preview, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg shadow-sm group hover:border-primary-300 transition-colors">
                                            <div className="h-10 w-10 shrink-0 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-200">
                                                {preview.url ? (
                                                    <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
                                                ) : preview.type?.includes('pdf') ? (
                                                    <FileText className="h-5 w-5 text-danger-500" />
                                                ) : (
                                                    <FileIcon className="h-5 w-5 text-neutral-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{preview.name}</p>
                                                <p className="text-xs text-neutral-500">{preview.size}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeNewFile(idx); }}
                                                className="p-1.5 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            {language === 'id' ? 'Pengaturan' : 'Settings'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="category"
                                label={language === 'id' ? 'Kategori' : 'Category'}
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                error={errors.category}
                                placeholder={language === 'id' ? 'cth: Jaringan, Perangkat Keras' : 'e.g. Network, Hardware'}
                            />
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">
                                    {language === 'id' ? 'Visibilitas' : 'Visibility'}
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {language === 'id' ? 'Publikasi' : 'Published'}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {language === 'id' ? 'Artikel terlihat oleh semua pengguna.' : 'Article visible to all users.'}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center gap-3">
                        <Button type="submit" loading={processing}>
                            {language === 'id' ? 'Simpan Perubahan' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/knowledge-base">
                            <Button variant="secondary" type="button">
                                {language === 'id' ? 'Batal' : 'Cancel'}
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
