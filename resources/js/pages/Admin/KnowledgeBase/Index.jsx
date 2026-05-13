import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../../layouts/AppLayout';
import Button from '../../../components/ui/Button';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, BookOpen, ChevronRight, FileText, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';

export default function AdminKnowledgeBaseIndex({ articles, filters }) {
    const { language } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/knowledge-base', { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(`/admin/knowledge-base/${deleteTarget.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AppLayout title={language === 'id' ? 'Kelola Basis Pengetahuan' : 'Manage Knowledge Base'}>
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">
                    {language === 'id' ? 'Dashboard' : 'Dashboard'}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}</span>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-950">{language === 'id' ? 'Kelola Artikel' : 'Manage Articles'}</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {language === 'id' ? 'Buat, edit, dan kelola artikel basis pengetahuan.' : 'Create, edit, and manage knowledge base articles.'}
                    </p>
                </div>
                <Link href="/admin/knowledge-base/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'id' ? 'Artikel Baru' : 'New Article'}
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={language === 'id' ? 'Cari artikel...' : 'Search articles...'}
                        className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                    />
                </div>
                <Button type="submit" variant="secondary"><Search className="h-4 w-4" /></Button>
            </form>

            {/* Articles table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden"
            >
                {articles.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-200">
                                    <th className="text-left px-6 py-3 font-medium text-neutral-500">{language === 'id' ? 'Judul' : 'Title'}</th>
                                    <th className="text-left px-6 py-3 font-medium text-neutral-500">{language === 'id' ? 'Kategori' : 'Category'}</th>
                                    <th className="text-center px-6 py-3 font-medium text-neutral-500">{language === 'id' ? 'Status' : 'Status'}</th>
                                    <th className="text-center px-6 py-3 font-medium text-neutral-500">{language === 'id' ? 'Dilihat' : 'Views'}</th>
                                    <th className="text-left px-6 py-3 font-medium text-neutral-500">{language === 'id' ? 'Penulis' : 'Author'}</th>
                                    <th className="text-right px-6 py-3 font-medium text-neutral-500">{language === 'id' ? 'Aksi' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {articles.data.map((article) => (
                                    <tr key={article.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/knowledge-base/${article.id}`} className="hover:text-primary-700 transition-colors">
                                                <p className="font-medium text-neutral-900 truncate max-w-[250px]">
                                                    {language === 'id' ? (article.title_id || article.title_en) : (article.title_en || article.title_id)}
                                                </p>
                                            </Link>
                                            <p className="text-xs text-neutral-400 mt-0.5">{article.created_at}</p>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600">{article.category || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                article.is_published
                                                    ? 'bg-success-50 text-success-700'
                                                    : 'bg-neutral-100 text-neutral-500'
                                            }`}>
                                                {article.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                                {article.is_published
                                                    ? (language === 'id' ? 'Publik' : 'Published')
                                                    : (language === 'id' ? 'Draf' : 'Draft')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-neutral-500">{article.views}</td>
                                        <td className="px-6 py-4 text-neutral-600">{article.author}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/knowledge-base/${article.id}`}
                                                    className="p-1.5 rounded-md hover:bg-primary-50 text-neutral-400 hover:text-primary-700 transition-colors"
                                                    title={language === 'id' ? 'Lihat' : 'View'}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/knowledge-base/${article.id}/edit`}
                                                    className="p-1.5 rounded-md hover:bg-primary-50 text-neutral-400 hover:text-primary-700 transition-colors"
                                                    title={language === 'id' ? 'Edit' : 'Edit'}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(article)}
                                                    className="p-1.5 rounded-md hover:bg-danger-50 text-neutral-400 hover:text-danger-600 transition-colors"
                                                    title={language === 'id' ? 'Hapus' : 'Delete'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-neutral-900">
                            {language === 'id' ? 'Belum ada artikel' : 'No articles yet'}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1 mb-4">
                            {language === 'id' ? 'Buat artikel pertama Anda.' : 'Create your first article.'}
                        </p>
                        <Link href="/admin/knowledge-base/create">
                            <Button><Plus className="h-4 w-4 mr-2" /> {language === 'id' ? 'Artikel Baru' : 'New Article'}</Button>
                        </Link>
                    </div>
                )}
            </motion.div>

            {/* Pagination */}
            {articles.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {articles.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                                link.active
                                    ? 'bg-primary-700 text-white'
                                    : link.url
                                        ? 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                        : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
                                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                                >
                                    <div className="px-6 pt-6 pb-5">
                                        <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mb-4">
                                            <AlertTriangle className="h-6 w-6 text-danger-600" strokeWidth={1.5} />
                                        </div>
                                        <Dialog.Title className="text-xl font-bold text-neutral-900 mb-2">
                                            {language === 'id' ? 'Hapus Artikel' : 'Delete Article'}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-neutral-500 leading-relaxed">
                                            {language === 'id'
                                                ? `Apakah Anda yakin ingin menghapus artikel "${deleteTarget?.title_id || deleteTarget?.title_en}"? Tindakan ini tidak dapat dibatalkan.`
                                                : `Are you sure you want to delete "${deleteTarget?.title_en || deleteTarget?.title_id}"? This action cannot be undone.`}
                                        </Dialog.Description>
                                    </div>
                                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors"
                                            >
                                                {language === 'id' ? 'Batal' : 'Cancel'}
                                            </motion.button>
                                        </Dialog.Close>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                                        >
                                            {isDeleting && (
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            )}
                                            {isDeleting
                                                ? (language === 'id' ? 'Menghapus...' : 'Deleting...')
                                                : (language === 'id' ? 'Hapus Artikel' : 'Delete Article')}
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
