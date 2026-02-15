import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Dropdown state
    const profileRef = useRef(null); // Ref for clicking outside

    const location = useLocation();

    // Get user from auth context
    const { user, logout } = useAuth();
    // Get theme from user context
    const { theme, setTheme } = useUser();

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        setIsProfileOpen(false);
    }, [location]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/src/assets/logo.png" alt="Limit U Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold tracking-tight text-foreground">Limit U</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">About</Link>
                        <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Team</Link>


                        {/* Theme Toggle (Desktop) */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <i className="fi fi-rr-sun text-xl"></i> : <i className="fi fi-rr-moon text-xl"></i>}
                        </button>

                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold hover:bg-primary/20 transition-colors">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.name ? user.name.charAt(0).toUpperCase() : <i className="fi fi-rr-user text-lg"></i>
                                        )}
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50 p-1"
                                        >
                                            <div className="px-4 py-3 border-b border-border mb-1">
                                                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>

                                            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                                                <i className="fi fi-rr-dashboard text-base"></i> Dashboard
                                            </Link>
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                                                <i className="fi fi-rr-user text-base"></i> Profile
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                                                <i className="fi fi-rr-settings text-base"></i> Settings
                                            </Link>

                                            <div className="h-px bg-border my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left"
                                            >
                                                <i className="fi fi-rr-sign-out-alt text-base"></i> Log out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/auth">
                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                                    Join Us
                                </Button>
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Action Button & Theme */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                        >
                            {theme === 'dark' ? <i className="fi fi-rr-sun text-xl"></i> : <i className="fi fi-rr-moon text-xl"></i>}
                        </button>

                        {user ? (
                            <Link to="/dashboard">
                                <Button size="sm" className="bg-primary text-primary-foreground">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button size="sm" className="bg-primary text-primary-foreground">
                                    Join Us
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export { Navbar };
