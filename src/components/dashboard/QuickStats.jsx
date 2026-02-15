import React from 'react';
import { Card } from '../ui/Card';
import { useSpending } from '../../context/SpendingContext';
import { motion } from 'framer-motion';

const QuickStats = () => {
    const { transactions, dailyLimit, spentToday } = useSpending();

    // Calculate stats
    const avgDailySpend = transactions.length > 0
        ? Math.floor(spentToday / Math.max(1, new Date().getDate()))
        : 0;

    const daysUnderLimit = calculateStreak();
    const weeklyTotal = calculateWeeklyTotal(transactions);
    const percentOfLimit = dailyLimit > 0 ? Math.floor((spentToday / dailyLimit) * 100) : 0;

    const stats = [
        {
            label: 'Avg Daily',
            value: `₹${avgDailySpend}`,
            icon: 'calendar',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'This Week',
            value: `₹${weeklyTotal}`,
            icon: 'chart-line-up',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Streak',
            value: `${daysUnderLimit} days`,
            icon: 'target',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Today',
            value: `${percentOfLimit}%`,
            icon: percentOfLimit > 80 ? 'chart-line-down' : 'chart-line-up',
            color: percentOfLimit > 80 ? 'text-red-500' : 'text-emerald-500',
            bg: percentOfLimit > 80 ? 'bg-red-500/10' : 'bg-emerald-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <i className={`fi fi-rr-${stat.icon} text-xl ${stat.color}`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    <p className="text-lg font-bold truncate">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Helper: Calculate streak of days under limit (mock for now)
const calculateStreak = () => {
    // In a real app, this would check historical data
    // For now, return a mock value
    return Math.floor(Math.random() * 7) + 1;
};

// Helper: Calculate weekly total
const calculateWeeklyTotal = (transactions) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return transactions
        .filter(tx => new Date(tx.date) >= weekAgo)
        .reduce((sum, tx) => sum + tx.amount, 0);
};

export { QuickStats };
