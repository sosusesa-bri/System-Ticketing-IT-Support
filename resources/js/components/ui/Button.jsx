import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-600 border border-transparent shadow-sm',
    secondary: 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-sm',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-50',
    danger: 'bg-danger-600 text-white hover:bg-red-700 border border-transparent shadow-sm',
    disabled: 'bg-neutral-100 text-neutral-400 border border-neutral-200 opacity-70 cursor-not-allowed',
};

const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
};

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    type = 'button',
    ...props
}, ref) => {
    const effectiveVariant = disabled ? 'disabled' : variant;

    return (
        <motion.button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2',
                variants[effectiveVariant],
                sizes[size],
                loading && 'opacity-80 cursor-wait',
                className,
            )}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
