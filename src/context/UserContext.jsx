import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Preferences
    const [aiIntensity, setAiIntensity] = useState(() => localStorage.getItem('aiIntensity') || 'balanced'); // low, balanced, high
    const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications') === 'true');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    // User Profile (could be merged with Auth user, but keeping separate for operational settings)
    const [spendingPersonality, setSpendingPersonality] = useState('Saver'); // Mock calculation

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem('aiIntensity', aiIntensity);
        localStorage.setItem('notifications', notifications);
        localStorage.setItem('theme', theme);
    }, [aiIntensity, notifications, theme]);

    return (
        <UserContext.Provider value={{
            aiIntensity, setAiIntensity,
            notifications, setNotifications,
            theme, setTheme,
            spendingPersonality
        }}>
            {children}
        </UserContext.Provider>
    );
};
