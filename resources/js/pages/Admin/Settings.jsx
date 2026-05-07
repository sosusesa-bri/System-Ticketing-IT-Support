import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Settings as SettingsIcon, Tag, Plus, Check, X, MessageSquareText } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function Settings({ categories, macros = [] }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('categories');

    const { data: catData, setData: setCatData, post: postCat, processing: processingCat, errors: errorsCat, reset: resetCat } = useForm({
        name: '',
        description: '',
    });

    const { data: macData, setData: setMacData, post: postMac, processing: processingMac, errors: errorsMac, reset: resetMac } = useForm({
        title: '',
        body: '',
    });

    const submitCategory = (e) => {
        e.preventDefault();
        postCat('/admin/settings/categories', {
            onSuccess: () => resetCat(),
        });
    };

    const toggleCategory = (categoryId) => {
        router.put(`/admin/settings/categories/${categoryId}/toggle`, {}, { preserveScroll: true });
    };

    const submitMacro = (e) => {
        e.preventDefault();
        postMac('/admin/settings/macros', {
            onSuccess: () => resetMac(),
        });
    };

    const toggleMacro = (macroId) => {
        router.put(`/admin/settings/macros/${macroId}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout title="System Settings">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-900">{t('settings')}</h1>
                <p className="text-sm text-neutral-500 mt-1">{t('settingsDesc')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left col: Navigation/Sidebar for settings */}
                <div className="col-span-1">
                    <Card className="overflow-hidden">
                        <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-100 flex items-center gap-2">
                            <SettingsIcon className="h-5 w-5 text-neutral-500" />
                            <h2 className="font-semibold text-neutral-800">{t('configuration')}</h2>
                        </div>
                        <div className="p-2 flex flex-col space-y-1">
                            <button 
                                onClick={() => setActiveTab('categories')}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'categories' ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                            >
                                <Tag className="h-4 w-4" />
                                Ticket Categories
                            </button>
                            <button 
                                onClick={() => setActiveTab('macros')}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'macros' ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                            >
                                <MessageSquareText className="h-4 w-4" />
                                Canned Responses
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right col: Content */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    
                    {activeTab === 'categories' && (
                        <>
                            {/* Add Category Form */}
                            <Card>
                                <div className="p-5 border-b border-neutral-100">
                                    <h2 className="text-lg font-semibold text-neutral-900">{t('addCategory')}</h2>
                                    <p className="text-sm text-neutral-500 mt-1">{t('addCategoryDesc')}</p>
                                </div>
                                <form onSubmit={submitCategory} className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            id="name"
                                            label={t('categoryName')}
                                            value={catData.name}
                                            onChange={(e) => setCatData('name', e.target.value)}
                                            error={errorsCat.name}
                                            required
                                            placeholder="e.g. Hardware Issue"
                                        />
                                        <Input
                                            id="description"
                                            label={t('categoryDesc')}
                                            value={catData.description}
                                            onChange={(e) => setCatData('description', e.target.value)}
                                            error={errorsCat.description}
                                            placeholder={t('briefDesc')}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" loading={processingCat}>
                                            <Plus className="h-4 w-4 mr-2" /> Add Category
                                        </Button>
                                    </div>
                                </form>
                            </Card>

                            {/* Category List */}
                            <Card>
                                <div className="p-5 border-b border-neutral-100">
                                    <h2 className="text-lg font-semibold text-neutral-900">{t('manageCategories')}</h2>
                                    <p className="text-sm text-neutral-500 mt-1">{t('manageCategoriesDesc')}</p>
                                </div>
                                <div className="p-0">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('name')}</th>
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('description')}</th>
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('status')}</th>
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600 text-right">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.length > 0 ? categories.map((category) => (
                                                <tr key={category.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                                    <td className="py-3 px-5 text-sm font-medium text-neutral-900">{category.name}</td>
                                                    <td className="py-3 px-5 text-sm text-neutral-500">{category.description || '-'}</td>
                                                    <td className="py-3 px-5">
                                                        {category.is_active ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                                        ) : (
                                                            <Badge className="bg-neutral-100 text-neutral-600">Disabled</Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-5 text-right">
                                                        <button
                                                            onClick={() => toggleCategory(category.id)}
                                                            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center inline-flex ml-auto transition-colors ${
                                                                category.is_active 
                                                                    ? 'text-rose-700 bg-rose-50 hover:bg-rose-100' 
                                                                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                                            }`}
                                                        >
                                                            {category.is_active ? (
                                                                <><X className="h-3 w-3 mr-1" /> {t('disable')}</>
                                                            ) : (
                                                                <><Check className="h-3 w-3 mr-1" /> {t('enable')}</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="py-6 text-center text-sm text-neutral-500">
                                                        No categories found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </>
                    )}

                    {activeTab === 'macros' && (
                        <>
                            {/* Add Macro Form */}
                            <Card>
                                <div className="p-5 border-b border-neutral-100">
                                    <h2 className="text-lg font-semibold text-neutral-900">{t('addMacro')}</h2>
                                    <p className="text-sm text-neutral-500 mt-1">{t('addMacroDesc')}</p>
                                </div>
                                <form onSubmit={submitMacro} className="p-5 space-y-4">
                                    <Input
                                        id="title"
                                        label={t('templateTitle')}
                                        value={macData.title}
                                        onChange={(e) => setMacData('title', e.target.value)}
                                        error={errorsMac.title}
                                        required
                                        placeholder="e.g. Password Reset Instructions"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">{t('responseBody')}</label>
                                        <textarea
                                            value={macData.body}
                                            onChange={(e) => setMacData('body', e.target.value)}
                                            required
                                            rows={4}
                                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder={t('writeTemplate')}
                                        ></textarea>
                                        {errorsMac.body && <p className="text-sm text-rose-500 mt-1">{errorsMac.body}</p>}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" loading={processingMac}>
                                            <Plus className="h-4 w-4 mr-2" /> Add Template
                                        </Button>
                                    </div>
                                </form>
                            </Card>

                            {/* Macro List */}
                            <Card>
                                <div className="p-5 border-b border-neutral-100">
                                    <h2 className="text-lg font-semibold text-neutral-900">{t('manageMacros')}</h2>
                                    <p className="text-sm text-neutral-500 mt-1">{t('manageMacrosDesc')}</p>
                                </div>
                                <div className="p-0">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('title')}</th>
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">{t('status')}</th>
                                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600 text-right">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {macros.length > 0 ? macros.map((macro) => (
                                                <tr key={macro.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                                    <td className="py-3 px-5 text-sm font-medium text-neutral-900">{macro.title}</td>
                                                    <td className="py-3 px-5">
                                                        {macro.is_active ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                                                        ) : (
                                                            <Badge className="bg-neutral-100 text-neutral-600">Disabled</Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-5 text-right">
                                                        <button
                                                            onClick={() => toggleMacro(macro.id)}
                                                            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center inline-flex ml-auto transition-colors ${
                                                                macro.is_active 
                                                                    ? 'text-rose-700 bg-rose-50 hover:bg-rose-100' 
                                                                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                                            }`}
                                                        >
                                                            {macro.is_active ? (
                                                                <><X className="h-3 w-3 mr-1" /> {t('disable')}</>
                                                            ) : (
                                                                <><Check className="h-3 w-3 mr-1" /> {t('enable')}</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="py-6 text-center text-sm text-neutral-500">
                                                        No templates found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
