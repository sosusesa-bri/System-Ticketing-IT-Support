import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = createContext(null);

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
};

const borderColors = {
    success: 'border-l-success-600',
    error: 'border-l-danger-600',
    warning: 'border-l-warning-600',
};

function ToastItem({ toast, onDismiss }) {
    const Icon = icons[toast.type] || CheckCircle;

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 4000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.15 }}
            className={cn(
                'flex items-start gap-3 bg-white border border-neutral-200 border-l-4 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 min-w-[320px] max-w-[420px]',
                borderColors[toast.type],
            )}
        >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-950 flex-1">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-neutral-400 hover:text-neutral-600 shrink-0"
                aria-label="Dismiss notification"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const { flash } = usePage().props;

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        if (flash?.success) addToast('success', flash.success);
        if (flash?.error) addToast('error', flash.error);
        if (flash?.warning) addToast('warning', flash.warning);
    }, [flash?.id, flash?.success, flash?.error, flash?.warning, addToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}
