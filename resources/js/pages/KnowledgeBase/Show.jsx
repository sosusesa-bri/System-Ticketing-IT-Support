import { Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/ui/Card';
import { ChevronRight, Eye, Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function KnowledgeBaseShow({ article, related }) {
    const { language } = useLanguage();

    const title = language === 'id' ? article.title_id : article.title_en;
    const content = language === 'id' ? article.content_id : article.content_en;

    return (
        <AppLayout title={title}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/knowledge-base" className="hover:text-primary-700">
                    {language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium truncate max-w-[300px]">{title}</span>
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
                        {article.category && (
                            <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-md mb-4">
                                {article.category}
                            </span>
                        )}
                        <h1 className="text-2xl font-bold text-neutral-900 mb-4">{title}</h1>
                        
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
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </Card>

                    <div className="mt-6">
                        <Link
                            href="/knowledge-base"
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {language === 'id' ? 'Kembali ke Basis Pengetahuan' : 'Back to Knowledge Base'}
                        </Link>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Article meta */}
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
                                <span className="text-neutral-500">{language === 'id' ? 'Ditulis oleh' : 'Written by'}</span>
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
                        </div>
                    </Card>

                    {/* Related articles */}
                    {related.length > 0 && (
                        <Card>
                            <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                                {language === 'id' ? 'Artikel Terkait' : 'Related Articles'}
                            </h3>
                            <div className="space-y-3">
                                {related.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/knowledge-base/${rel.id}`}
                                        className="block group"
                                    >
                                        <p className="text-sm font-medium text-neutral-700 group-hover:text-primary-700 transition-colors line-clamp-2">
                                            {language === 'id' ? rel.title_id : rel.title_en}
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">{rel.created_at}</p>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
