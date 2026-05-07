import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../../layouts/AppLayout';
import Button from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Search, Users, ChevronLeft, ChevronRight, Shield, User } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function UserIndex({ users, filters }) {
    const { t, language } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key, value) => {
        router.get('/admin/users', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const handleRoleChange = (userId, newRole) => {
        if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            router.put(`/admin/users/${userId}/role`, { role: newRole });
        }
    };

    return (
        <AppLayout title="Users">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary-900">{t('userManagement')}</h1>
                <p className="text-sm text-neutral-500 mt-1">{t('manageUsersDesc')}</p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchUsers')} className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" />
                    </form>
                    <select value={filters.department || ''} onChange={(e) => applyFilter('department', e.target.value)} className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                        <option value="">{language === 'id' ? 'Semua Departemen' : 'All Departments'}</option>
                        <option value="Administrasi">Administrasi</option>
                        <option value="Akademik">Akademik</option>
                        <option value="Keuangan">Keuangan</option>
                        <option value="IT Department">IT Department</option>
                        <option value="Kemahasiswaan">Kemahasiswaan</option>
                        <option value="Perpustakaan">Perpustakaan</option>
                        <option value="Lainnya">{language === 'id' ? 'Lainnya' : 'Other'}</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {users.data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-neutral-50">
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('user')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('department')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('role')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('tickets')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('lastLogin')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('joined')}</th>
                                        <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-primary-700">{user.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-950">{user.name}</p>
                                                        <p className="text-xs text-neutral-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{user.department || '-'}</td>
                                            <td className="px-6 py-3">
                                                <Badge className={user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'}>
                                                    {user.role === 'admin' ? (
                                                        <><Shield className="h-3 w-3 mr-1" /> {t('admin')}</>
                                                    ) : (
                                                        <><User className="h-3 w-3 mr-1" /> {t('user')}</>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{user.tickets_count}</td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{user.last_login_at || t('never')}</td>
                                            <td className="px-6 py-3 text-sm text-neutral-500">{user.created_at}</td>
                                            <td className="px-6 py-3">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-700"
                                                >
                                                    <option value="user">{t('user')}</option>
                                                    <option value="admin">{t('admin')}</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200">
                                <p className="text-sm text-neutral-500">{t('showing')} {users.from}-{users.to} {t('of')} {users.total}</p>
                                <div className="flex items-center gap-1">
                                    {users.prev_page_url && <Link href={users.prev_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronLeft className="h-4 w-4 text-neutral-500" /></Link>}
                                    {users.next_page_url && <Link href={users.next_page_url} className="p-2 rounded-md hover:bg-neutral-50"><ChevronRight className="h-4 w-4 text-neutral-500" /></Link>}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Users className="h-10 w-10 text-neutral-300 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm text-neutral-500">{t('noUsersFound')}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
