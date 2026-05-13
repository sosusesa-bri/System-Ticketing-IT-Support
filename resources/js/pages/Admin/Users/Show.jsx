import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Briefcase, CalendarClock, Shield,
    Activity, Clock, UserCircle, ChevronLeft, Ticket,
    Lock, AlertTriangle, Trash2, CheckCircle2, X, MessageSquare, Settings
} from 'lucide-react';
import { actionLabels, getActionColor } from '../../../utils/audit';

// ─── Small helper sub-components ────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <span className="flex items-center gap-2 text-sm text-neutral-500">
                <Icon className="h-4 w-4 text-neutral-400" />
                {label}
            </span>
            <span className="text-sm font-medium text-neutral-900 text-right max-w-[60%] truncate">{value}</span>
        </div>
    );
}

function SuccessAlert({ msg }) {
    if (!msg) return null;
    return (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 mb-4">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {msg}
        </div>
    );
}

// ─── Delete confirmation dialog ──────────────────────────────────────────────

function DeleteUserDialog({ user, language, onDelete }) {
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState('');
    const expected = 'DELETE';

    const handleDelete = () => {
        if (confirm !== expected) return;
        onDelete();
        setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button variant="danger" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {language === 'id' ? 'Hapus Akun' : 'Delete Account'}
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-50 animate-in fade-in" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6 animate-in zoom-in-95">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-rose-600" />
                            </div>
                            <Dialog.Title className="text-lg font-semibold text-neutral-900">
                                {language === 'id' ? 'Hapus Akun Pengguna' : 'Delete User Account'}
                            </Dialog.Title>
                        </div>
                        <Dialog.Close asChild>
                            <button className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </Dialog.Close>
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">
                        {language === 'id'
                            ? `Akun ${user.name} akan dihapus secara permanen. Ketik DELETE untuk mengkonfirmasi.`
                            : `Account ${user.name} will be permanently deleted. Type DELETE to confirm.`}
                    </p>
                    <input
                        type="text"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="DELETE"
                        className="w-full mb-4 h-10 rounded-md border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="flex gap-3 justify-end">
                        <Dialog.Close asChild>
                            <Button variant="secondary">{language === 'id' ? 'Batal' : 'Cancel'}</Button>
                        </Dialog.Close>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={confirm !== expected}
                        >
                            {language === 'id' ? 'Hapus Akun' : 'Delete Account'}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UserShow({ profileUser, recentActivity }) {
    const { t, language } = useLanguage();
    const [flashMsg, setFlashMsg] = useState('');

    const showFlash = (msg) => {
        setFlashMsg(msg);
        setTimeout(() => setFlashMsg(''), 4000);
    };

    // Role form
    const roleForm = useForm({ role: profileUser.role });
    const handleRoleUpdate = (e) => {
        e.preventDefault();
        roleForm.put(route('admin.users.updateRole', profileUser.id), {
            onSuccess: () => showFlash(language === 'id' ? 'Peran berhasil diperbarui.' : 'Role updated successfully.'),
        });
    };

    // Department form
    const deptForm = useForm({ department: profileUser.department || '' });
    const handleDeptUpdate = (e) => {
        e.preventDefault();
        deptForm.put(`/admin/users/${profileUser.id}/department`, {
            onSuccess: () => showFlash(language === 'id' ? 'Departemen berhasil diperbarui.' : 'Department updated successfully.'),
        });
    };

    // Email form
    const emailForm = useForm({ email: profileUser.email });
    const handleEmailUpdate = (e) => {
        e.preventDefault();
        emailForm.put(`/admin/users/${profileUser.id}/email`, {
            onSuccess: () => showFlash(language === 'id' ? 'Email berhasil diperbarui.' : 'Email updated successfully.'),
        });
    };

    // Password reset form
    const passwordForm = useForm({ password: '', password_confirmation: '' });
    const handlePasswordReset = (e) => {
        e.preventDefault();
        passwordForm.put(`/admin/users/${profileUser.id}/password`, {
            onSuccess: () => {
                passwordForm.reset();
                showFlash(language === 'id' ? 'Kata sandi berhasil direset.' : 'Password reset successfully.');
            },
        });
    };

    // Delete
    const handleDelete = () => {
        router.delete(`/admin/users/${profileUser.id}`, {
            onSuccess: () => {},
        });
    };

    const departments = ['Administrasi', 'Akademik', 'Keuangan', 'IT Department', 'Kemahasiswaan', 'Perpustakaan', 'Lainnya'];

    const label = (id, en) => language === 'id' ? id : en;

    return (
        <AppLayout title={`${label('Profil', 'Profile')} - ${profileUser.name}`}>
            <Head title={`${profileUser.name} - ${label('Detail Pengguna', 'User Detail')}`} />

            {/* Page header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                    href="/admin/users"
                        className="p-2 -ml-2 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-primary-900">{profileUser.name}</h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            {label('Detail lengkap akun pengguna', 'Full user account detail')}
                        </p>
                    </div>
                </div>
            </div>

            <SuccessAlert msg={flashMsg} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Left Column: Avatar card + stats ── */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Avatar/Profile card */}
                    <Card className="overflow-hidden p-0">
                        {profileUser.cover_path ? (
                            <div className="h-24 overflow-hidden">
                                <img src={`/storage/${profileUser.cover_path}`} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-800" />
                        )}
                        <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center">
                            <div className="-mt-12 mb-4">
                                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                                    <div className="h-full w-full rounded-full overflow-hidden bg-primary-100 flex items-center justify-center border border-neutral-200">
                                        {profileUser.avatar_path ? (
                                            <img src={`/storage/${profileUser.avatar_path}`} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserCircle className="h-12 w-12 text-primary-300" strokeWidth={1.5} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900">{profileUser.name}</h2>
                            <Badge className={cn('mt-2 capitalize', profileUser.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600')}>
                                {profileUser.role === 'admin' ? <><Shield className="h-3 w-3 mr-1" />Admin</> : <><User className="h-3 w-3 mr-1" />{label('Pengguna', 'User')}</>}
                            </Badge>
                            <div className="w-full mt-5 space-y-0">
                                <InfoRow icon={Mail} label="Email" value={profileUser.email} />
                                <InfoRow icon={Phone} label={label('Telepon', 'Phone')} value={profileUser.phone || '-'} />
                                <InfoRow icon={Briefcase} label={label('Departemen', 'Department')} value={profileUser.department || '-'} />
                                <InfoRow icon={CalendarClock} label={label('Bergabung', 'Joined')} value={profileUser.created_at_human} />
                                <InfoRow icon={Clock} label={label('Login Terakhir', 'Last Login')} value={profileUser.last_login_human} />
                            </div>
                        </div>
                    </Card>

                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Ticket, color: 'bg-primary-50 text-primary-600', label: label('Tiket', 'Tickets'), value: profileUser.tickets_count },
                            { icon: MessageSquare, color: 'bg-secondary-50 text-secondary-600', label: label('Komentar', 'Comments'), value: profileUser.comments_count },
                            { icon: Shield, color: 'bg-neutral-100 text-neutral-600', label: 'Audit', value: profileUser.activity_logs_count },
                        ].map(({ icon: Icon, color, label: lbl, value }) => (
                            <Card key={lbl} className="p-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="text-xs text-neutral-500 truncate">{lbl}</p>
                                <p className="text-lg font-bold text-neutral-900">{value}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* ── Right Column: Admin action tabs ── */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs.Root defaultValue="role" className="flex flex-col w-full">
                        <Tabs.List className="flex border-b border-neutral-200 mb-6 overflow-x-auto scrollbar-hide">
                            {[
                                { value: 'role',       icon: Shield,       label: label('Peran', 'Role') },
                                { value: 'department', icon: Briefcase,    label: label('Departemen', 'Department') },
                                { value: 'email',      icon: Mail,         label: 'Email' },
                                { value: 'password',   icon: Lock,         label: label('Kata Sandi', 'Password') },
                                { value: 'activity',   icon: Activity,     label: label('Aktivitas', 'Activity') },
                                { value: 'danger',     icon: AlertTriangle, label: label('Bahaya', 'Danger') },
                            ].map(({ value, icon: Icon, label: lbl }) => (
                                <Tabs.Trigger
                                    key={value}
                                    value={value}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:text-neutral-700 data-[state=active]:text-primary-700 data-[state=active]:border-primary-700 transition-all whitespace-nowrap"
                                >
                                    <Icon className="h-4 w-4" />
                                    {lbl}
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        {/* ROLE */}
                            <Tabs.Content value="role" asChild>
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card>
                                        <h2 className="text-base font-semibold text-neutral-900 mb-1">{label('Ubah Peran', 'Change Role')}</h2>
                                        <p className="text-sm text-neutral-500 mb-5">{label('Mengangkat atau menurunkan peran pengguna di sistem.', 'Promote or demote the user role in the system.')}</p>
                                        <form onSubmit={handleRoleUpdate} className="space-y-4 max-w-sm">
                                            <select
                                                value={roleForm.data.role}
                                                onChange={(e) => roleForm.setData('role', e.target.value)}
                                                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                            >
                                                <option value="user">{label('Pengguna', 'User')}</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <Button type="submit" loading={roleForm.processing}>{label('Simpan Peran', 'Save Role')}</Button>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            {/* DEPARTMENT */}
                            <Tabs.Content value="department" asChild>
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card>
                                        <h2 className="text-base font-semibold text-neutral-900 mb-1">{label('Ubah Departemen', 'Change Department')}</h2>
                                        <p className="text-sm text-neutral-500 mb-5">{label('Hanya admin yang dapat mengubah departemen pengguna.', 'Only admins can change a user\'s department.')}</p>
                                        <form onSubmit={handleDeptUpdate} className="space-y-4 max-w-sm">
                                            <select
                                                value={deptForm.data.department}
                                                onChange={(e) => deptForm.setData('department', e.target.value)}
                                                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                                required
                                            >
                                                <option value="">{label('Pilih Departemen', 'Select Department')}</option>
                                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            {deptForm.errors.department && <p className="text-xs text-rose-600">{deptForm.errors.department}</p>}
                                            <Button type="submit" loading={deptForm.processing}>{label('Simpan Departemen', 'Save Department')}</Button>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            {/* EMAIL */}
                            <Tabs.Content value="email" asChild>
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card>
                                        <h2 className="text-base font-semibold text-neutral-900 mb-1">{label('Ubah Email', 'Change Email')}</h2>
                                        <p className="text-sm text-neutral-500 mb-5">{label('Perbarui alamat email akun pengguna ini.', 'Update the email address for this user account.')}</p>
                                        <form onSubmit={handleEmailUpdate} className="space-y-4 max-w-sm">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={emailForm.data.email}
                                                    onChange={(e) => emailForm.setData('email', e.target.value)}
                                                    className="h-10 w-full rounded-md border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                                    required
                                                />
                                                {emailForm.errors.email && <p className="text-xs text-rose-600 mt-1">{emailForm.errors.email}</p>}
                                            </div>
                                            <Button type="submit" loading={emailForm.processing}>{label('Simpan Email', 'Save Email')}</Button>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            {/* PASSWORD */}
                            <Tabs.Content value="password" asChild>
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card>
                                        <h2 className="text-base font-semibold text-neutral-900 mb-1">{label('Reset Kata Sandi', 'Reset Password')}</h2>
                                        <p className="text-sm text-neutral-500 mb-5">{label('Tetapkan kata sandi baru untuk akun ini. Tidak perlu kata sandi lama.', 'Set a new password for this account. No current password required.')}</p>
                                        <form onSubmit={handlePasswordReset} className="space-y-4 max-w-sm">
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 mb-1">{label('Kata Sandi Baru', 'New Password')}</label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.data.password}
                                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                    className="h-10 w-full rounded-md border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                                    required
                                                    minLength={8}
                                                />
                                                {passwordForm.errors.password && <p className="text-xs text-rose-600 mt-1">{passwordForm.errors.password}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-neutral-500 mb-1">{label('Konfirmasi Kata Sandi', 'Confirm Password')}</label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.data.password_confirmation}
                                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                    className="h-10 w-full rounded-md border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" loading={passwordForm.processing}>{label('Reset Kata Sandi', 'Reset Password')}</Button>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            {/* ACTIVITY */}
                            <Tabs.Content value="activity" asChild>
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card>
                                        <h2 className="text-base font-semibold text-neutral-900 mb-4">{label('Riwayat Aktivitas', 'Activity History')}</h2>
                                        {recentActivity && recentActivity.length > 0 ? (
                                            <div className="relative border-l border-neutral-200 ml-3 space-y-6">
                                                {recentActivity.map((activity) => (
                                                    <div key={activity.id} className="relative pl-6">
                                                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-neutral-200 border-2 border-white ring-1 ring-neutral-200" />
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`inline-flex items-center h-5 px-2 rounded text-[10px] font-semibold uppercase tracking-wider ${getActionColor(activity.action)}`}>
                                                                {actionLabels[activity.action] || activity.action}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-neutral-900">{activity.description}</p>
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{new Date(activity.created_at).toLocaleString()}</span>
                                                            {activity.ip_address && (
                                                                <><span>&bull;</span><span>{activity.ip_address}</span></>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <Activity className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                                <p className="text-sm text-neutral-500">{label('Belum ada log aktivitas.', 'No activity logs yet.')}</p>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            {/* DANGER ZONE */}
                            <Tabs.Content value="danger" asChild>
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card className="border-rose-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="h-5 w-5 text-rose-600" />
                                            <h2 className="text-base font-semibold text-rose-700">{label('Zona Berbahaya', 'Danger Zone')}</h2>
                                        </div>
                                        <p className="text-sm text-neutral-500 mb-6">
                                            {label(
                                                'Tindakan berikut bersifat permanen dan tidak dapat dibatalkan. Harap bertindak dengan hati-hati.',
                                                'The following actions are permanent and cannot be undone. Please act with caution.'
                                            )}
                                        </p>
                                        <div className="p-4 border border-rose-200 rounded-lg bg-rose-50/40 space-y-3">
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900">{label('Hapus Akun Ini', 'Delete This Account')}</p>
                                                <p className="text-xs text-neutral-500 mt-0.5">
                                                    {label(
                                                        'Akun akan dihapus sementara (soft delete). Data tiket tetap terjaga untuk keperluan audit.',
                                                        'Account will be soft-deleted. Ticket data is retained for audit purposes.'
                                                    )}
                                                </p>
                                            </div>
                                            <DeleteUserDialog user={profileUser} language={language} onDelete={handleDelete} />
                                        </div>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </AppLayout>
    );
}
