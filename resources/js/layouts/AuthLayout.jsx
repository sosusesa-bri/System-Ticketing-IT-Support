import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe } from 'lucide-react';
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

                {/* Left Panel - Branding & Background */}
                <div className="hidden lg:flex lg:w-1/2 bg-primary-900 relative overflow-hidden flex-col items-center justify-end pb-24">
                    {/* Background image anchored to the left/center */}
                    <motion.div 
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-80"
                        style={{ backgroundImage: "url('/images/background.png')" }}
                    >
                        {/* Overlay gradient to smooth transition to text area */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent"></div>
                    </motion.div>
                    
                    {/* Text content aligned to the lower center of the left panel */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-lg text-center px-8"
                    >
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight drop-shadow-md">
                            IT Support<br/>Ticketing System
                        </h1>
                        <p className="text-primary-100/90 text-lg leading-relaxed font-medium">
                            {language === 'id' 
                                ? 'Bantuan IT yang mulus, efisien, dan profesional untuk Politeknik Mitra Industri.'
                                : 'Seamless, efficient, and professional IT assistance for Politeknik Mitra Industri.'}
                        </p>
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
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
                                IT Support Ticketing
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
