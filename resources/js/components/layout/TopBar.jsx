import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Bell, LogOut, User, Globe, Settings, ChevronDown, Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function TopBar({ onMenuClick }) {
    const { auth, notifications } = usePage().props;
    const { language, setLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const unreadCount = notifications?.unread_count || 0;
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        if (auth?.user) {
            router.post('/profile/theme', { theme: newTheme }, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        router.post('/logout', {}, {
            onFinish: () => setIsLoggingOut(false)
        });
    };

    return (
        <>
            <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
                <div className="flex items-center h-full px-4 sm:px-6 lg:px-8">
                    {/* Left: Hamburger & Logo (Mobile only) */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onMenuClick}
                            className="text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-5 w-5" strokeWidth={1.75} />
                        </motion.button>
                        
                        <div className="flex items-center">
                            <img src="/images/Logo_POLMIND.png" alt="POLMIND" className="h-8 w-auto" />
                        </div>
                    </div>

                    {/* Spacer to push right content to the end */}
                    <div className="flex-1" />

                    {/* Right: actions — fixed position via ml-auto removed, flex-1 spacer used instead */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* Notifications */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/notifications"
                                className="relative flex items-center justify-center h-10 w-10 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
                            >
                                <Bell className="h-5 w-5" strokeWidth={1.75} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 ring-2 ring-white">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        </motion.div>

                        <div className="w-px h-6 bg-neutral-200 hidden sm:block mx-1"></div>

                        {/* Profile Dropdown */}
                        <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenu.Trigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {auth?.user?.avatar_path ? (
                                            <img src={`/storage/${auth.user.avatar_path}`} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-4 w-4 text-primary-700" strokeWidth={2} />
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-semibold text-neutral-900 leading-none">{auth?.user?.name || 'User'}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5 capitalize leading-none">{auth?.user?.role || 'User'}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0 hidden sm:block" />
                                </motion.button>
                            </DropdownMenu.Trigger>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <DropdownMenu.Portal forceMount>
                                    <DropdownMenu.Content
                                        align="end"
                                        sideOffset={8}
                                        asChild
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="w-56 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50 p-1"
                                        >
                                            <div className="px-3 py-2 border-b border-neutral-100 mb-1 sm:hidden">
                                                <p className="text-sm font-semibold text-neutral-900 truncate">{auth?.user?.name}</p>
                                                <p className="text-xs text-neutral-500 truncate">{auth?.user?.email}</p>
                                            </div>

                                            <DropdownMenu.Item asChild>
                                                <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-primary-50 hover:text-primary-700 outline-none cursor-pointer transition-colors">
                                                    <Settings className="h-4 w-4" />
                                                    {t('editProfile')}
                                                </Link>
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Separator className="h-px bg-neutral-100 my-1" />

                                            <DropdownMenu.Sub>
                                                <DropdownMenu.SubTrigger className="flex items-center justify-between px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors data-[state=open]:bg-neutral-50">
                                                    <div className="flex items-center gap-2.5">
                                                        {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                                                        {t('theme') || (language === 'id' ? 'Tampilan' : 'Theme')}
                                                    </div>
                                                    <span className="text-xs text-neutral-400 font-semibold capitalize">{theme}</span>
                                                </DropdownMenu.SubTrigger>
                                                <DropdownMenu.Portal>
                                                    <DropdownMenu.SubContent sideOffset={4} asChild>
                                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-36 bg-white rounded-lg shadow-lg border border-neutral-200 p-1 z-50">
                                                            <DropdownMenu.Item onClick={() => handleThemeChange('light')} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors">
                                                                <Sun className="h-4 w-4" /> {language === 'id' ? 'Terang' : 'Light'}
                                                                {theme === 'light' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item onClick={() => handleThemeChange('dark')} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors">
                                                                <Moon className="h-4 w-4" /> {language === 'id' ? 'Gelap' : 'Dark'}
                                                                {theme === 'dark' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item onClick={() => handleThemeChange('system')} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors">
                                                                <Monitor className="h-4 w-4" /> Sistem
                                                                {theme === 'system' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                                            </DropdownMenu.Item>
                                                        </motion.div>
                                                    </DropdownMenu.SubContent>
                                                </DropdownMenu.Portal>
                                            </DropdownMenu.Sub>

                                            <DropdownMenu.Sub>
                                                <DropdownMenu.SubTrigger className="flex items-center justify-between px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors data-[state=open]:bg-neutral-50">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`fi fi-${language === 'en' ? 'gb' : 'id'} rounded-sm shadow-sm`} />
                                                        {t('language')}
                                                    </div>
                                                    <span className="text-xs text-neutral-400 font-semibold">{language.toUpperCase()}</span>
                                                </DropdownMenu.SubTrigger>
                                                <DropdownMenu.Portal>
                                                    <DropdownMenu.SubContent
                                                        sideOffset={4}
                                                        asChild
                                                    >
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="w-36 bg-white rounded-lg shadow-lg border border-neutral-200 p-1 z-50"
                                                        >
                                                            <DropdownMenu.Item
                                                                onClick={() => setLanguage('id')}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                                                            >
                                                                <span className="fi fi-id text-lg leading-none rounded-sm shadow-sm" /> ID
                                                                {language === 'id' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item
                                                                onClick={() => setLanguage('en')}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                                                            >
                                                                <span className="fi fi-gb text-lg leading-none rounded-sm shadow-sm" /> EN
                                                                {language === 'en' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                                            </DropdownMenu.Item>
                                                        </motion.div>
                                                    </DropdownMenu.SubContent>
                                                </DropdownMenu.Portal>
                                            </DropdownMenu.Sub>

                                            <DropdownMenu.Separator className="h-px bg-neutral-100 my-1" />

                                            <DropdownMenu.Item
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    setLogoutOpen(true);
                                                }}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-danger-600 font-medium rounded-md hover:bg-danger-50 outline-none cursor-pointer transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {t('logout')}
                                            </DropdownMenu.Item>
                                        </motion.div>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                                )}
                            </AnimatePresence>
                        </DropdownMenu.Root>
                    </div>
                </div>
            </header>

            {/* Logout Modal */}
            <Dialog.Root open={logoutOpen} onOpenChange={setLogoutOpen}>
                <AnimatePresence>
                    {logoutOpen && (
                        <Dialog.Portal forceMount>
                            <Dialog.Overlay asChild>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-50"
                                />
                            </Dialog.Overlay>
                            <Dialog.Content asChild>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
                                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 overflow-hidden"
                                >
                                    <div className="px-6 pt-6 pb-5">
                                        <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mb-4">
                                            <LogOut className="h-6 w-6 text-danger-600" strokeWidth={1.5} />
                                        </div>
                                        <Dialog.Title className="text-xl font-bold text-neutral-900 mb-2">
                                            {t('logoutConfirmTitle')}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-neutral-500 leading-relaxed">
                                            {t('logoutConfirmDesc')}
                                        </Dialog.Description>
                                    </div>
                                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
                                            >
                                                {t('cancel')}
                                            </motion.button>
                                        </Dialog.Close>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="px-4 py-2 text-sm font-medium text-white bg-danger-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 disabled:opacity-70 flex items-center gap-2"
                                        >
                                            {isLoggingOut && (
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            )}
                                            {isLoggingOut ? t('loggingOut') : t('logout')}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    )}
                </AnimatePresence>
            </Dialog.Root>
        </>
    );
}
