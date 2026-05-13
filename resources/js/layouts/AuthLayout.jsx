import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';

export default function AuthLayout({ children, title }) {
    const { language, setLanguage } = useLanguage();

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex bg-neutral-50 overflow-hidden relative">
                {/* Language Switcher */}
                <div className="absolute top-6 right-6 z-50">
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
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#0F2A5F', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

                    {/* Background Image — dominant, full-bleed */}
                    <motion.div
                        initial={{ scale: 1.04 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="absolute inset-0 opacity-60"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: "url('/images/background.png')" }}
                        />
                    </motion.div>

                    {/* Text Composition — bottom-left, editorial rhythm */}
                    <div className="relative z-10 flex flex-col justify-end h-full w-full px-10 pb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
                            className="max-w-[460px]"
                        >
                            {/* Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                                className="text-[30px] font-extrabold text-white leading-[1.1] tracking-[-0.02em]"
                                style={{
                                    textShadow: '0 2px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                IT Support System
                            </motion.h1>

                            {/* Institution name */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
                                className="text-[18px] font-bold text-white text-white leading-[1.1 tracking-[-0.01em]"
                                style={{
                                    textShadow: '0 2px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                Politeknik Mitra Industri
                            </motion.p>

                            {/* Divider — refined thin line */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
                                className="w-16 h-[2px] bg-white/40 mt-6 mb-5 origin-left"
                            />

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.75, ease: 'easeOut' }}
                                className="text-white/80 text-[13.5px] font-medium leading-[1.7] max-w-[360px]"
                                style={{
                                    textShadow: '0 1px 6px rgba(0, 0, 0, 0.12)',
                                }}
                            >
                                {language === 'id'
                                    ? 'Sistem layanan dan pengelolaan tiket IT untuk mendukung kebutuhan operasional Politeknik Mitra Industri'
                                    : 'An IT service and ticket management system to support the operational needs of Politeknik Mitra Industri'
                                }
                            </motion.p>
                        </motion.div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────── */}
                {/*  RIGHT PANEL - Form                                */}
                {/* ─────────────────────────────────────────────────── */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white px-6 sm:px-16 lg:px-24 py-12 relative overflow-hidden">

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
                        className="w-full max-w-md mx-auto relative z-10"
                    >
                        {/* Mobile Logo Fallback */}
                        <div className="lg:hidden mb-10 text-center flex flex-col items-center">
                            <img src="/images/Logo_POLMIND.png" alt="POLMIND Logo" className="h-16 w-auto mb-4" />
                            <h1 className="text-2xl font-bold text-primary-900 tracking-tight">
                                IT Support System
                            </h1>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 sm:p-10 ring-1 ring-neutral-200/50">
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
