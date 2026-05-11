import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function AdminKnowledgeBaseCreate() {
    const { language } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        title_en: '',
        title_id: '',
        content_en: '',
        content_id: '',
        category: '',
        is_published: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/knowledge-base');
    };

    return (
        <AppLayout title={language === 'id' ? 'Buat Artikel' : 'Create Article'}>
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/knowledge-base" className="hover:text-primary-700">
                    {language === 'id' ? 'Basis Pengetahuan' : 'Knowledge Base'}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{language === 'id' ? 'Buat Artikel' : 'Create Article'}</span>
            </nav>

            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-primary-950 mb-1">
                    {language === 'id' ? 'Artikel Baru' : 'New Article'}
                </h1>
                <p className="text-sm text-neutral-500 mb-6">
                    {language === 'id' ? 'Tulis konten dalam Bahasa Inggris dan Indonesia.' : 'Write content in both English and Indonesian.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            {language === 'id' ? 'Konten Inggris' : 'English Content'}
                        </h2>
                        <div className="space-y-4">
                            <Input
                                id="title_en"
                                label={language === 'id' ? 'Judul (Inggris)' : 'Title (English)'}
                                value={data.title_en}
                                onChange={(e) => setData('title_en', e.target.value)}
                                error={errors.title_en}
                                required
                            />
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">
                                    {language === 'id' ? 'Konten (Inggris)' : 'Content (English)'}
                                </label>
                                <textarea
                                    value={data.content_en}
                                    onChange={(e) => setData('content_en', e.target.value)}
                                    className="w-full min-h-[200px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                    placeholder={language === 'id' ? 'Tulis konten artikel dalam Bahasa Inggris...' : 'Write article content in English...'}
                                    required
                                />
                                {errors.content_en && <p className="text-xs text-danger-600">{errors.content_en}</p>}
                                <p className="text-xs text-neutral-400">
                                    {language === 'id' ? 'HTML didukung untuk format teks.' : 'HTML is supported for text formatting.'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            {language === 'id' ? 'Konten Indonesia' : 'Indonesian Content'}
                        </h2>
                        <div className="space-y-4">
                            <Input
                                id="title_id"
                                label={language === 'id' ? 'Judul (Indonesia)' : 'Title (Indonesian)'}
                                value={data.title_id}
                                onChange={(e) => setData('title_id', e.target.value)}
                                error={errors.title_id}
                                required
                            />
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">
                                    {language === 'id' ? 'Konten (Indonesia)' : 'Content (Indonesian)'}
                                </label>
                                <textarea
                                    value={data.content_id}
                                    onChange={(e) => setData('content_id', e.target.value)}
                                    className="w-full min-h-[200px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                    placeholder={language === 'id' ? 'Tulis konten artikel dalam Bahasa Indonesia...' : 'Write article content in Indonesian...'}
                                    required
                                />
                                {errors.content_id && <p className="text-xs text-danger-600">{errors.content_id}</p>}
                            </div>
                        </div>
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
                                            {language === 'id' ? 'Publikasi langsung' : 'Publish immediately'}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {language === 'id' ? 'Artikel akan langsung terlihat oleh semua pengguna.' : 'Article will be visible to all users.'}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center gap-3">
                        <Button type="submit" loading={processing}>
                            {language === 'id' ? 'Buat Artikel' : 'Create Article'}
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
