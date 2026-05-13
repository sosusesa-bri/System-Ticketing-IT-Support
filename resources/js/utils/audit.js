export const actionLabels = {
    login: 'Login',
    login_failed: 'Login Failed',
    logout: 'Logout',
    register: 'Register',
    ticket_created: 'Ticket Created',
    ticket_updated: 'Ticket Updated',
    ticket_deleted: 'Ticket Deleted',
    ticket_status_changed: 'Status Changed',
    ticket_draft_submitted: 'Draft Submitted',
    ticket_assigned: 'Ticket Assigned',
    ticket_rated: 'Ticket Rated',
    ticket_escalated: 'Ticket Escalated',
    ticket_reopened: 'Ticket Reopened',
    comment_added: 'Comment Added',
    profile_updated: 'Profile Updated',
    password_changed: 'Password Changed',
    user_role_changed: 'Role Changed',
    user_deleted: 'User Deleted',
    kb_article_created: 'KB Created',
    kb_article_updated: 'KB Updated',
    kb_article_deleted: 'KB Deleted',
    broadcast_sent: 'Broadcast Sent',
    export_generated: 'Export Generated'
};

export const getActionColor = (action) => {
    if (!action) return 'bg-neutral-100 text-neutral-700';
    if (action.includes('failed') || action.includes('deleted')) return 'bg-danger-100 text-danger-700';
    if (action.includes('login') || action.includes('auth') || action.includes('register')) return 'bg-blue-100 text-blue-700';
    if (action.includes('ticket')) return 'bg-primary-100 text-primary-700';
    if (action.includes('kb')) return 'bg-amber-100 text-amber-700';
    return 'bg-neutral-100 text-neutral-700';
};
