import { Link } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import Card from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Bell, Send, CheckCircle2, AlertCircle, FileText, Settings, Play } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function NotificationDashboard({ stats, recentBroadcasts }) {
    const { t } = useLanguage();

    return (
        <AppLayout title="Notification Dashboard">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Notification Operations Center</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage broadcasts, templates, and automated notifications.</p>
                </div>
                <Link 
                    href="/admin/notifications/broadcasts/create" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 disabled:opacity-50 disabled:pointer-events-none bg-primary-700 text-white hover:bg-primary-800 h-10 py-2 px-4"
                >
                    <Send className="h-4 w-4 mr-2" />
                    New Broadcast
                </Link>
            </div>

            {/* Quick Actions Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Link href="/admin/notifications/dashboard" className="flex items-center p-4 bg-primary-50 rounded-lg border border-primary-100 text-primary-700 hover:bg-primary-100 transition-colors">
                    <Bell className="h-5 w-5 mr-3" />
                    <span className="font-semibold">Overview</span>
                </Link>
                <Link href="/admin/notifications/broadcasts" className="flex items-center p-4 bg-white rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Send className="h-5 w-5 mr-3 text-neutral-400" />
                    <span className="font-semibold">Broadcasts</span>
                </Link>
                <Link href="/admin/notifications/templates" className="flex items-center p-4 bg-white rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <FileText className="h-5 w-5 mr-3 text-neutral-400" />
                    <span className="font-semibold">Templates</span>
                </Link>
                <Link href="/admin/notifications/automation" className="flex items-center p-4 bg-white rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <Play className="h-5 w-5 mr-3 text-neutral-400" />
                    <span className="font-semibold">Automation</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="p-5 flex items-center gap-4">
                    <div className="p-3 bg-neutral-100 text-neutral-600 rounded-lg">
                        <Send className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Total Broadcasts</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.total_broadcasts}</p>
                    </div>
                </Card>
                <Card className="p-5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Completed</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.completed}</p>
                    </div>
                </Card>
                <Card className="p-5 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                        <Settings className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Scheduled</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.scheduled}</p>
                    </div>
                </Card>
                <Card className="p-5 flex items-center gap-4">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Failed</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.failed}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2">
                    <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-neutral-900">Recent Broadcasts</h2>
                        <Link href="/admin/notifications/broadcasts" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                            View All
                        </Link>
                    </div>
                    <div className="p-0">
                        {recentBroadcasts.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-50 border-b border-neutral-200">
                                        <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Title</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Type</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Status</th>
                                        <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBroadcasts.map((b) => (
                                        <tr key={b.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                            <td className="py-3 px-5 text-sm font-medium text-neutral-900">{b.title}</td>
                                            <td className="py-3 px-5">
                                                <Badge className={
                                                    b.type === 'info' ? 'bg-sky-100 text-sky-700' :
                                                    b.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                                                    b.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }>
                                                    {b.type}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-5">
                                                <Badge className={
                                                    b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    b.status === 'draft' ? 'bg-neutral-100 text-neutral-700' :
                                                    b.status === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                                                    b.status === 'scheduled' ? 'bg-sky-100 text-sky-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }>
                                                    {b.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-5 text-sm text-neutral-500">{b.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mb-4">
                                    <Send className="h-6 w-6 text-neutral-400" />
                                </div>
                                <h3 className="text-sm font-medium text-neutral-900">No broadcasts found</h3>
                                <p className="text-sm text-neutral-500 mt-1 mb-4">You haven't sent any broadcasts yet.</p>
                                <Link 
                                    href="/admin/notifications/broadcasts/create" 
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2"
                                >
                                    Create Broadcast
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="col-span-1">
                    <div className="p-5 border-b border-neutral-100">
                        <h2 className="text-lg font-semibold text-neutral-900">System Capacity</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-600">Templates</span>
                                <span className="font-medium">{stats.templates} / 50</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(stats.templates / 50) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-600">Monthly Quota</span>
                                <span className="font-medium">Unlimited</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
