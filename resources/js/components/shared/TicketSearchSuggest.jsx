import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Search, Tickets, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TicketSearchSuggest({ placeholder }) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (value) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/tickets-search/suggest?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                setResults(data);
                setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-9 w-full sm:w-64 rounded-lg border border-neutral-200 bg-white pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                {query && (
                    <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
                    {results.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={`/tickets/${ticket.id}`}
                            onClick={() => { setOpen(false); setQuery(''); }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                        >
                            <Tickets className="h-4 w-4 text-neutral-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">{ticket.title}</p>
                                <p className="text-xs text-neutral-500">{ticket.ticket_number}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {open && results.length === 0 && !loading && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 p-4 text-center">
                    <p className="text-sm text-neutral-500">{t('noData')}</p>
                </div>
            )}
        </div>
    );
}
