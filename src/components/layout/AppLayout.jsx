import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useUser } from '../../context/UserContext'; // Verify this path

const AppLayout = () => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { theme, setTheme } = useUser();

    // Mobile Bottom Nav Items
    const navItems = [
        { path: '/dashboard', icon: 'home', label: 'Home' },
        { path: '/lim-ai', icon: 'brain', label: 'LIM AI' },
        { path: '/insights', icon: 'chart-pie', label: 'Insights' },
        { path: '/settings', icon: 'settings', label: 'Settings' },
    ];

    // Filter out Home, Profile, and Settings for Desktop Top Nav (Home is Logo, Profile is Dropdown, Settings is in Dropdown)
    const desktopNavItems = navItems.filter(item => item.path !== '/dashboard' && item.path !== '/profile' && item.path !== '/settings');

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0 md:pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Sticky Bottom Nav (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-border z-50 safe-area-bottom">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground/80"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute -top-[1px] w-12 h-[2px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    />
                                )}
                                <i className={cn(`fi fi-rr-${item.icon} text-2xl`, isActive && "text-primary")}></i>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Side/Top Nav */}
            <nav className="hidden md:flex fixed top-0 w-full h-16 border-b border-border bg-background/50 backdrop-blur-md z-50 px-6 items-center justify-between">
                {/* Logo - Redirects to Dashboard */}
                <NavLink to="/dashboard" className="flex items-center gap-2 group">
                    <img src="/src/assets/logo.png" alt="Limit U Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-xl tracking-tight text-foreground group-hover:opacity-90 transition-opacity">Limit U</span>
                </NavLink>

                <div className="flex items-center gap-6">
                    {desktopNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "text-sm font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50",
                                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <i className={cn(`fi fi-rr-${item.icon} text-base`)}></i>
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Profile Dropdown */}
                    <div className="relative ml-4 flex items-center gap-4">
                        {/* Theme Toggle inside Dashboard */}
                        <button
                            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <i className="fi fi-rr-sun text-xl"></i> : <i className="fi fi-rr-moon text-xl"></i>}
                        </button>

                        {/* Profile Avatar Button */}
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold hover:bg-primary/20 transition-colors">
                                <i className="fi fi-rr-user text-lg"></i>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 py-1"
                                    >
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="text-sm font-medium text-foreground">My Profile</p>
                                        </div>
                                        <NavLink
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <i className="fi fi-rr-user text-base"></i>
                                            View Profile
                                        </NavLink>
                                        <NavLink
                                            to="/settings"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <i className="fi fi-rr-settings text-base"></i>
                                            Settings
                                        </NavLink>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default AppLayout;
