import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';
import { 
    User, Mail, Phone, Briefcase, CalendarClock, Shield, 
    Activity, Clock, UserCircle, ChevronLeft, Ticket
} from 'lucide-react';

export default function UserShow({ profileUser, recentActivity }) {
    const { t } = useLanguage();
    
    const roleForm = useForm({
        role: profileUser.role,
    });

    const handleRoleUpdate = (e) => {
        e.preventDefault();
        roleForm.put(route('admin.users.updateRole', profileUser.id));
    };

    return (
        <AppLayout title={`${t('profile')} - ${profileUser.name}`}>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.users.index')}
                        className="p-2 -ml-2 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-primary-900">{profileUser.name}</h1>
                        <p className="text-sm text-neutral-500 mt-1">{t('accountSummary')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Summary & Avatar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-800"></div>
                        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
                            <div className="relative -mt-12 mb-4">
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
                            <Badge className={cn("mt-2 capitalize", profileUser.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600')}>
                                {profileUser.role}
                            </Badge>
                            
                            <div className="w-full mt-6 space-y-3 text-sm text-left">
                                <div className="flex items-center text-neutral-600">
                                    <Mail className="h-4 w-4 mr-3 text-neutral-400" />
                                    <span className="truncate">{profileUser.email}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Phone className="h-4 w-4 mr-3 text-neutral-400" />
                                    <span>{profileUser.phone || '-'}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Briefcase className="h-4 w-4 mr-3 text-neutral-400" />
                                    <span>{profileUser.department}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-4">{t('accountSummary')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 flex items-center gap-2"><CalendarClock className="h-4 w-4" /> {t('joinedLabel')}</span>
                                <span className="font-medium text-neutral-900">{profileUser.created_at_human}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 flex items-center gap-2"><Clock className="h-4 w-4" /> {t('lastLoginLabel')}</span>
                                <span className="font-medium text-neutral-900">{profileUser.last_login_human}</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-4">{t('roleLabel')}</h3>
                        <form onSubmit={handleRoleUpdate} className="space-y-4">
                            <select
                                value={roleForm.data.role}
                                onChange={(e) => roleForm.setData('role', e.target.value)}
                                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <Button type="submit" variant="outline" className="w-full" loading={roleForm.processing}>
                                {t('saveChanges')}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <Ticket className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500">Total Tickets</p>
                                    <p className="text-lg font-bold text-neutral-900">{profileUser.tickets_count}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary-50 rounded-lg">
                                    <Activity className="h-5 w-5 text-secondary-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500">Comments</p>
                                    <p className="text-lg font-bold text-neutral-900">{profileUser.comments_count}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-100 rounded-lg">
                                    <Shield className="h-5 w-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500">Audit Logs</p>
                                    <p className="text-lg font-bold text-neutral-900">{profileUser.activity_logs_count}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <div className="mb-6 border-b border-neutral-100 pb-4">
                            <h2 className="text-lg font-semibold text-neutral-900">{t('auditHistory')}</h2>
                        </div>
                        <div className="space-y-6">
                            {recentActivity && recentActivity.length > 0 ? (
                                <div className="relative border-l border-neutral-200 ml-3 space-y-6">
                                    {recentActivity.map((activity, index) => (
                                        <div key={activity.id} className="relative pl-6">
                                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-neutral-200 border-2 border-white ring-1 ring-neutral-200"></div>
                                            <p className="text-sm font-medium text-neutral-900">{activity.description}</p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(activity.created_at).toLocaleString()}</span>
                                                {activity.ip_address && (
                                                    <>
                                                        <span>&bull;</span>
                                                        <span>{activity.ip_address}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <Activity className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                    <p className="text-sm text-neutral-500">{t('noActivityLogs')}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
