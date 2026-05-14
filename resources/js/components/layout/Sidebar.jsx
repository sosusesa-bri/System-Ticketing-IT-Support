import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    TicketPlus,
    Tickets,
    Bell,
    User,
    HelpCircle,
    Settings,
    Users,
    BarChart3,
    FileText,
    X,
    BookOpen,
    Activity,
    HeartPulse,
    Tag,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

function NavLink({ item, active }) {
    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                active
                    ? 'bg-neutral-100 text-primary-700 border-l-2 border-primary-700 -ml-px'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950',
            )}
        >
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span className="flex-1">{item.name}</span>
            {item.badge != null && item.badge > 0 && (
                <span className={cn(
                    'h-5 min-w-5 flex items-center justify-center rounded-full text-white text-[10px] font-bold px-1.5 shrink-0',
                    item.badgeColor || 'bg-red-500',
                )}>
                    {item.badge > 99 ? '99+' : item.badge}
                </span>
            )}
        </Link>
    );
}

export default function Sidebar({ open, onClose, user }) {
    const { url } = usePage();
    const { notifications, sidebar_stats } = usePage().props;
    const { t } = useLanguage();
    const isAdmin = user?.role === 'admin';
    const unreadCount = notifications?.unread_count || 0;
    
    const userNavItems = [
        { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { name: t('createTicket'), href: '/tickets/create', icon: TicketPlus },
        { name: t('myTickets'), href: '/tickets', icon: Tickets },
        { name: t('knowledgeBase'), href: '/knowledge-base', icon: BookOpen },
        { name: t('faq'), href: '/faq', icon: HelpCircle },
        { name: t('notifications'), href: '/notifications', icon: Bell, badge: unreadCount },
        { name: t('profile'), href: '/profile', icon: User },
        { name: t('myActivity'), href: '/my-activity', icon: Activity },
    ];

    const adminNavItems = [
        { name: t('adminDashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
        { name: t('tickets'), href: '/admin/tickets', icon: Tickets, badge: sidebar_stats?.urgent || 0, badgeColor: 'bg-rose-500' },
        { name: t('users'), href: '/admin/users', icon: Users },
        { name: t('reports'), href: '/admin/reports', icon: BarChart3 },
        { name: t('knowledgeBase'), href: '/admin/knowledge-base', icon: BookOpen },
        { name: t('faq'), href: '/admin/faq', icon: HelpCircle },
        { name: t('broadcast'), href: '/admin/notifications/dashboard', icon: Bell, badge: unreadCount },
        { name: t('auditLog'), href: '/admin/audit-log', icon: FileText },
        { name: t('systemHealth'), href: '/admin/system-health', icon: HeartPulse },
        { name: t('documentation'), href: '/admin/documentation', icon: HelpCircle },
        { name: t('settings'), href: '/admin/settings', icon: Settings },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
                <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
                    <img src="/images/Logo_POLMIND.png" alt="POLMIND" className="h-7 w-auto" />
                    <span className="text-sm font-bold text-primary-900 tracking-tight">
                        POLMIND IT SUPPORT
                    </span>
                </Link>
                <button
                    onClick={onClose}
                    className="lg:hidden text-neutral-400 hover:text-neutral-600"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {isAdmin && (
                    <p className="px-3 mb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Administration
                    </p>
                )}
                {navItems.map((item) => {
                    let active = url.startsWith(item.href);
                    if (item.href === '/tickets') {
                        active = url === '/tickets' || (url.startsWith('/tickets') && !url.startsWith('/tickets/create'));
                    }
                    if (item.href === '/admin/tickets') {
                        active = url === '/admin/tickets' || (url.startsWith('/admin/tickets') && !url.startsWith('/admin/tickets/create'));
                    }
                    if (item.href === '/admin/documentation') {
                        active = url.startsWith('/admin/documentation');
                    }
                    if (item.href === '/admin/notifications/dashboard') {
                        active = url.startsWith('/admin/notifications');
                    }
                    if (item.href === '/dashboard' && url !== '/dashboard') active = false;
                    if (item.href === '/admin/dashboard' && url !== '/admin/dashboard') active = false;

                    return (
                        <NavLink
                            key={item.name}
                            item={item}
                            active={active}
                        />
                    );
                })}
            </nav>

            {/* User info */}
            <div className="border-t border-neutral-200 p-3">
                <Link
                    href="/profile"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0 border border-primary-200 group-hover:border-primary-300 transition-colors">
                        {user?.avatar_path ? (
                            <img src={`/storage/${user.avatar_path}`} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold text-primary-700">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">{user?.name}</p>
                        <p className="text-xs text-neutral-500 truncate capitalize">{user?.role || user?.department}</p>
                    </div>
                    <Settings className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col bg-white border-r border-neutral-200 z-30">
                {sidebarContent}
            </aside>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {open && (
                    <motion.aside
                        initial={{ x: -240 }}
                        animate={{ x: 0 }}
                        exit={{ x: -240 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="fixed inset-y-0 left-0 w-60 bg-white border-r border-neutral-200 z-50 lg:hidden"
                    >
                        {sidebarContent}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
