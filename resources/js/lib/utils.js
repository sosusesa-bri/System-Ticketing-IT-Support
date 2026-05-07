/**
 * Utility function for merging class names.
 * Lightweight alternative to clsx for this project.
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Truncate text to a specific length.
 */
export function truncate(text, length = 50) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
}
