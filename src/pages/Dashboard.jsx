import React from 'react';
import { DailyLimitCard } from '../components/dashboard/DailyLimitCard';
import { CoachWidget } from '../components/dashboard/CoachWidget';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { QuickStats } from '../components/dashboard/QuickStats';
import { useSpending } from '../context/SpendingContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';
import Walkthrough from '../components/onboarding/Walkthrough';
import { motion, AnimatePresence } from 'framer-motion';

// ... imports

// ... imports

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { addTransaction, deleteTransaction, transactions, resetData, dailyLimit, spentToday, weekendBias } = useSpending();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = React.useState(null);

    // Quick Add handlers for simulation
    const handleQuickAdd = (amount, category, label) => {
        addTransaction(amount, label, category);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this transaction?')) {
            setDeletingId(id);
            setTimeout(() => {
                deleteTransaction(id);
                setDeletingId(null);
            }, 300);
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const handleReset = () => {
        if (confirm("Reset all data? This cannot be undone.")) {
            resetData();
            navigate('/onboarding');
        }
    };

    // Contextual Greeting Logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        const day = new Date().getDay();
        const name = user?.name ? user.name.split(' ')[0] : 'Legend';

        let timeGreeting = "Good morning";
        if (hour >= 12) timeGreeting = "Good afternoon";
        if (hour >= 17) timeGreeting = "Good evening";

        let contextMsg = "Let's make it a great day.";
        if (day === 0 || day === 6) contextMsg = "Weekend mode is active. Enjoy!";
        else if (day === 5) contextMsg = "Happy Friday! Finish strong.";

        // Check recent spending trend (simple mock)
        const percentUsed = (spentToday / dailyLimit) * 100;
        if (dailyLimit > 0 && percentUsed > 80) contextMsg = "Watch your limit today.";

        return { title: `${timeGreeting}, ${name}`, subtitle: contextMsg };
    };

    const [showWalkthrough, setShowWalkthrough] = React.useState(false);

    React.useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenWalkthrough');
        if (!hasSeen) {
            setShowWalkthrough(true);
        }
    }, []);

    const handleWalkthroughComplete = () => {
        setShowWalkthrough(false);
        localStorage.setItem('hasSeenWalkthrough', 'true');
    };

    const greeting = getGreeting();

    // Ambient Color Logic
    const percent = dailyLimit > 0 ? (spentToday / dailyLimit) * 100 : 0;
    let ambientColor = "bg-primary/20"; // Default Blue
    if (percent > 90) ambientColor = "bg-red-500/20";
    else if (percent > 70) ambientColor = "bg-yellow-500/20";

    return (
        <div className="min-h-screen pt-24 pb-24 px-4 md:px-6 container mx-auto max-w-4xl relative">
            {showWalkthrough && <Walkthrough onComplete={handleWalkthroughComplete} />}
            {/* Dynamic Ambient Background */}
            <div className={cn(
                "fixed top-0 left-0 w-full h-[50vh] rounded-b-[100%] blur-[120px] -z-10 transition-colors duration-1000",
                ambientColor
            )} />

            <div className="fixed bottom-0 right-0 w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] -z-10" />
            <header className="mb-8 flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {greeting.title}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {greeting.subtitle}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                    <Link to="/profile" className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20 transition-colors overflow-hidden shrink-0 md:hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.[0] || <i className="fi fi-rr-user text-xl"></i>
                        )}
                    </Link>

                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleReset} title="Reset Account" className="text-muted-foreground hover:text-red-400 h-8 px-2">
                            <i className="fi fi-rr-refresh text-lg"></i>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout" className="text-muted-foreground hover:text-foreground h-8 px-2">
                            <i className="fi fi-rr-sign-out-alt text-lg"></i>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="mb-6">
                <QuickStats />
            </div>

            {/* Main Stats */}
            <div className="mb-10">
                <DailyLimitCard />
            </div>

            {/* Quick Actions (Simulation) */}
            <h2 className="text-lg font-semibold mb-4 px-1">Simulate Spend</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <Button variant="secondary" className="h-24 flex flex-col gap-2 rounded-2xl border border-border" onClick={() => handleQuickAdd(20, 'Food', 'Snacks')}>
                    <i className="fi fi-rr-coffee text-2xl text-orange-400"></i>
                    <span>₹20 Snacks</span>
                </Button>
                <Button variant="secondary" className="h-24 flex flex-col gap-2 rounded-2xl border border-border" onClick={() => handleQuickAdd(50, 'Transport', 'Auto')}>
                    <i className="fi fi-rr-bus text-2xl text-blue-400"></i>
                    <span>₹50 Travel</span>
                </Button>
                <Button variant="secondary" className="h-24 flex flex-col gap-2 rounded-2xl border border-border" onClick={() => handleQuickAdd(150, 'Shopping', 'Stationery')}>
                    <i className="fi fi-rr-shopping-bag text-2xl text-purple-400"></i>
                    <span>₹150 Stuff</span>
                </Button>
                <Link to="/pay" className="h-24">
                    <Button className="w-full h-full flex flex-col gap-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                        <i className="fi fi-rr-plus text-2xl"></i>
                        <span>Custom Amount</span>
                    </Button>
                </Link>
            </div>

            {/* Category Breakdown */}
            {transactions.length > 0 && (
                <div className="mb-10">
                    <CategoryBreakdown />
                </div>
            )}

            {/* Recent Activity */}
            <h2 className="text-lg font-semibold mb-4 px-1">Today's Activity</h2>
            <div className="space-y-3">
                {transactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-card/50 rounded-2xl border border-dashed border-border">
                        <p className="mb-2">No spending yet today. Great job!</p>
                        <p className="text-xs">Use the buttons above to simulate transactions</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {transactions.map(tx => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="group flex justify-between items-center p-4 rounded-xl border-border bg-card hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center",
                                            tx.category === 'Food' && 'bg-orange-500/10',
                                            tx.category === 'Transport' && 'bg-blue-500/10',
                                            tx.category === 'Shopping' && 'bg-purple-500/10'
                                        )}>
                                            {tx.category === 'Food' && <i className="fi fi-rr-coffee text-xl text-orange-500"></i>}
                                            {tx.category === 'Transport' && <i className="fi fi-rr-bus text-xl text-blue-500"></i>}
                                            {tx.category === 'Shopping' && <i className="fi fi-rr-shopping-bag text-xl text-purple-500"></i>}
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="font-medium">{tx.description}</span>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{tx.category}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <i className="fi fi-rr-clock text-xs"></i>
                                                    {getTimeAgo(tx.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-red-400">- ₹{tx.amount}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                            onClick={() => handleDelete(tx.id)}
                                        >
                                            <i className="fi fi-rr-trash text-base text-destructive"></i>
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <CoachWidget />
        </div>
    );
};

export default Dashboard;
