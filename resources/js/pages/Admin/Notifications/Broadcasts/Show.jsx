import { Link } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { ArrowLeft, Send, User, Clock, CheckCircle2, XCircle, Mail } from 'lucide-react';

export default function BroadcastShow({ broadcast, logs }) {
    const statusColor = {
        completed: 'bg-emerald-100 text-emerald-700',
        draft: 'bg-neutral-100 text-neutral-700',
        processing: 'bg-indigo-100 text-indigo-700',
        scheduled: 'bg-sky-100 text-sky-700',
        failed: 'bg-rose-100 text-rose-700',
    };

    const typeColor = {
        info: 'bg-sky-100 text-sky-700',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-rose-100 text-rose-700',
    };

    return (
        <AppLayout title={`Broadcast: ${broadcast.title}`}>
            <div className="mb-6 flex items-center">
                <Link href="/admin/notifications/broadcasts" className="mr-4 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-primary-900">{broadcast.title}</h1>
                    <p className="text-sm text-neutral-500 mt-1">Broadcast detail and delivery log.</p>
                </div>
                <Badge className={statusColor[broadcast.status] || 'bg-neutral-100 text-neutral-700'}>
                    {broadcast.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broadcast Details */}
                <Card className="lg:col-span-2">
                    <div className="p-5 border-b border-neutral-100">
                        <h2 className="text-lg font-semibold text-neutral-900">Broadcast Content</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="bg-neutral-50 rounded-lg p-4 text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
                            {broadcast.message}
                        </div>
                    </div>
                </Card>

                {/* Metadata */}
                <Card>
                    <div className="p-5 border-b border-neutral-100">
                        <h2 className="text-lg font-semibold text-neutral-900">Details</h2>
                    </div>
                    <div className="p-5 space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                            <div>
                                <p className="text-neutral-500">Created by</p>
                                <p className="font-medium text-neutral-900">{broadcast.creator}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                            <div>
                                <p className="text-neutral-500">Created at</p>
                                <p className="font-medium text-neutral-900">{broadcast.created_at}</p>
                            </div>
                        </div>
                        {broadcast.sent_at && (
                            <div className="flex items-center gap-3">
                                <Send className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                                <div>
                                    <p className="text-neutral-500">Sent at</p>
                                    <p className="font-medium text-neutral-900">{broadcast.sent_at}</p>
                                </div>
                            </div>
                        )}
                        <hr className="border-neutral-100" />
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-neutral-500">Type</p>
                                <Badge className={typeColor[broadcast.type] || 'bg-neutral-100 text-neutral-700'}>
                                    {broadcast.type}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-neutral-500">Audience</p>
                                <p className="font-medium text-neutral-900 capitalize">
                                    {broadcast.target_audience?.type || 'All Users'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-neutral-500">Channels</p>
                                <div className="flex gap-1 mt-1">
                                    {(broadcast.channels || []).map(ch => (
                                        <Badge key={ch} className="bg-primary-50 text-primary-700">{ch}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Delivery Logs */}
            <Card className="mt-6">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">Delivery Log</h2>
                    <span className="text-sm text-neutral-500">{logs.length} recipients</span>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">User</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Channel</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Status</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Sent At</th>
                                <th className="py-3 px-5 text-xs font-semibold text-neutral-600">Read At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map((log) => (
                                <tr key={log.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                    <td className="py-3 px-5 text-sm font-medium text-neutral-900">{log.user}</td>
                                    <td className="py-3 px-5">
                                        <Badge className="bg-primary-50 text-primary-700">{log.channel}</Badge>
                                    </td>
                                    <td className="py-3 px-5">
                                        {log.status === 'sent' ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                                                <CheckCircle2 className="h-4 w-4" /> Sent
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-rose-600 text-sm">
                                                <XCircle className="h-4 w-4" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-5 text-sm text-neutral-500">{log.sent_at || '-'}</td>
                                    <td className="py-3 px-5 text-sm text-neutral-500">{log.read_at || '-'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-sm text-neutral-500">
                                        No delivery logs available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AppLayout>
    );
}
