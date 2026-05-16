import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Headset, ShieldCheck, Zap, BarChart3, Sun, Moon, Monitor } from 'lucide-react';

export default function AuthLayout({ children, title }) {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    const themeLabel = theme === 'dark'
        ? (language === 'id' ? 'Gelap' : 'Dark')
        : theme === 'system'
            ? 'System'
            : (language === 'id' ? 'Terang' : 'Light');

    const ThemeIcon = theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun;

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 overflow-hidden relative transition-colors duration-300">
                {/* Top-right controls */}
                <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
                    {/* Theme Switcher */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-full shadow-sm hover:bg-white text-sm font-medium text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <ThemeIcon className="h-4 w-4" />
                            </motion.button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content align="end" sideOffset={8} className="w-40 bg-white rounded-xl shadow-lg border border-neutral-200 p-1 z-50">
                                <DropdownMenu.Item
                                    onClick={() => setTheme('light')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                                >
                                    <Sun className="h-4 w-4" /> {language === 'id' ? 'Terang' : 'Light'}
                                    {theme === 'light' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onClick={() => setTheme('dark')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                                >
                                    <Moon className="h-4 w-4" /> {language === 'id' ? 'Gelap' : 'Dark'}
                                    {theme === 'dark' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onClick={() => setTheme('system')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 font-medium rounded-md hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                                >
                                    <Monitor className="h-4 w-4" /> {language === 'id' ? 'Sistem' : 'System'}
                                    {theme === 'system' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    {/* Language Switcher */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-full shadow-sm hover:bg-white text-sm font-medium text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <span className={`fi fi-${language === 'en' ? 'gb' : 'id'} rounded-sm text-base leading-none`} />
                                {language.toUpperCase()}
                            </motion.button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content align="end" sideOffset={8} className="w-32 bg-white rounded-xl shadow-lg border border-neutral-200 p-1 z-50">
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
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

                {/* ─────────────────────────────────────────────────── */}
                {/*  LEFT PANEL - Premium Institutional Branding       */}
                {/* ─────────────────────────────────────────────────── */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#07183B', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

                    {/* Background Image — dominant, full-bleed */}
                    <motion.div
                        initial={{ scale: 1.04 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute inset-0 opacity-100"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('/images/background.png')" }}
                        />
                        {/* Gradient overlay to make text pop based on the image, made lighter */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#07183B]/85 via-[#07183B]/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07183B]/80 via-transparent to-transparent" />
                    </motion.div>

                    <div className="relative z-10 flex flex-col justify-end h-full w-full px-12 pt-14 pb-10">
                        
                        {/* Top Content Wrapper - Aligned to bottom */}
                        <div className="flex flex-col mt-auto pb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
                                className="max-w-[460px]"
                            >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                                    <Headset className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white text-xs tracking-[0.08em] font-medium uppercase opacity-90">
                                    Internal Support Platform
                                </span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                                className="text-[36px] sm:text-[42px] font-extrabold text-white leading-[1.15] tracking-[-0.02em] mb-5"
                                style={{
                                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                IT Support<br />Ticketing System
                            </motion.h1>

                            {/* Divider line */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
                                className="w-16 h-[3px] bg-[#3B82F6] mb-5 origin-left"
                            />

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
                                className="text-[18px] font-bold text-[#60A5FA] tracking-[-0.01em] mb-3"
                            >
                                POLITEKNIK MITRA INDUSTRI
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.75, ease: 'easeOut' }}
                                className="text-white/80 text-[14px] font-normal leading-[1.6] max-w-[420px] min-h-[68px]"
                                style={{
                                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                {language === 'id'
                                    ? 'Sistem layanan dan pengelolaan tiket IT untuk mendukung operasional kampus secara lebih terstruktur, efisien, dan responsif.'
                                    : 'An IT service and ticket management system to support campus operations in a more structured, efficient, and responsive manner.'
                                }
                            </motion.p>
                        </motion.div>
                        </div>

                        {/* Bottom Feature Grid */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                        >
                            <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 items-center sm:items-start">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-[#1E3A8A]/40 flex items-center justify-center border border-[#3B82F6]/30 backdrop-blur-md">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-[13px] mb-1">Terstruktur</h4>
                                    <p className="text-white/60 text-[12px] leading-relaxed min-h-[36px]">
                                        {language === 'id' ? 'Alur kerja jelas dan terorganisasi' : 'Clear and organized workflow'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 items-center sm:items-start">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-[#1E3A8A]/40 flex items-center justify-center border border-[#3B82F6]/30 backdrop-blur-md">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-[13px] mb-1">Efisien</h4>
                                    <p className="text-white/60 text-[12px] leading-relaxed min-h-[36px]">
                                        {language === 'id' ? 'Penanganan cepat dan tepat sasaran' : 'Fast and accurate resolution'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 items-center sm:items-start">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-[#1E3A8A]/40 flex items-center justify-center border border-[#3B82F6]/30 backdrop-blur-md">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-[13px] mb-1">Transparan</h4>
                                    <p className="text-white/60 text-[12px] leading-relaxed min-h-[36px]">
                                        {language === 'id' ? 'Informasi tiket dipantau real-time' : 'Ticket info monitored in real-time'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────── */}
                {/*  RIGHT PANEL - Form                                */}
                {/* ─────────────────────────────────────────────────── */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white px-6 sm:px-12 lg:px-20 py-4 relative overflow-hidden transition-colors duration-300">

                    {/* Ambient Animated Background */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.3, 0.4, 0.3],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -top-[20%] -right-[10%] w-[70%] h-[60%] rounded-full bg-primary-50/50 blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.3, 0.2],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                            className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[50%] rounded-full bg-info-50/40 blur-3xl"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full max-w-[420px] mx-auto relative z-10"
                    >
                        {/* Mobile Logo Fallback */}
                        <div className="lg:hidden mb-4 text-center flex flex-col items-center">
                            <img src="/images/Logo_POLMIND.png" alt="POLMIND Logo" className="h-10 w-auto mb-2" />
                            <h1 className="text-xl font-bold text-primary-900 tracking-tight">
                                IT Support System
                            </h1>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 sm:p-8 ring-1 ring-neutral-200/50">
                            {children}
                        </div>

                        <p className="mt-8 text-center text-xs text-neutral-400 font-medium">
                            &copy; {new Date().getFullYear()} Politeknik Mitra Industri
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
