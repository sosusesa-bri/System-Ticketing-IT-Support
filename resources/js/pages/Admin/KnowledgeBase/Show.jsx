import { Link } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import { ChevronRight, Eye, Calendar, User, ArrowLeft, Edit, FileText, File as FileIcon, Download, Paperclip } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function AdminKnowledgeBaseShow({ article }) {
    const { language } = useLanguage();

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 KB';
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    return (
        <AppLayout title={language === 'id' ? 'Detail Artikel' : 'Article Detail'}>
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/knowledge-base" className="hover:text-primary-700">
                    {language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium truncate max-w-[300px]">{article.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-8"
                >
                    <Card>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {article.category && (
                                    <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-md">
                                        {article.category}
                                    </span>
                                )}
                                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md ${
                                    article.is_published
                                        ? 'bg-success-50 text-success-700'
                                        : 'bg-neutral-100 text-neutral-500'
                                }`}>
                                    {article.is_published
                                        ? (language === 'id' ? 'Publik' : 'Published')
                                        : (language === 'id' ? 'Draf' : 'Draft')}
                                </span>
                            </div>
                            <Link
                                href={`/admin/knowledge-base/${article.id}/edit`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                            >
                                <Edit className="h-3.5 w-3.5" />
                                {language === 'id' ? 'Edit' : 'Edit'}
                            </Link>
                        </div>

                        <h1 className="text-2xl font-bold text-neutral-900 mb-4">{article.title}</h1>

                        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-6 pb-4 border-b border-neutral-100">
                            <span className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" /> {article.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" /> {article.created_at}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5" /> {article.views} {language === 'id' ? 'dilihat' : 'views'}
                            </span>
                        </div>

                        <div
                            className="prose prose-sm prose-neutral max-w-none
                                prose-headings:text-neutral-900 prose-headings:font-semibold
                                prose-p:text-neutral-700 prose-p:leading-relaxed
                                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-neutral-900
                                prose-ul:text-neutral-700 prose-ol:text-neutral-700
                                prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                prose-pre:bg-neutral-900 prose-pre:text-neutral-100"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </Card>

                    {/* Attachments */}
                    {article.attachments?.length > 0 && (
                        <Card className="mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Paperclip className="h-5 w-5 text-neutral-500" />
                                <h3 className="text-sm font-semibold text-neutral-900">
                                    {language === 'id' ? `Lampiran (${article.attachments.length})` : `Attachments (${article.attachments.length})`}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {article.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
                                    >
                                        <div className="h-10 w-10 shrink-0 bg-white rounded-lg flex items-center justify-center border border-neutral-200">
                                            {attachment.mime_type?.startsWith('image/') ? (
                                                <img src={attachment.url} alt="" className="h-full w-full object-cover rounded-lg" />
                                            ) : attachment.mime_type?.includes('pdf') ? (
                                                <FileText className="h-5 w-5 text-danger-500" />
                                            ) : (
                                                <FileIcon className="h-5 w-5 text-neutral-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-primary-700">{attachment.original_name}</p>
                                            <p className="text-xs text-neutral-500">{formatFileSize(attachment.file_size)}</p>
                                        </div>
                                        <Download className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </Card>
                    )}

                    <div className="mt-6">
                        <Link
                            href="/admin/knowledge-base"
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {language === 'id' ? 'Kembali ke Daftar Artikel' : 'Back to Articles'}
                        </Link>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                            {language === 'id' ? 'Info Artikel' : 'Article Info'}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">{language === 'id' ? 'Kategori' : 'Category'}</span>
                                <span className="font-medium text-neutral-900">{article.category || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">{language === 'id' ? 'Penulis' : 'Author'}</span>
                                <span className="font-medium text-neutral-900">{article.author}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">{language === 'id' ? 'Dibuat' : 'Created'}</span>
                                <span className="font-medium text-neutral-900">{article.created_at}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">{language === 'id' ? 'Diperbarui' : 'Updated'}</span>
                                <span className="font-medium text-neutral-900">{article.updated_at}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">{language === 'id' ? 'Status' : 'Status'}</span>
                                <span className={`font-medium ${article.is_published ? 'text-success-700' : 'text-neutral-500'}`}>
                                    {article.is_published ? (language === 'id' ? 'Publik' : 'Published') : (language === 'id' ? 'Draf' : 'Draft')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">{language === 'id' ? 'Dilihat' : 'Views'}</span>
                                <span className="font-medium text-neutral-900">{article.views}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
