import React from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useSpending } from '../context/SpendingContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const Settings = () => {
    const { aiIntensity, setAiIntensity, notifications, setNotifications, theme, setTheme } = useUser();
    const { logout } = useAuth();
    const { resetData } = useSpending();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const handleReset = () => {
        if (confirm("Reset account data?")) {
            resetData();
            navigate('/onboarding');
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-6 pt-8 pb-24">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="flex items-center gap-2 font-semibold mb-6 text-lg">
                        <i className="fi fi-rr-brain text-xl text-purple-400"></i>
                        LIM AI Preferences
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                        {['low', 'balanced', 'high'].map(level => (
                            <button
                                key={level}
                                onClick={() => setAiIntensity(level)}
                                className={cn(
                                    "p-3 rounded-xl border text-sm capitalize transition-all",
                                    aiIntensity === level
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-white/10 hover:bg-secondary"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        Controls how proactive the AI is with nudges and warnings.
                    </p>
                </Card>

                <Card className="p-6">
                    <h3 className="flex items-center gap-2 font-semibold mb-6 text-lg">
                        <i className="fi fi-rr-bell text-xl text-yellow-400"></i>
                        Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Enable Push Notifications</span>
                        <div
                            className={cn(
                                "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                                notifications ? "bg-green-500" : "bg-gray-700"
                            )}
                            onClick={() => setNotifications(!notifications)}
                        >
                            <div className={cn(
                                "w-4 h-4 bg-white rounded-full transition-transform",
                                notifications ? "translate-x-6" : "translate-x-0"
                            )} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="flex items-center gap-2 font-semibold mb-6 text-lg">
                        <i className="fi fi-rr-eye text-xl text-blue-400"></i>
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Dark Mode</span>
                        <div
                            className={cn(
                                "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                                theme === 'dark' ? "bg-primary" : "bg-gray-300"
                            )}
                            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                        >
                            <div className={cn(
                                "w-4 h-4 bg-white rounded-full transition-transform",
                                theme === 'dark' ? "translate-x-6" : "translate-x-0"
                            )} />
                        </div>
                    </div>
                </Card>

                <div className="pt-8 space-y-3">
                    <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20" onClick={handleReset}>
                        <i className="fi fi-rr-refresh text-base mr-2"></i> Reset Account Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <i className="fi fi-rr-sign-out-alt text-base mr-2"></i> Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
