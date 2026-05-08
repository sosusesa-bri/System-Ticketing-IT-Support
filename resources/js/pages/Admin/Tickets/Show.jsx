import { useForm, Link, router } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import { StatusBadge, PriorityBadge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
    ChevronRight,
    User,
    Tag,
    Calendar,
    UserCheck,
    Paperclip,
    Send,
    Clock,
    Settings,
    Mail,
    Building,
    FileText,
    Download,
    FileArchive,
    FileSpreadsheet,
    Image as ImageIcon,
} from 'lucide-react';

const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return FileSpreadsheet;
    if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('compressed')) return FileArchive;
    if (mimeType.startsWith('image/')) return ImageIcon;
    return FileText;
};

export default function AdminTicketShow({ ticket, activityLogs, admins, macros }) {
    const { t } = useLanguage();
    const commentForm = useForm({ body: '', is_internal: false });
    const statusForm = useForm({ status: ticket.status, solution_notes: ticket.solution_notes || '' });
    const assignForm = useForm({ assigned_to: ticket.assignee?.id || '', notes: '' });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        commentForm.post(`/tickets/${ticket.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        statusForm.put(`/admin/tickets/${ticket.id}`, { preserveScroll: true });
    };

    const handleAssign = (e) => {
        e.preventDefault();
        assignForm.post(`/admin/tickets/${ticket.id}/assign`, {
            preserveScroll: true,
            onSuccess: () => assignForm.reset('notes'),
        });
    };

    return (
        <AppLayout title={`${t('ticket')} ${ticket.ticket_number}`}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/admin/dashboard" className="hover:text-primary-700">{t('dashboard')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/tickets" className="hover:text-primary-700">{t('allTickets')}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{ticket.ticket_number}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{ticket.title}</h1>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="text-sm text-neutral-500">{ticket.ticket_number}</span>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <h2 className="text-base font-semibold text-neutral-950 mb-3">{t('td_description')}</h2>
                        <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">{ticket.description}</p>
                    </Card>

                    {/* Solution Notes */}
                    {ticket.solution_notes && (
                        <Card>
                            <h2 className="text-base font-semibold text-neutral-950 mb-3">{t('td_solutionNotes')}</h2>
                            <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">{ticket.solution_notes}</p>
                        </Card>
                    )}

                    {/* Attachments */}
                    {ticket.attachments.length > 0 && (
                        <Card>
                            <h2 className="text-base font-semibold text-neutral-950 mb-3">{t('td_attachments')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ticket.attachments.map((file) => {
                                    const isImage = file.mime_type.startsWith('image/');
                                    return (
                                        <div
                                            key={file.id}
                                            className="block group border border-neutral-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors relative"
                                        >
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" aria-label={`View ${file.original_name}`}></a>
                                            <div className="relative z-10 pointer-events-none">
                                                {isImage ? (
                                                    <div className="aspect-video w-full bg-neutral-100 overflow-hidden border-b border-neutral-200 relative">
                                                        <img
                                                            src={file.url}
                                                            alt={file.original_name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video w-full bg-neutral-50 flex flex-col items-center justify-center border-b border-neutral-200 gap-2">
                                                        {(() => {
                                                            const Icon = getFileIcon(file.mime_type);
                                                            return <Icon className="h-10 w-10 text-neutral-300 group-hover:text-primary-400 transition-colors" />;
                                                        })()}
                                                        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                                            {file.original_name.split('.').pop()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 bg-white flex items-center justify-between gap-3 relative z-20">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <Paperclip className="h-4 w-4 text-neutral-400 shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                                                            {file.original_name}
                                                        </p>
                                                        <p className="text-xs text-neutral-500">{file.formatted_size}</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`${file.url}?download=1`}
                                                    download={file.original_name}
                                                    className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors pointer-events-auto"
                                                    title={t('download')}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* Activity & Comments */}
                    <Card>
                        <h2 className="text-base font-semibold text-neutral-950 mb-4">{t('td_activity')}</h2>
                        <div className="space-y-4 mb-6">
                            {ticket.comments.map((comment) => (
                                <div key={comment.id} className={`flex gap-3 ${comment.is_internal ? 'bg-warning-50 -mx-2 px-2 py-2 rounded-md' : ''}`}>
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-semibold text-primary-700">{comment.user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-950">{comment.user.name}</span>
                                            {comment.is_internal && <span className="text-[10px] font-medium text-warning-600 bg-warning-100 px-1.5 py-0.5 rounded">{t('td_internal')}</span>}
                                            <span className="text-xs text-neutral-400">{comment.created_at}</span>
                                        </div>
                                        <p className="text-sm text-neutral-600 mt-1 whitespace-pre-line">{comment.body}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Assignment history */}
                            {ticket.assignments.map((assignment) => (
                                <div key={assignment.id} className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                                        <UserCheck className="h-4 w-4 text-primary-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-600">
                                            {t('td_assignedToBy')} <strong>{assignment.assignee}</strong> {t('td_by')} {assignment.assigner}
                                        </p>
                                        {assignment.notes && <p className="text-xs text-neutral-500 mt-0.5">{assignment.notes}</p>}
                                        <p className="text-xs text-neutral-400 mt-0.5">{assignment.created_at}</p>
                                    </div>
                                </div>
                            ))}

                            {activityLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                        <Clock className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-600">{log.description}</p>
                                        <p className="text-xs text-neutral-400 mt-0.5">{log.user} &middot; {log.created_at}</p>
                                    </div>
                                </div>
                            ))}

                            {ticket.comments.length === 0 && activityLogs.length === 0 && (
                                <p className="text-sm text-neutral-400 text-center py-4">{t('td_noActivity')}</p>
                            )}
                        </div>

                        {/* Comment form */}
                        <form onSubmit={handleCommentSubmit} className="border-t border-neutral-200 pt-4">
                            {macros && macros.length > 0 && (
                                <div className="mb-3">
                                    <select 
                                        className="h-8 rounded-md border border-neutral-200 bg-neutral-50 px-2 text-xs text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500 max-w-[200px]"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                const macro = macros.find(m => m.id == e.target.value);
                                                if (macro) {
                                                    commentForm.setData('body', commentForm.data.body + (commentForm.data.body ? '\n\n' : '') + macro.body);
                                                }
                                                e.target.value = '';
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>{t('td_insertTemplate')}</option>
                                        {macros.map(m => (
                                            <option key={m.id} value={m.id}>{m.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <textarea
                                value={commentForm.data.body}
                                onChange={(e) => commentForm.setData('body', e.target.value)}
                                placeholder={t('td_writeCommentAdmin')}
                                className="w-full min-h-[80px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                required
                            />
                            <div className="flex items-center justify-between mt-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={commentForm.data.is_internal} onChange={(e) => commentForm.setData('is_internal', e.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-warning-600 focus:ring-warning-600" />
                                    <span className="text-xs text-neutral-500">{t('td_internalNoteDesc')}</span>
                                </label>
                                <Button type="submit" size="sm" loading={commentForm.processing}>
                                    <Send className="h-3.5 w-3.5" />
                                    {t('td_post')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar — Admin controls */}
                <div className="space-y-4">
                    {/* Requester info */}
                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-950 mb-4">{t('td_requester')}</h3>
                        <dl className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">{t('td_name')}</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.user.name}</dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">{t('email')}</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.user.email}</dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">{t('department')}</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.user.department || '-'}</dd>
                                </div>
                            </div>
                        </dl>
                    </Card>

                    {/* Ticket details */}
                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-950 mb-4">{t('td_details')}</h3>
                        <dl className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Tag className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">{t('category')}</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.category?.name || '-'}</dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">{t('td_created')}</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.created_at}</dd>
                                </div>
                            </div>
                            {ticket.due_at && (
                                <div className="flex items-center gap-3">
                                    <Clock className={`h-4 w-4 shrink-0 ${ticket.status !== 'closed' && new Date(ticket.due_at) < new Date() ? 'text-rose-500' : 'text-neutral-400'}`} />
                                    <div>
                                        <dt className="text-xs text-neutral-500">{t('td_slaDeadline')}</dt>
                                        <dd className={`text-sm ${ticket.status !== 'closed' && new Date(ticket.due_at) < new Date() ? 'text-rose-600 font-semibold' : 'text-neutral-950'}`}>
                                            {ticket.due_at}
                                        </dd>
                                    </div>
                                </div>
                            )}
                            {ticket.closed_at && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                                    <div>
                                        <dt className="text-xs text-neutral-500">{t('td_closed')}</dt>
                                        <dd className="text-sm text-neutral-950">{ticket.closed_at}</dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    </Card>

                    {/* CSAT Rating */}
                    {ticket.rating && (
                        <Card>
                            <h3 className="text-sm font-semibold text-neutral-950 mb-4">{t('td_userSatisfaction')}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className={`h-5 w-5 ${star <= ticket.rating ? 'text-amber-400' : 'text-neutral-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-sm font-medium ml-2">{ticket.rating} / 5</span>
                            </div>
                            {ticket.feedback_notes && (
                                <p className="text-sm text-neutral-600 italic bg-neutral-50 p-3 rounded-md mt-3 border border-neutral-100">"{ticket.feedback_notes}"</p>
                            )}
                        </Card>
                    )}

                    {/* Status update */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="h-4 w-4 text-neutral-400" />
                            <h3 className="text-sm font-semibold text-neutral-950">{t('td_updateStatus')}</h3>
                        </div>
                        <form onSubmit={handleStatusUpdate} className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">{t('status')}</label>
                                <select value={statusForm.data.status} onChange={(e) => statusForm.setData('status', e.target.value)} className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700">
                                    <option value="open">{t('open')}</option>
                                    <option value="on_process">{t('inProgress')}</option>
                                    <option value="closed">{t('closed')}</option>
                                    <option value="reopened">Reopened</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">{t('td_solutionNotes')}</label>
                                <textarea value={statusForm.data.solution_notes} onChange={(e) => statusForm.setData('solution_notes', e.target.value)} placeholder={t('td_addResolutionDetails')} className="w-full min-h-[60px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y" />
                            </div>
                            <Button type="submit" size="sm" className="w-full" loading={statusForm.processing}>
                                {t('td_updateStatus')}
                            </Button>
                        </form>
                    </Card>

                    {/* Assignment */}
                    <Card>
                        <div className="flex items-center gap-2 mb-4">
                            <UserCheck className="h-4 w-4 text-neutral-400" />
                            <h3 className="text-sm font-semibold text-neutral-950">{t('td_assignTicket')}</h3>
                        </div>
                        <form onSubmit={handleAssign} className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">{t('td_assignTo')}</label>
                                <select value={assignForm.data.assigned_to} onChange={(e) => assignForm.setData('assigned_to', e.target.value)} className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700" required>
                                    <option value="">{t('td_selectStaff')}</option>
                                    {admins.map((admin) => <option key={admin.id} value={admin.id}>{admin.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-neutral-500">{t('td_assignmentNotes')}</label>
                                <input type="text" value={assignForm.data.notes} onChange={(e) => assignForm.setData('notes', e.target.value)} placeholder={t('td_assignmentNotesPlaceholder')} className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700" />
                            </div>
                            <Button type="submit" size="sm" variant="secondary" className="w-full" loading={assignForm.processing}>
                                {t('td_assign')}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
