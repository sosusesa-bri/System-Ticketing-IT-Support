import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
    label,
    id,
    error,
    helpText,
    className = '',
    type = 'text',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    return (
        <div className="space-y-1.5 flex flex-col">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-semibold text-neutral-700"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    className={cn(
                        'flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 transition-all duration-200',
                        'placeholder:text-neutral-400 shadow-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600',
                        'hover:border-neutral-300',
                        error && 'border-danger-500 bg-danger-50/30 focus:border-danger-500 focus:ring-danger-500/20 hover:border-danger-500 text-danger-900',
                        isPassword && 'pr-10',
                        className,
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>
            
            <AnimatePresence mode="wait">
                {error && (
                    <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="text-[13px] font-medium text-danger-600 mt-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
            
            {helpText && !error && (
                <p className="text-[13px] text-neutral-500">{helpText}</p>
            )}
        </div>
    );
}
