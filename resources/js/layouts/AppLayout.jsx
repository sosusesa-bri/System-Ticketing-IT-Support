import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { ToastProvider } from '../components/ui/Toast';
import { useTheme } from '../contexts/ThemeContext';

export default function AppLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;
    const { syncTheme } = useTheme();

    // Sync theme from user's DB preference on mount
    useEffect(() => {
        if (auth?.user?.theme) {
            syncTheme(auth.user.theme);
        }
    }, []);

    return (
        <ToastProvider>
            <Head title={title} />
            <div className="min-h-screen bg-neutral-100">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    user={auth.user}
                />

                {/* Main content area */}
                <div className="lg:pl-60">
                    <TopBar
                        onMenuClick={() => setSidebarOpen(true)}
                        user={auth.user}
                    />

                    <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
