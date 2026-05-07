import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { Send, ArrowLeft, Info, Calendar } from 'lucide-react';

export default function BroadcastCreate({ templates, users }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        type: 'info',
        priority: 'normal',
        target_type: 'all',
        target_values: [],
        channels: ['database'],
        template_id: '',
        scheduled_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/notifications/broadcasts');
    };

    return (
        <AppLayout title="New Broadcast">
            <div className="mb-6 flex items-center">
                <Link href="/admin/notifications/broadcasts" className="mr-4 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">New Broadcast</h1>
                    <p className="text-sm text-neutral-500 mt-1">Compose and send a new notification to users.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-5 border-b border-neutral-100 flex items-center bg-primary-50 rounded-t-lg">
                            <Info className="h-5 w-5 text-primary-600 mr-2" />
                            <p className="text-sm text-primary-800">Broadcasts are sent to selected audiences immediately unless scheduled.</p>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        id="title"
                                        label="Broadcast Title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={errors.title}
                                        required
                                        placeholder="Enter notification title"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Message Body</label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        rows={6}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                        placeholder="Type the broadcast message..."
                                    ></textarea>
                                    {errors.message && <p className="text-sm text-rose-500 mt-1">{errors.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Type / Theme</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="info">Info (Blue)</option>
                                        <option value="success">Success (Green)</option>
                                        <option value="warning">Warning (Yellow)</option>
                                        <option value="error">Error (Red)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Priority</label>
                                    <select
                                        value={data.priority}
                                        onChange={(e) => setData('priority', e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            
                            <hr className="border-neutral-100" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Target Audience</label>
                                    <select
                                        value={data.target_type}
                                        onChange={(e) => setData('target_type', e.target.value)}
                                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="role">Specific Roles</option>
                                        <option value="department">Specific Departments</option>
                                    </select>
                                </div>
                                
                                {data.target_type === 'role' && (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Select Roles</label>
                                        <select
                                            multiple
                                            value={data.target_values}
                                            onChange={(e) => setData('target_values', Array.from(e.target.selectedOptions, option => option.value))}
                                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <hr className="border-neutral-100" />
                            
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-neutral-500">
                                    Broadcasts will be delivered to the in-app notification center.
                                </div>
                                <Button type="submit" loading={processing}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Broadcast
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="col-span-1 space-y-6">
                    <Card>
                        <div className="p-5 border-b border-neutral-100 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-neutral-500" />
                            <h2 className="text-lg font-semibold text-neutral-900">Scheduling</h2>
                        </div>
                        <div className="p-5">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Send At (Optional)</label>
                            <Input
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                error={errors.scheduled_at}
                            />
                            <p className="text-xs text-neutral-500 mt-2">Leave blank to send immediately.</p>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-5 border-b border-neutral-100">
                            <h2 className="text-lg font-semibold text-neutral-900">Use Template</h2>
                        </div>
                        <div className="p-5">
                            <select
                                value={data.template_id}
                                onChange={(e) => {
                                    setData('template_id', e.target.value);
                                    // Normally we would fetch and apply the template content here
                                }}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
                            >
                                <option value="">-- No Template --</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
