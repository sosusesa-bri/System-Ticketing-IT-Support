import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, BookOpen, Eye, ChevronRight, Filter, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function KnowledgeBaseIndex({ articles, categories, filters }) {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/knowledge-base', { search, category: filters.category }, { preserveState: true });
    };

    const handleCategoryFilter = (category) => {
        router.get('/knowledge-base', { search: filters.search, category: category || undefined }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/knowledge-base', {}, { preserveState: true });
    };

    return (
        <AppLayout title={language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary-950 tracking-tight">
                    {language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {language === 'id'
                        ? 'Temukan solusi dan panduan untuk masalah umum IT.'
                        : 'Find solutions and guides for common IT issues.'}
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={language === 'id' ? 'Cari artikel...' : 'Search articles...'}
                            className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
                {(filters.search || filters.category) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 px-3"
                    >
                        <X className="h-4 w-4" />
                        {language === 'id' ? 'Hapus filter' : 'Clear filters'}
                    </button>
                )}
            </div>

            {/* Category pills */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => handleCategoryFilter(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            !filters.category
                                ? 'bg-primary-700 text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                    >
                        {language === 'id' ? 'Semua' : 'All'}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                filters.category === cat
                                    ? 'bg-primary-700 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Articles grid */}
            {articles.data.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {articles.data.map((article) => (
                        <Link
                            key={article.id}
                            href={`/knowledge-base/${article.id}`}
                            className="group"
                        >
                            <Card className="h-full hover:border-primary-200 hover:shadow-md transition-all duration-200">
                                <div className="flex flex-col h-full">
                                    {article.category && (
                                        <span className="inline-block self-start px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-md mb-3">
                                            {article.category}
                                        </span>
                                    )}
                                    <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors line-clamp-2 mb-2">
                                        {language === 'id' ? article.title_id : article.title_en}
                                    </h3>
                                    <p className="text-sm text-neutral-500 line-clamp-3 flex-1">
                                        {language === 'id' ? article.content_id : article.content_en}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-400">
                                        <span>{article.author} - {article.created_at}</span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" /> {article.views}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-4" strokeWidth={1.5} />
                    <h3 className="text-lg font-semibold text-neutral-900">
                        {language === 'id' ? 'Tidak ada artikel ditemukan' : 'No articles found'}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                        {language === 'id' ? 'Coba ubah kata kunci pencarian Anda.' : 'Try adjusting your search terms.'}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {articles.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-8">
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
        </AppLayout>
    );
}
