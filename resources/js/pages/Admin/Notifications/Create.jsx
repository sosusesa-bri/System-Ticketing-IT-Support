import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Bell, Users, Send } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function NotificationCreate({ users }) {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        target_department: '',
        target_users: [],
    });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lower = searchTerm.toLowerCase();
        return users.filter(u => u.name.toLowerCase().includes(lower) || u.department?.toLowerCase().includes(lower));
    }, [users, searchTerm]);

    const handleUserToggle = (userId) => {
        const newTargetUsers = data.target_users.includes(userId)
            ? data.target_users.filter(id => id !== userId)
            : [...data.target_users, userId];
        setData('target_users', newTargetUsers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/notifications/broadcast', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout title={t('broadcastNotification')}>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-900">{t('broadcastNotification')}</h1>
                        <p className="text-sm text-neutral-500 mt-1">{t('broadcastDesc')}</p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-100 pb-2">{t('messageContent')}</h2>
                            
                            <Input
                                id="title"
                                label={t('notificationTitle')}
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder={t('egMaintenance')}
                                required
                            />

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('messageLabel')}</label>
                                <textarea
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full min-h-[100px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                    placeholder={t('enterDetails')}
                                    required
                                />
                                {errors.message && <p className="text-xs text-danger-600">{errors.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-neutral-700">{t('typeLabel')}</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                >
                                    <option value="info">{t('infoBlue')}</option>
                                    <option value="success">{t('successGreen')}</option>
                                    <option value="warning">{t('warningYellow')}</option>
                                    <option value="error">{t('errorRed')}</option>
                                </select>
                                {errors.type && <p className="text-xs text-danger-600">{errors.type}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-base font-semibold text-neutral-900 border-b border-neutral-100 pb-2">{t('targetAudience')}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${data.target === 'all' ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                    <input type="radio" name="target" value="all" checked={data.target === 'all'} onChange={e => setData('target', e.target.value)} className="text-primary-600 focus:ring-primary-600" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">{t('allUsers')}</p>
                                        <p className="text-xs text-neutral-500">{t('everyoneInSystem')}</p>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${data.target === 'department' ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                    <input type="radio" name="target" value="department" checked={data.target === 'department'} onChange={e => setData('target', e.target.value)} className="text-primary-600 focus:ring-primary-600" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">{t('byDepartment')}</p>
                                        <p className="text-xs text-neutral-500">{t('specificDepartment')}</p>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${data.target === 'user' ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                    <input type="radio" name="target" value="user" checked={data.target === 'user'} onChange={e => setData('target', e.target.value)} className="text-primary-600 focus:ring-primary-600" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">{t('specificUsers')}</p>
                                        <p className="text-xs text-neutral-500">{t('selectIndividuals')}</p>
                                    </div>
                                </label>
                            </div>

                            {data.target === 'department' && (
                                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t('selectDepartment')}</label>
                                    <select
                                        value={data.target_department}
                                        onChange={e => setData('target_department', e.target.value)}
                                        className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="">{t('selectADepartment')}</option>
                                        <option value="Administrasi">Administrasi</option>
                                        <option value="Akademik">Akademik</option>
                                        <option value="Keuangan">Keuangan</option>
                                        <option value="IT Department">IT Department</option>
                                        <option value="Kemahasiswaan">Kemahasiswaan</option>
                                        <option value="Perpustakaan">Perpustakaan</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.target_department && <p className="text-xs text-danger-600 mt-1">{errors.target_department}</p>}
                                </div>
                            )}

                            {data.target === 'user' && (
                                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <Input
                                        placeholder={t('searchUsersDot')}
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <div className="mt-3 max-h-60 overflow-y-auto bg-white border border-neutral-200 rounded-md divide-y divide-neutral-100">
                                        {filteredUsers.map(u => (
                                            <label key={u.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.target_users.includes(u.id)}
                                                    onChange={() => handleUserToggle(u.id)}
                                                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-900">{u.name} <span className="text-xs font-normal text-neutral-400">({u.role})</span></p>
                                                    {u.department && <p className="text-xs text-neutral-500">{u.department}</p>}
                                                </div>
                                            </label>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <div className="p-4 text-center text-sm text-neutral-500">{t('noUsersFound')}</div>
                                        )}
                                    </div>
                                    {errors.target_users && <p className="text-xs text-danger-600 mt-1">{errors.target_users}</p>}
                                    <div className="mt-2 text-xs text-neutral-500 text-right">
                                        {data.target_users.length} {t('usersSelected')}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-neutral-200 flex justify-end">
                            <Button type="submit" loading={processing} disabled={processing}>
                                <Send className="h-4 w-4 mr-2" />
                                {t('sendBroadcast')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
