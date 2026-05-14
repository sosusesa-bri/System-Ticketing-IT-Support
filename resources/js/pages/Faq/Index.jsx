import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../../layouts/AppLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, HelpCircle, ChevronDown, Paperclip, ExternalLink, FileText, Download } from 'lucide-react';

export default function FaqIndex({ faqsByCategory }) {
    const { language, t } = useLanguage();
    const [openItems, setOpenItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const toggleItem = (id) => {
        setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const categories = Object.entries(faqsByCategory || {});

    const filteredCategories = categories.map(([cat, faqs]) => {
        const filtered = faqs.filter((faq) => {
            const q = searchQuery.toLowerCase();
            const question = faq.question || '';
            const answer = faq.answer || '';
            return question.toLowerCase().includes(q) || answer.toLowerCase().includes(q);
        });
        return [cat, filtered];
    }).filter(([, faqs]) => faqs.length > 0);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AppLayout title="FAQ">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-neutral-900">
                    {language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {language === 'id' ? 'Temukan jawaban cepat untuk pertanyaan umum.' : 'Find quick answers to common questions.'}
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                    type="text"
                    placeholder={language === 'id' ? 'Cari pertanyaan...' : 'Search questions...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
            </div>

            {filteredCategories.length > 0 ? (
                <div className="space-y-8">
                    {filteredCategories.map(([category, faqs]) => (
                        <div key={category}>
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4 capitalize flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary-600" />
                                {category}
                            </h2>
                            <div className="space-y-2">
                                {faqs.map((faq) => (
                                    <div key={faq.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => toggleItem(faq.id)}
                                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-neutral-900 pr-4">
                                                {faq.question}
                                            </span>
                                            <motion.div animate={{ rotate: openItems[faq.id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
                                            </motion.div>
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {openItems[faq.id] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-4 text-sm text-neutral-600 border-t border-neutral-100 pt-3 leading-relaxed whitespace-pre-line">
                                                        {faq.answer}
                                                        
                                                        {faq.attachments && faq.attachments.length > 0 && (
                                                            <div className="mt-4 pt-3 border-t border-neutral-100">
                                                                <p className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
                                                                    {language === 'id' ? 'Lampiran File' : 'Attachments'}
                                                                </p>
                                                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                    {faq.attachments.map(att => (
                                                                        <li key={att.id} className="col-span-1 flex flex-col rounded-md shadow-sm border border-neutral-200 bg-white hover:border-primary-300 transition-colors">
                                                                            {att.file_type.startsWith('image/') ? (
                                                                                <a href={att.url} target="_blank" rel="noreferrer" className="block h-32 w-full border-b border-neutral-200 overflow-hidden bg-neutral-100 rounded-t-md relative group">
                                                                                    <img src={att.url} alt={att.file_name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200" />
                                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                                                        <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                                                                    </div>
                                                                                </a>
                                                                            ) : (
                                                                                <a href={att.url} target="_blank" rel="noreferrer" className="block h-32 w-full border-b border-neutral-200 bg-neutral-50 flex items-center justify-center rounded-t-md group hover:bg-primary-50 transition-colors">
                                                                                    <FileText className="h-10 w-10 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                                                                                </a>
                                                                            )}
                                                                            <div className="flex items-center justify-between p-3">
                                                                                <a href={att.url} target="_blank" rel="noreferrer" className="flex-1 truncate text-sm block group">
                                                                                    <p className="font-medium text-neutral-900 group-hover:text-primary-600 truncate transition-colors" title={att.file_name}>{att.file_name}</p>
                                                                                    <p className="text-neutral-500">{formatBytes(att.file_size)}</p>
                                                                                </a>
                                                                                <div className="flex-shrink-0 ml-2">
                                                                                    <a href={att.url} download={att.file_name} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-primary-50 hover:text-primary-600 focus:outline-none transition-colors" title={language === 'id' ? 'Unduh File' : 'Download File'}>
                                                                                        <Download className="h-4 w-4" />
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <HelpCircle className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500">
                        {searchQuery
                            ? (language === 'id' ? 'Tidak ada hasil yang cocok.' : 'No matching results found.')
                            : (language === 'id' ? 'Belum ada FAQ yang tersedia.' : 'No FAQs available yet.')}
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
