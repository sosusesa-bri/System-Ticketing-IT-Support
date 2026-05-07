import { cn } from '../../lib/utils';

export default function Card({ children, className = '', ...props }) {
    return (
        <div
            className={cn(
                'bg-white border border-neutral-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h2 className={cn('text-lg font-semibold text-neutral-950', className)}>
            {children}
        </h2>
    );
}
