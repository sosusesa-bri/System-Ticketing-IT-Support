import { cn } from '../../lib/utils';

const statusConfig = {
    open: { bg: 'bg-info-100', text: 'text-info-600', label: 'Open' },
    on_process: { bg: 'bg-warning-100', text: 'text-warning-600', label: 'In Progress' },
    closed: { bg: 'bg-success-100', text: 'text-success-600', label: 'Closed' },
    reopened: { bg: 'bg-info-100', text: 'text-info-600', label: 'Reopened' },
};

const priorityConfig = {
    low: { bg: 'bg-neutral-100', text: 'text-neutral-500', label: 'Low' },
    medium: { bg: 'bg-info-100', text: 'text-info-600', label: 'Medium' },
    high: { bg: 'bg-warning-100', text: 'text-warning-600', label: 'High' },
    critical: { bg: 'bg-danger-100', text: 'text-danger-600', label: 'Critical' },
};

const variantConfig = {
    default: 'bg-neutral-100 text-neutral-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
    info: 'bg-info-100 text-info-600',
    neutral: 'bg-neutral-100 text-neutral-500',
};

export function Badge({ children, variant = 'default', className = '' }) {
    const baseClasses = 'inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium';
    const variantClasses = variantConfig[variant] || variantConfig.default;

    return (
        <span className={cn(baseClasses, variantClasses, className)}>
            {children}
        </span>
    );
}

export function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.open;
    return (
        <Badge className={cn(config.bg, config.text)}>
            {config.label}
        </Badge>
    );
}

export function PriorityBadge({ priority }) {
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
        <Badge className={cn(config.bg, config.text)}>
            {config.label}
        </Badge>
    );
}
