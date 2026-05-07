import React, { useState } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
    ChevronRight,
    User,
    Tag,
    Calendar,
    UserCheck,
    Paperclip,
    FileText,
    Send,
    Clock,
} from 'lucide-react';

export default function TicketShow({ ticket, activityLogs }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === 'admin';

    const [hoverRating, setHoverRating] = useState(0);
    const commentForm = useForm({ body: '', is_internal: false });
    const rateForm = useForm({ rating: 0, feedback_notes: '' });
    const reopenForm = useForm({});

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        commentForm.post(`/tickets/${ticket.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    const handleRateSubmit = (e) => {
        e.preventDefault();
        rateForm.post(`/tickets/${ticket.id}/rate`, {
            preserveScroll: true,
        });
    };

    const handleReopen = (e) => {
        e.preventDefault();
        reopenForm.post(`/tickets/${ticket.id}/reopen`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={`Ticket ${ticket.ticket_number}`}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-6">
                <Link href="/dashboard" className="hover:text-primary-700">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/tickets" className="hover:text-primary-700">Tickets</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-950 font-medium">{ticket.ticket_number}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-primary-900">{ticket.title}</h1>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-neutral-500">{ticket.ticket_number}</span>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content — 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <h2 className="text-base font-semibold text-neutral-950 mb-3">Description</h2>
                        <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                            {ticket.description}
                        </p>
                    </Card>

                    {/* Solution notes */}
                    {ticket.solution_notes && (
                        <Card>
                            <h2 className="text-base font-semibold text-neutral-950 mb-3">Solution Notes</h2>
                            <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                                {ticket.solution_notes}
                            </p>
                        </Card>
                    )}

                    {/* Attachments */}
                    {ticket.attachments.length > 0 && (
                        <Card>
                            <h2 className="text-base font-semibold text-neutral-950 mb-3">Attachments</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ticket.attachments.map((file) => {
                                    const isImage = file.mime_type.startsWith('image/');
                                    return (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group border border-neutral-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
                                        >
                                            {isImage ? (
                                                <div className="aspect-video w-full bg-neutral-100 overflow-hidden border-b border-neutral-200 relative">
                                                    <img
                                                        src={file.url}
                                                        alt={file.original_name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-video w-full bg-neutral-50 flex items-center justify-center border-b border-neutral-200">
                                                    <FileText className="h-10 w-10 text-neutral-300 group-hover:text-primary-400 transition-colors" />
                                                </div>
                                            )}
                                            <div className="p-3 bg-white flex items-center gap-3">
                                                <Paperclip className="h-4 w-4 text-neutral-400 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                                                        {file.original_name}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">{file.formatted_size}</p>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* Comments / Activity */}
                    <Card>
                        <h2 className="text-base font-semibold text-neutral-950 mb-4">Activity</h2>

                        {/* Timeline */}
                        <div className="space-y-4 mb-6">
                            {/* Comments */}
                            {ticket.comments.map((comment) => (
                                <div key={comment.id} className={`flex gap-3 ${comment.is_internal ? 'bg-warning-50 -mx-2 px-2 py-2 rounded-md' : ''}`}>
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-semibold text-primary-700">
                                            {comment.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-950">{comment.user.name}</span>
                                            {comment.is_internal && (
                                                <span className="text-[10px] font-medium text-warning-600 bg-warning-100 px-1.5 py-0.5 rounded">Internal</span>
                                            )}
                                            <span className="text-xs text-neutral-400">{comment.created_at}</span>
                                        </div>
                                        <p className="text-sm text-neutral-600 mt-1 whitespace-pre-line">{comment.body}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Audit logs */}
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
                                <p className="text-sm text-neutral-400 text-center py-4">No activity yet.</p>
                            )}
                        </div>

                        {/* Add comment form */}
                        <form onSubmit={handleCommentSubmit} className="border-t border-neutral-200 pt-4">
                            <textarea
                                value={commentForm.data.body}
                                onChange={(e) => commentForm.setData('body', e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full min-h-[80px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                required
                            />
                            {commentForm.errors.body && (
                                <p className="text-xs text-danger-600 mt-1">{commentForm.errors.body}</p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                                {isAdmin && (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={commentForm.data.is_internal}
                                            onChange={(e) => commentForm.setData('is_internal', e.target.checked)}
                                            className="h-4 w-4 rounded border-neutral-300 text-warning-600 focus:ring-warning-600"
                                        />
                                        <span className="text-xs text-neutral-500">Internal note</span>
                                    </label>
                                )}
                                <Button
                                    type="submit"
                                    size="sm"
                                    loading={commentForm.processing}
                                    disabled={commentForm.processing}
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar — metadata */}
                <div className="space-y-4">
                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-950 mb-4">Details</h3>
                        <dl className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">Requester</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.user.name}</dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Tag className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">Category</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.category?.name || '-'}</dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserCheck className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">Assigned To</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.assignee?.name || 'Unassigned'}</dd>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                                <div>
                                    <dt className="text-xs text-neutral-500">Created</dt>
                                    <dd className="text-sm text-neutral-950">{ticket.created_at}</dd>
                                </div>
                            </div>
                            {ticket.due_at && (
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                                    <div>
                                        <dt className="text-xs text-neutral-500">Estimated Resolution</dt>
                                        <dd className="text-sm text-neutral-950">{ticket.due_at}</dd>
                                    </div>
                                </div>
                            )}
                            {ticket.closed_at && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
                                    <div>
                                        <dt className="text-xs text-neutral-500">Closed</dt>
                                        <dd className="text-sm text-neutral-950">{ticket.closed_at}</dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    </Card>

                    {/* CSAT Rating and Reopen */}
                    {ticket.status === 'closed' && (
                        <Card>
                            {ticket.rating ? (
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-950 mb-3">Your Feedback</h3>
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
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-950 mb-3">Rate your experience</h3>
                                    <p className="text-xs text-neutral-500 mb-4">How satisfied are you with the resolution of this ticket?</p>
                                    <form onSubmit={handleRateSubmit} className="space-y-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => rateForm.setData('rating', star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="focus:outline-none"
                                                >
                                                    <svg className={`h-8 w-8 transition-colors ${star <= (hoverRating || rateForm.data.rating) ? 'text-amber-400' : 'text-neutral-200 hover:text-amber-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                        {rateForm.errors.rating && <p className="text-xs text-danger-600">{rateForm.errors.rating}</p>}
                                        <textarea
                                            value={rateForm.data.feedback_notes}
                                            onChange={(e) => rateForm.setData('feedback_notes', e.target.value)}
                                            placeholder="Any additional feedback? (Optional)"
                                            className="w-full min-h-[60px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-700 resize-y"
                                        />
                                        <Button type="submit" size="sm" className="w-full" disabled={!rateForm.data.rating || rateForm.processing} loading={rateForm.processing}>
                                            Submit Feedback
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {!ticket.rating && (
                                <div className="mt-6 pt-6 border-t border-neutral-100">
                                    <h3 className="text-sm font-semibold text-neutral-950 mb-2">Issue not resolved?</h3>
                                    <p className="text-xs text-neutral-500 mb-3">If you are still experiencing the same issue, you can reopen this ticket.</p>
                                    <form onSubmit={handleReopen}>
                                        <Button type="submit" variant="outline" size="sm" className="w-full text-neutral-700" loading={reopenForm.processing}>
                                            Reopen Ticket
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </Card>
                    )}

                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-950 mb-3">Attachments</h3>
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm text-neutral-500">
                                {ticket.attachments.length} file{ticket.attachments.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
