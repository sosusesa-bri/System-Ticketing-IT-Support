import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import 'flag-icons/css/flag-icons.min.css';

const appName = import.meta.env.VITE_APP_NAME || 'IT Support';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LanguageProvider>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </LanguageProvider>
        );
    },
    progress: {
        color: '#1D4ED8',
        showSpinner: true,
    },
});
