import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

function applyThemeClass(theme) {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
        root.classList.add(theme);
    }
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    // Apply theme class whenever theme state changes
    useEffect(() => {
        applyThemeClass(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for OS color-scheme changes when in "system" mode
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyThemeClass('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
    }, []);

    // Sync theme from backend user preference on login/page load
    const syncTheme = useCallback((backendTheme) => {
        if (backendTheme && backendTheme !== theme) {
            setThemeState(backendTheme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, syncTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
